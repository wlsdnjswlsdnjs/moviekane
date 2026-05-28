import { NextResponse } from "next/server";
import { stations } from "@/data/movie-map";
import {
  getTmdbStationPayload,
  TmdbMissingConfigError,
  TmdbRequestError,
} from "@/lib/tmdb";

type RouteContext = {
  params: Promise<{ stationId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { stationId } = await context.params;
  const station = stations.find((item) => item.id === stationId);

  if (!station) {
    return NextResponse.json(
      { status: "not_found", message: "Unknown movie station." },
      { status: 404 },
    );
  }

  try {
    const payload = await getTmdbStationPayload(station);

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "s-maxage=43200, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    if (error instanceof TmdbMissingConfigError) {
      return NextResponse.json(
        {
          status: "missing_config",
          message: error.message,
        },
        { status: 503 },
      );
    }

    if (error instanceof TmdbRequestError) {
      return NextResponse.json(
        {
          status: "tmdb_error",
          message: error.message,
        },
        { status: error.status },
      );
    }

    throw error;
  }
}
