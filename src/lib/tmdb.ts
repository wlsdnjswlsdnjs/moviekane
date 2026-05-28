import type { Station } from "@/data/movie-map";

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const KOREA_REGION = "KR";
const KOREAN_LANGUAGE = "ko-KR";
const CACHE_REVALIDATE_SECONDS = 60 * 60 * 12;

type TmdbSearchResult = {
  id: number;
  title: string;
  original_title: string;
  release_date?: string;
  poster_path?: string | null;
};

type TmdbSearchResponse = {
  results: TmdbSearchResult[];
};

type TmdbMovieDetails = {
  id: number;
  title: string;
  original_title: string;
  overview?: string;
  release_date?: string;
  runtime?: number | null;
  poster_path?: string | null;
  genres?: Array<{ id: number; name: string }>;
};

type TmdbProvider = {
  display_priority: number;
  logo_path?: string | null;
  provider_id: number;
  provider_name: string;
};

type TmdbProviderGroup = "flatrate" | "rent" | "buy" | "ads" | "free";

type TmdbRegionWatchProviders = {
  link?: string;
} & Partial<Record<TmdbProviderGroup, TmdbProvider[]>>;

type TmdbWatchProvidersResponse = {
  id: number;
  results: Record<string, TmdbRegionWatchProviders | undefined>;
};

type TmdbAuth = {
  headers: Record<string, string>;
  apiKey: string | null;
};

export type NormalizedTmdbProvider = {
  id: number;
  name: string;
  logoUrl: string | null;
};

export type TmdbStationPayload = {
  movie: {
    tmdbId: number;
    title: string;
    originalTitle: string;
    overview: string | null;
    releaseDate: string | null;
    runtimeMinutes: number | null;
    posterUrl: string | null;
    tmdbUrl: string;
    genres: string[];
  };
  watch: {
    region: "KR";
    link: string | null;
    providers: Record<TmdbProviderGroup, NormalizedTmdbProvider[]>;
  };
  attribution: {
    metadata: "TMDb";
    availability: "JustWatch via TMDb";
  };
};

export class TmdbMissingConfigError extends Error {
  constructor() {
    super("TMDB_READ_ACCESS_TOKEN or TMDB_API_KEY is required.");
    this.name = "TmdbMissingConfigError";
  }
}

export class TmdbRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "TmdbRequestError";
    this.status = status;
  }
}

function tmdbImageUrl(path: string | null | undefined, size: string) {
  if (!path) {
    return null;
  }

  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

function normalizeComparableTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "");
}

function releaseYear(result: TmdbSearchResult) {
  return result.release_date?.slice(0, 4) ?? null;
}

function pickBestSearchResult(
  results: TmdbSearchResult[],
  title: string,
  year: number,
) {
  const comparableTitle = normalizeComparableTitle(title);
  const hasMatchingTitle = (result: TmdbSearchResult) => {
    const resultTitles = [
      normalizeComparableTitle(result.title),
      normalizeComparableTitle(result.original_title),
    ];

    return resultTitles.includes(comparableTitle);
  };

  return (
    results.find(
      (result) => hasMatchingTitle(result) && releaseYear(result) === String(year),
    ) ??
    results.find(hasMatchingTitle) ??
    results.find((result) => releaseYear(result) === String(year)) ??
    results[0] ??
    null
  );
}

function tmdbAuth(): TmdbAuth | null {
  const readAccessToken = process.env.TMDB_READ_ACCESS_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;

  if (readAccessToken) {
    return {
      headers: { Authorization: `Bearer ${readAccessToken}` },
      apiKey: null,
    };
  }

  if (apiKey) {
    return {
      headers: {},
      apiKey,
    };
  }

  return null;
}

async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
) {
  const auth = tmdbAuth();

  if (!auth) {
    throw new TmdbMissingConfigError();
  }

  const url = new URL(`${TMDB_API_BASE_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  if (auth.apiKey) {
    url.searchParams.set("api_key", auth.apiKey);
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...auth.headers,
    },
    next: { revalidate: CACHE_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new TmdbRequestError(
      response.status,
      `TMDb request failed with ${response.status}.`,
    );
  }

  return (await response.json()) as T;
}

async function searchMovie(station: Station) {
  const primarySearch = await tmdbFetch<TmdbSearchResponse>("/search/movie", {
    query: station.titleEn,
    primary_release_year: station.year,
    include_adult: false,
    language: KOREAN_LANGUAGE,
    region: KOREA_REGION,
  });

  const primaryMatch = pickBestSearchResult(
    primarySearch.results,
    station.titleEn,
    station.year,
  );

  if (primaryMatch) {
    return primaryMatch;
  }

  const fallbackSearch = await tmdbFetch<TmdbSearchResponse>("/search/movie", {
    query: station.titleEn,
    include_adult: false,
    language: KOREAN_LANGUAGE,
    region: KOREA_REGION,
  });

  return pickBestSearchResult(fallbackSearch.results, station.titleEn, station.year);
}

function normalizeProviders(providers: TmdbProvider[] | undefined) {
  return (providers ?? [])
    .slice()
    .sort((first, second) => first.display_priority - second.display_priority)
    .map((provider) => ({
      id: provider.provider_id,
      name: provider.provider_name,
      logoUrl: tmdbImageUrl(provider.logo_path, "w92"),
    }));
}

export async function getTmdbStationPayload(
  station: Station,
): Promise<TmdbStationPayload> {
  const searchResult = await searchMovie(station);

  if (!searchResult) {
    throw new TmdbRequestError(404, `No TMDb movie match for ${station.titleEn}.`);
  }

  const [details, watchProviders] = await Promise.all([
    tmdbFetch<TmdbMovieDetails>(`/movie/${searchResult.id}`, {
      language: KOREAN_LANGUAGE,
    }),
    tmdbFetch<TmdbWatchProvidersResponse>(`/movie/${searchResult.id}/watch/providers`),
  ]);
  const koreaWatchProviders = watchProviders.results[KOREA_REGION];

  return {
    movie: {
      tmdbId: details.id,
      title: details.title,
      originalTitle: details.original_title,
      overview: details.overview?.trim() || null,
      releaseDate: details.release_date || searchResult.release_date || null,
      runtimeMinutes: details.runtime ?? null,
      posterUrl: tmdbImageUrl(details.poster_path ?? searchResult.poster_path, "w342"),
      tmdbUrl: `https://www.themoviedb.org/movie/${details.id}`,
      genres: (details.genres ?? []).map((genre) => genre.name),
    },
    watch: {
      region: KOREA_REGION,
      link: koreaWatchProviders?.link ?? null,
      providers: {
        flatrate: normalizeProviders(koreaWatchProviders?.flatrate),
        rent: normalizeProviders(koreaWatchProviders?.rent),
        buy: normalizeProviders(koreaWatchProviders?.buy),
        ads: normalizeProviders(koreaWatchProviders?.ads),
        free: normalizeProviders(koreaWatchProviders?.free),
      },
    },
    attribution: {
      metadata: "TMDb",
      availability: "JustWatch via TMDb",
    },
  };
}
