export type LineId = "intro" | "classic" | "drama" | "momentum";

export type EntryZone =
  | "편하게 시작"
  | "조금 더 깊이"
  | "밀도 있음"
  | "천천히 들어가기";

export type StationType = "start" | "normal" | "transfer" | "terminal";

export type Line = {
  id: LineId;
  slug: LineId;
  name: string;
  shortName: string;
  color: string;
  description: string;
  startStationId: string;
  terminalStationId: string;
  stationIds: string[];
  routeTheme: LineId;
  category: string;
  difficultyLabel: string;
  purpose: string;
  pathPoints?: Array<{ x: number; y: number }>;
};

export type Station = {
  id: string;
  stationKind?: "movie" | "empty";
  titleKo: string;
  labelKo?: string;
  titleEn: string;
  year: number;
  runtimeMinutes: number;
  director: string;
  country: string;
  lines: LineId[];
  stationType: StationType;
  x: number;
  y: number;
  labelOffset?: {
    x: number;
    y: number;
  };
  entryZone: EntryZone;
  entryDifficulty: number;
  tags: string[];
  reason: string;
  skill: string;
};

export type Edge = {
  id: string;
  from: string;
  to: string;
  lineId: LineId;
  reason: string;
};

export type TransferNote = {
  stationId: string;
  lineIds: LineId[];
  reason: string;
};

export const v2MovieStationIds: Record<LineId, string[]> = {
  intro: [
    "back-to-the-future",
    "jurassic-park",
    "truman-show",
    "groundhog-day",
    "social-network",
    "whiplash",
    "grand-budapest-hotel",
    "get-out",
    "inception",
    "eternal-sunshine",
  ],
  classic: [
    "jaws",
    "rocky",
    "singin-in-the-rain",
    "12-angry-men",
    "rear-window",
    "dog-day-afternoon",
    "chinatown",
    "the-godfather",
    "taxi-driver",
    "citizen-kane",
  ],
  drama: [
    "little-miss-sunshine",
    "lady-bird",
    "good-will-hunting",
    "truman-show",
    "before-sunrise",
    "past-lives",
    "moonlight",
    "marriage-story",
    "manchester-by-the-sea",
    "yi-yi",
  ],
  momentum: [
    "the-bourne-identity",
    "casino-royale",
    "edge-of-tomorrow",
    "whiplash",
    "sicario",
    "mission-impossible-fallout",
    "top-gun-maverick",
    "rrr",
    "mad-max-fury-road",
    "john-wick-chapter-4",
  ],
};

export const lineStationIds: Record<LineId, string[]> = v2MovieStationIds;

export const lines: Line[] = [
  {
    id: "intro",
    slug: "intro",
    name: "영화 좀 좋아해볼까선",
    shortName: "입문선",
    color: "#B63A1B",
    description:
      "대중적 재미에서 출발해, 영화의 구조와 스타일을 조금씩 의식하게 되는 노선.",
    startStationId: "back-to-the-future",
    terminalStationId: "eternal-sunshine",
    stationIds: [...lineStationIds.intro],
    routeTheme: "intro",
    category: "v2 intro line",
    difficultyLabel: "편하게 시작",
    purpose: "대중적 재미에서 영화 보는 감각으로 넘어가기",
    pathPoints: [
      { x: 120, y: 360 },
      { x: 300, y: 360 },
      { x: 480, y: 360 },
      { x: 660, y: 360 },
      { x: 780, y: 360 },
      { x: 900, y: 360 },
      { x: 1040, y: 500 },
      { x: 1200, y: 500 },
      { x: 1360, y: 660 },
      { x: 1520, y: 660 },
    ],
  },
  {
    id: "classic",
    slug: "classic",
    name: "지금 봐도 재밌는 고전선",
    shortName: "고전선",
    color: "#0F5132",
    description:
      "오래됐지만 지금 봐도 바로 재미가 잡히는 영화들로 고전 문법에 익숙해지는 노선.",
    startStationId: "jaws",
    terminalStationId: "citizen-kane",
    stationIds: [...lineStationIds.classic],
    routeTheme: "classic",
    category: "v2 classic line",
    difficultyLabel: "고전 입구",
    purpose: "오래된 영화의 장벽을 낮추고 고전 문법에 익숙해지기",
    pathPoints: [
      { x: 120, y: 1120 },
      { x: 280, y: 1120 },
      { x: 440, y: 1120 },
      { x: 600, y: 1120 },
      { x: 760, y: 1120 },
      { x: 920, y: 1120 },
      { x: 1080, y: 1120 },
      { x: 1240, y: 1120 },
      { x: 1400, y: 1120 },
      { x: 1560, y: 1120 },
    ],
  },
  {
    id: "drama",
    slug: "drama",
    name: "인물 따라가는 드라마선",
    shortName: "드라마선",
    color: "#2563EB",
    description:
      "인물의 감정과 관계를 따라가며 영화의 깊이로 들어가는 노선.",
    startStationId: "little-miss-sunshine",
    terminalStationId: "yi-yi",
    stationIds: [...lineStationIds.drama],
    routeTheme: "drama",
    category: "v2 drama line",
    difficultyLabel: "감정 입구",
    purpose: "인물의 감정과 관계를 따라 영화의 깊이로 들어가기",
    pathPoints: [
      { x: 120, y: 720 },
      { x: 240, y: 600 },
      { x: 360, y: 480 },
      { x: 480, y: 360 },
      { x: 600, y: 480 },
      { x: 720, y: 600 },
      { x: 840, y: 720 },
      { x: 960, y: 840 },
      { x: 1140, y: 840 },
      { x: 1320, y: 840 },
    ],
  },
  {
    id: "momentum",
    slug: "momentum",
    name: "일단 재밌어야선",
    shortName: "몰입선",
    color: "#D6A13A",
    description:
      "현대 액션, 스릴러, 압박감으로 영화의 추진력을 체감하는 노선.",
    startStationId: "the-bourne-identity",
    terminalStationId: "john-wick-chapter-4",
    stationIds: [...lineStationIds.momentum],
    routeTheme: "momentum",
    category: "v2 momentum line",
    difficultyLabel: "몰입 빠름",
    purpose: "강한 후킹과 장르적 추진력으로 감상 체력 만들기",
    pathPoints: [
      { x: 900, y: 60 },
      { x: 900, y: 180 },
      { x: 900, y: 300 },
      { x: 900, y: 360 },
      { x: 1040, y: 220 },
      { x: 1200, y: 220 },
      { x: 1360, y: 220 },
      { x: 1500, y: 360 },
      { x: 1500, y: 500 },
      { x: 1620, y: 500 },
    ],
  },
];

const transferLineIds: Record<string, LineId[]> = {
  "truman-show": ["intro", "drama"],
  whiplash: ["intro", "momentum"],
};

export const mapPlanningRules = {
  allowedSegmentAngles: [0, 45, 90],
  maxStationGap: 320,
  minUnrelatedStationGap: 84,
  transferCriteria: [
    "두 노선의 감상 성격을 모두 설명할 수 있는 영화일 것",
    "각 노선의 앞뒤 역 연결이 끊기지 않을 것",
    "환승역 하나 때문에 노선이 장거리 점프나 되돌아가는 모양이 되지 않을 것",
    "환승역이 아니라면 다른 노선을 지나가지 않을 것",
  ],
} as const;

export const movieTitleGuidelines = [
  {
    title: "통용 제목 우선",
    body: "국내에서 가장 널리 쓰이는 한국어 제목을 기본 역명으로 쓴다.",
  },
  {
    title: "시리즈명 보강",
    body: "부제만으로 작품이 흐려지는 프랜차이즈는 시리즈명을 앞에 붙인다.",
  },
  {
    title: "지도 라벨 압축",
    body: "긴 제목은 지도에서 줄일 수 있지만, 작품 식별에 필요한 이름은 남긴다.",
  },
  {
    title: "메타 정보 분리",
    body: "연도, 감독, 국가는 제목에 붙이지 않고 역 정보와 내부 데이터로 분리한다.",
  },
] as const;

const stationCoordinates: Record<
  string,
  { x: number; y: number; labelOffset?: Station["labelOffset"] }
> = {
  "back-to-the-future": { x: 120, y: 360, labelOffset: { x: 0, y: 34 } },
  "jurassic-park": { x: 300, y: 360, labelOffset: { x: 0, y: -34 } },
  "truman-show": { x: 480, y: 360, labelOffset: { x: -58, y: -38 } },
  "groundhog-day": { x: 660, y: 360, labelOffset: { x: 0, y: -36 } },
  "social-network": { x: 780, y: 360, labelOffset: { x: -12, y: 40 } },
  whiplash: { x: 900, y: 360, labelOffset: { x: -30, y: 50 } },
  "grand-budapest-hotel": { x: 1040, y: 500, labelOffset: { x: -12, y: -38 } },
  "get-out": { x: 1200, y: 500, labelOffset: { x: 0, y: 36 } },
  inception: { x: 1360, y: 660, labelOffset: { x: 0, y: -36 } },
  "eternal-sunshine": { x: 1520, y: 660, labelOffset: { x: 54, y: 0 } },

  jaws: { x: 120, y: 1120, labelOffset: { x: 0, y: 34 } },
  rocky: { x: 280, y: 1120, labelOffset: { x: 0, y: -36 } },
  "singin-in-the-rain": { x: 440, y: 1120, labelOffset: { x: 0, y: 36 } },
  "12-angry-men": { x: 600, y: 1120, labelOffset: { x: 0, y: -38 } },
  "rear-window": { x: 760, y: 1120, labelOffset: { x: 0, y: 36 } },
  "dog-day-afternoon": { x: 920, y: 1120, labelOffset: { x: 0, y: -36 } },
  chinatown: { x: 1080, y: 1120, labelOffset: { x: 0, y: 36 } },
  "the-godfather": { x: 1240, y: 1120, labelOffset: { x: 0, y: -36 } },
  "taxi-driver": { x: 1400, y: 1120, labelOffset: { x: 0, y: 36 } },
  "citizen-kane": { x: 1560, y: 1120, labelOffset: { x: 54, y: 0 } },

  "little-miss-sunshine": { x: 120, y: 720, labelOffset: { x: -60, y: 34 } },
  "lady-bird": { x: 240, y: 600, labelOffset: { x: -48, y: 0 } },
  "good-will-hunting": { x: 360, y: 480, labelOffset: { x: -54, y: 0 } },
  "before-sunrise": { x: 600, y: 480, labelOffset: { x: 54, y: 0 } },
  "past-lives": { x: 720, y: 600, labelOffset: { x: 56, y: 0 } },
  moonlight: { x: 840, y: 720, labelOffset: { x: 0, y: 36 } },
  "marriage-story": { x: 960, y: 840, labelOffset: { x: 0, y: -36 } },
  "manchester-by-the-sea": { x: 1140, y: 840, labelOffset: { x: 0, y: -36 } },
  "yi-yi": { x: 1320, y: 840, labelOffset: { x: 54, y: 24 } },

  "the-bourne-identity": { x: 900, y: 60, labelOffset: { x: 0, y: -34 } },
  "casino-royale": { x: 900, y: 180, labelOffset: { x: 54, y: 0 } },
  "edge-of-tomorrow": { x: 900, y: 300, labelOffset: { x: 56, y: 0 } },
  sicario: { x: 1040, y: 220, labelOffset: { x: 0, y: -36 } },
  "mission-impossible-fallout": { x: 1200, y: 220, labelOffset: { x: 0, y: -36 } },
  "top-gun-maverick": { x: 1360, y: 220, labelOffset: { x: 0, y: -36 } },
  rrr: { x: 1500, y: 360, labelOffset: { x: 54, y: 0 } },
  "mad-max-fury-road": { x: 1500, y: 500, labelOffset: { x: 54, y: 0 } },
  "john-wick-chapter-4": { x: 1620, y: 500, labelOffset: { x: 54, y: 0 } },
};

type MovieInfo = Omit<
  Station,
  "stationKind" | "stationType" | "x" | "y" | "labelOffset" | "lines"
>;

const movieInfo: Record<string, MovieInfo> = {
  "back-to-the-future": {
    id: "back-to-the-future",
    titleKo: "백 투 더 퓨처",
    labelKo: "백투더퓨처",
      titleEn: "Back to the Future",
      year: 1985,
      runtimeMinutes: 116,
      director: "Robert Zemeckis",
    country: "USA",
    entryZone: "편하게 시작",
    entryDifficulty: 1.0,
    tags: ["시간여행", "장르 규칙", "모험", "코미디"],
    reason: "영화가 만든 규칙을 따라가는 재미가 가장 가볍게 열리는 시작역.",
    skill: "장르 규칙을 이해하고 즐기는 감각.",
  },
  "jurassic-park": {
    id: "jurassic-park",
    titleKo: "쥬라기 공원",
      titleEn: "Jurassic Park",
      year: 1993,
      runtimeMinutes: 127,
      director: "Steven Spielberg",
    country: "USA",
    entryZone: "편하게 시작",
    entryDifficulty: 1.2,
    tags: ["스펙터클", "모험", "시각적 몰입", "장면 설계"],
    reason: "영화관적 쾌감과 장면 설계의 힘을 바로 느낄 수 있다.",
    skill: "화면의 스케일과 리듬으로 몰입하는 감각.",
  },
  "truman-show": {
    id: "truman-show",
    titleKo: "트루먼 쇼",
      titleEn: "The Truman Show",
      year: 1998,
      runtimeMinutes: 103,
      director: "Peter Weir",
    country: "USA",
    entryZone: "조금 더 깊이",
    entryDifficulty: 1.7,
    tags: ["환승역", "정체성", "현실 의심", "쉬운 설정"],
    reason: "쉬운 설정으로 출발하지만 인물의 삶과 선택을 오래 생각하게 만든다.",
    skill: "대중적 설정 안에 숨은 주제와 감정을 함께 읽기.",
  },
  "groundhog-day": {
    id: "groundhog-day",
    titleKo: "사랑의 블랙홀",
      titleEn: "Groundhog Day",
      year: 1993,
      runtimeMinutes: 101,
      director: "Harold Ramis",
    country: "USA",
    entryZone: "편하게 시작",
    entryDifficulty: 1.5,
    tags: ["반복 구조", "코미디", "성장", "로맨스"],
    reason: "반복이라는 영화적 구조를 어렵지 않은 코미디로 익히게 한다.",
    skill: "설정 반복이 인물 변화를 만드는 방식 보기.",
  },
  "social-network": {
    id: "social-network",
    titleKo: "소셜 네트워크",
      titleEn: "The Social Network",
      year: 2010,
      runtimeMinutes: 120,
      director: "David Fincher",
    country: "USA",
    entryZone: "조금 더 깊이",
    entryDifficulty: 2.1,
    tags: ["빠른 대사", "편집", "현대적 리듬", "욕망"],
    reason: "대사, 편집, 리듬만으로도 영화가 얼마나 빠르게 달릴 수 있는지 보여준다.",
    skill: "빠른 대사와 인물 간 권력관계 따라가기.",
  },
  whiplash: {
    id: "whiplash",
    titleKo: "위플래쉬",
      titleEn: "Whiplash",
      year: 2014,
      runtimeMinutes: 106,
      director: "Damien Chazelle",
    country: "USA",
    entryZone: "조금 더 깊이",
    entryDifficulty: 2.3,
    tags: ["환승역", "집착", "압박감", "음악", "긴장"],
    reason: "액션 없이도 편집과 연기만으로 몸이 조여드는 몰입을 만든다.",
    skill: "강한 감정 압력과 긴장 유지하기.",
  },
  "grand-budapest-hotel": {
    id: "grand-budapest-hotel",
    titleKo: "그랜드 부다페스트 호텔",
    labelKo: "그랜드 부다페스트",
      titleEn: "The Grand Budapest Hotel",
      year: 2014,
      runtimeMinutes: 100,
      director: "Wes Anderson",
    country: "USA",
    entryZone: "조금 더 깊이",
    entryDifficulty: 2.0,
    tags: ["스타일", "미술", "구도", "리듬"],
    reason: "영화가 이야기뿐 아니라 색, 구도, 리듬으로도 움직인다는 걸 보여준다.",
    skill: "스타일과 미술이 감정과 서사를 만드는 방식 보기.",
  },
  "get-out": {
    id: "get-out",
    titleKo: "겟 아웃",
      titleEn: "Get Out",
      year: 2017,
      runtimeMinutes: 104,
      director: "Jordan Peele",
    country: "USA",
    entryZone: "조금 더 깊이",
    entryDifficulty: 2.5,
    tags: ["공포", "풍자", "장르 혼합", "불안"],
    reason: "장르적 재미 안에서 주제와 풍자가 어떻게 작동하는지 보여준다.",
    skill: "공포와 풍자를 동시에 읽는 감각.",
  },
  inception: {
    id: "inception",
    titleKo: "인셉션",
      titleEn: "Inception",
      year: 2010,
      runtimeMinutes: 148,
      director: "Christopher Nolan",
    country: "USA / UK",
    entryZone: "밀도 있음",
    entryDifficulty: 2.8,
    tags: ["구조", "규칙", "블록버스터", "꿈"],
    reason: "복잡한 규칙과 구조를 대중적 쾌감으로 따라가게 만든다.",
    skill: "층층이 쌓인 설정과 편집 구조 따라가기.",
  },
  "eternal-sunshine": {
    id: "eternal-sunshine",
    titleKo: "이터널 선샤인",
    labelKo: "이터널 선샤인",
      titleEn: "Eternal Sunshine of the Spotless Mind",
      year: 2004,
      runtimeMinutes: 108,
      director: "Michel Gondry",
    country: "USA",
    entryZone: "밀도 있음",
    entryDifficulty: 2.9,
    tags: ["비선형 구조", "기억", "사랑", "감정"],
    reason: "뒤섞인 구조를 감정의 흐름으로 따라가게 만드는 입문선의 도착역.",
    skill: "시간 순서보다 감정의 흐름으로 영화 따라가기.",
  },
  jaws: {
    id: "jaws",
    titleKo: "죠스",
      titleEn: "Jaws",
      year: 1975,
      runtimeMinutes: 124,
      director: "Steven Spielberg",
    country: "USA",
    entryZone: "편하게 시작",
    entryDifficulty: 1.3,
    tags: ["서스펜스", "스릴러", "블록버스터", "장면 설계"],
    reason: "오래됐지만 지금 봐도 바로 작동하는 서스펜스의 시작역.",
    skill: "보이지 않는 위협으로 긴장을 만드는 방식 보기.",
  },
  rocky: {
    id: "rocky",
    titleKo: "록키",
      titleEn: "Rocky",
      year: 1976,
      runtimeMinutes: 119,
      director: "John G. Avildsen",
    country: "USA",
    entryZone: "편하게 시작",
    entryDifficulty: 1.4,
    tags: ["스포츠", "감정선", "성장", "고전 입문"],
    reason: "오래된 영화라도 인물의 감정선이 선명하면 쉽게 들어갈 수 있음을 보여준다.",
    skill: "인물의 목표와 감정에 기대어 고전영화 따라가기.",
  },
  "singin-in-the-rain": {
    id: "singin-in-the-rain",
    titleKo: "사랑은 비를 타고",
      titleEn: "Singin' in the Rain",
      year: 1952,
      runtimeMinutes: 103,
      director: "Gene Kelly, Stanley Donen",
    country: "USA",
    entryZone: "편하게 시작",
    entryDifficulty: 1.6,
    tags: ["뮤지컬", "고전 할리우드", "스타성", "유쾌함"],
    reason: "고전 할리우드가 숙제가 아니라 즐거운 쇼가 될 수 있음을 보여준다.",
    skill: "고전 할리우드의 리듬, 몸짓, 스타성을 즐기기.",
  },
  "12-angry-men": {
    id: "12-angry-men",
    titleKo: "12인의 성난 사람들",
    labelKo: "12인의 성난 사람들",
      titleEn: "12 Angry Men",
      year: 1957,
      runtimeMinutes: 96,
      director: "Sidney Lumet",
    country: "USA",
    entryZone: "조금 더 깊이",
    entryDifficulty: 1.8,
    tags: ["환승역", "흑백", "대화극", "한 공간", "설득"],
    reason: "대화만으로도 강한 긴장과 인물 드라마를 만들 수 있다는 걸 보여준다.",
    skill: "한 공간의 대화와 논리적 긴장에 집중하기.",
  },
  "rear-window": {
    id: "rear-window",
    titleKo: "이창",
      titleEn: "Rear Window",
      year: 1954,
      runtimeMinutes: 112,
      director: "Alfred Hitchcock",
    country: "USA",
    entryZone: "조금 더 깊이",
    entryDifficulty: 2.0,
    tags: ["서스펜스", "관찰", "고전 스릴러", "공간"],
    reason: "고전영화의 문법을 스릴러의 재미로 익히기 좋다.",
    skill: "시선, 공간, 관찰로 긴장이 만들어지는 방식 보기.",
  },
  "dog-day-afternoon": {
    id: "dog-day-afternoon",
    titleKo: "뜨거운 오후",
      titleEn: "Dog Day Afternoon",
      year: 1975,
      runtimeMinutes: 125,
      director: "Sidney Lumet",
    country: "USA",
    entryZone: "밀도 있음",
    entryDifficulty: 2.4,
    tags: ["범죄", "현장감", "긴장", "인물"],
    reason: "범죄극의 긴장 안에서 인물과 사회적 분위기가 함께 살아난다.",
    skill: "사건의 긴장과 인물의 절박함을 같이 따라가기.",
  },
  chinatown: {
    id: "chinatown",
    titleKo: "차이나타운",
      titleEn: "Chinatown",
      year: 1974,
      runtimeMinutes: 131,
      director: "Roman Polanski",
    country: "USA",
    entryZone: "밀도 있음",
    entryDifficulty: 2.7,
    tags: ["느와르", "미스터리", "도시", "권력"],
    reason: "느와르의 분위기와 미스터리를 현대 관객도 따라갈 수 있게 열어준다.",
    skill: "도시, 권력, 미스터리가 얽히는 고전 문법 읽기.",
  },
  "the-godfather": {
    id: "the-godfather",
    titleKo: "대부",
      titleEn: "The Godfather",
      year: 1972,
      runtimeMinutes: 175,
      director: "Francis Ford Coppola",
    country: "USA",
    entryZone: "밀도 있음",
    entryDifficulty: 3.1,
    tags: ["범죄", "가족", "권력", "서사"],
    reason: "무게감 있는 서사와 인물을 충분히 따라갈 준비가 됐을 때 만나는 고전.",
    skill: "긴 호흡의 인물, 가족, 권력 구조 따라가기.",
  },
  "taxi-driver": {
    id: "taxi-driver",
    titleKo: "택시 드라이버",
      titleEn: "Taxi Driver",
      year: 1976,
      runtimeMinutes: 114,
      director: "Martin Scorsese",
    country: "USA",
    entryZone: "천천히 들어가기",
    entryDifficulty: 3.3,
    tags: ["고립", "도시", "불안", "인물"],
    reason: "고전의 무게가 도시적 불안과 인물의 균열로 확장되는 역.",
    skill: "불안정한 인물의 시선과 도시 분위기 읽기.",
  },
  "citizen-kane": {
    id: "citizen-kane",
    titleKo: "시민 케인",
      titleEn: "Citizen Kane",
      year: 1941,
      runtimeMinutes: 119,
      director: "Orson Welles",
    country: "USA",
    entryZone: "천천히 들어가기",
    entryDifficulty: 3.8,
    tags: ["종착역", "영화사", "형식", "플래시백", "고전"],
    reason: "고전영화의 문법과 영화사적 맥락이 쌓이면 덜 숙제처럼 느껴지는 종착역.",
    skill: "구조, 시점, 영화사적 의미를 함께 읽기.",
  },
  "little-miss-sunshine": {
    id: "little-miss-sunshine",
    titleKo: "리틀 미스 선샤인",
      titleEn: "Little Miss Sunshine",
      year: 2006,
      runtimeMinutes: 101,
      director: "Jonathan Dayton, Valerie Faris",
    country: "USA",
    entryZone: "편하게 시작",
    entryDifficulty: 1.2,
    tags: ["가족", "코미디", "로드무비", "감정"],
    reason: "가볍게 웃으면서 인물과 가족의 균열을 따라갈 수 있는 드라마선의 시작역.",
    skill: "코미디 속 인물 감정과 관계 읽기.",
  },
  "lady-bird": {
    id: "lady-bird",
    titleKo: "레이디 버드",
      titleEn: "Lady Bird",
      year: 2017,
      runtimeMinutes: 94,
      director: "Greta Gerwig",
    country: "USA",
    entryZone: "편하게 시작",
    entryDifficulty: 1.4,
    tags: ["성장", "모녀", "관계", "청춘"],
    reason: "작은 감정과 관계의 삐걱거림을 선명하고 가볍게 보여준다.",
    skill: "성장영화 안에서 관계의 결 따라가기.",
  },
  "good-will-hunting": {
    id: "good-will-hunting",
    titleKo: "굿 윌 헌팅",
      titleEn: "Good Will Hunting",
      year: 1997,
      runtimeMinutes: 126,
      director: "Gus Van Sant",
    country: "USA",
    entryZone: "편하게 시작",
    entryDifficulty: 1.6,
    tags: ["치유", "우정", "상처", "대화"],
    reason: "인물의 상처와 관계 회복을 감정적으로 따라가기 쉽다.",
    skill: "대화와 관계가 인물의 변화를 만드는 방식 보기.",
  },
  "before-sunrise": {
    id: "before-sunrise",
    titleKo: "비포 선라이즈",
      titleEn: "Before Sunrise",
      year: 1995,
      runtimeMinutes: 101,
      director: "Richard Linklater",
    country: "USA / Austria",
    entryZone: "조금 더 깊이",
    entryDifficulty: 2.0,
    tags: ["대화", "로맨스", "시간", "관계"],
    reason: "큰 사건 없이 대화와 시간만으로 관계가 생기는 과정을 보여준다.",
    skill: "사건보다 대화의 리듬으로 영화를 따라가기.",
  },
  "past-lives": {
    id: "past-lives",
    titleKo: "패스트 라이브즈",
      titleEn: "Past Lives",
      year: 2023,
      runtimeMinutes: 106,
      director: "Celine Song",
    country: "USA / Korea",
    entryZone: "조금 더 깊이",
    entryDifficulty: 2.2,
    tags: ["이별", "시간", "절제", "여운"],
    reason: "크게 터뜨리지 않는 감정과 오래 남는 여운을 따라가게 한다.",
    skill: "절제된 감정과 시간의 간격 읽기.",
  },
  moonlight: {
    id: "moonlight",
    titleKo: "문라이트",
    titleEn: "Moonlight",
    year: 2016,
    runtimeMinutes: 111,
    director: "Barry Jenkins",
    country: "USA",
    entryZone: "밀도 있음",
    entryDifficulty: 2.5,
    tags: ["정체성", "성장", "침묵", "관계"],
    reason: "말보다 시선과 시간의 조각으로 한 인물의 정체성을 따라가게 한다.",
    skill: "생략된 감정과 관계의 변화를 놓치지 않고 보기.",
  },
  "marriage-story": {
    id: "marriage-story",
    titleKo: "결혼 이야기",
    titleEn: "Marriage Story",
    year: 2019,
    runtimeMinutes: 136,
    director: "Noah Baumbach",
    country: "USA",
    entryZone: "밀도 있음",
    entryDifficulty: 2.6,
    tags: ["관계", "이별", "가족", "감정 충돌"],
    reason: "관계가 무너지는 과정을 양쪽 인물의 감정으로 따라가게 한다.",
    skill: "한 관계 안의 서로 다른 입장과 감정 보기.",
  },
  "manchester-by-the-sea": {
    id: "manchester-by-the-sea",
    titleKo: "맨체스터 바이 더 씨",
    labelKo: "맨체스터 바이 더 씨",
    titleEn: "Manchester by the Sea",
    year: 2016,
    runtimeMinutes: 137,
    director: "Kenneth Lonergan",
    country: "USA",
    entryZone: "천천히 들어가기",
    entryDifficulty: 3.2,
    tags: ["상실", "죄책감", "가족", "침묵"],
    reason: "상실과 죄책감을 과장 없이 정면으로 바라보는 깊은 드라마.",
    skill: "말해지지 않는 감정과 침묵의 무게 따라가기.",
  },
  "yi-yi": {
    id: "yi-yi",
    titleKo: "하나 그리고 둘",
    labelKo: "하나 그리고 둘",
    titleEn: "Yi Yi",
    year: 2000,
    runtimeMinutes: 173,
    director: "Edward Yang",
    country: "Taiwan",
    entryZone: "천천히 들어가기",
    entryDifficulty: 3.6,
    tags: ["종착역", "가족", "삶", "시간", "일상"],
    reason: "한 가족과 삶 전체를 조용히 바라보는 드라마선의 종착역.",
    skill: "큰 사건보다 삶의 결을 따라가는 감각.",
  },
  "the-bourne-identity": {
    id: "the-bourne-identity",
    titleKo: "본 아이덴티티",
    titleEn: "The Bourne Identity",
    year: 2002,
    runtimeMinutes: 119,
    director: "Doug Liman",
    country: "USA / Germany",
    entryZone: "편하게 시작",
    entryDifficulty: 1.1,
    tags: ["추격", "기억상실", "스파이", "현대 액션"],
    reason: "정체를 모르는 인물이 곧바로 쫓기기 시작해 초반 후킹이 빠른 시작역.",
    skill: "정보를 조금씩 얻으며 추격의 리듬을 따라가기.",
  },
  "casino-royale": {
    id: "casino-royale",
    titleKo: "007 카지노 로얄",
    labelKo: "007 카지노 로얄",
    titleEn: "Casino Royale",
    year: 2006,
    runtimeMinutes: 144,
    director: "Martin Campbell",
    country: "UK / USA",
    entryZone: "편하게 시작",
    entryDifficulty: 1.3,
    tags: ["스파이", "도박", "액션", "긴장"],
    reason: "몸으로 밀어붙이는 액션과 심리전이 같이 작동하는 현대 스파이 입구.",
    skill: "액션 장면과 심리적 긴장을 함께 따라가기.",
  },
  "edge-of-tomorrow": {
    id: "edge-of-tomorrow",
    titleKo: "엣지 오브 투모로우",
    titleEn: "Edge of Tomorrow",
    year: 2014,
    runtimeMinutes: 113,
    director: "Doug Liman",
    country: "USA",
    entryZone: "편하게 시작",
    entryDifficulty: 1.5,
    tags: ["반복 구조", "SF 액션", "성장", "속도감"],
    reason: "반복 설정이 액션의 속도와 캐릭터 성장으로 바로 이어진다.",
    skill: "반복되는 장면 안에서 정보와 리듬이 쌓이는 방식 보기.",
  },
  sicario: {
    id: "sicario",
    titleKo: "시카리오: 암살자의 도시",
    labelKo: "시카리오",
    titleEn: "Sicario",
    year: 2015,
    runtimeMinutes: 121,
    director: "Denis Villeneuve",
    country: "USA",
    entryZone: "조금 더 깊이",
    entryDifficulty: 2.0,
    tags: ["스릴러", "작전", "불안", "긴장"],
    reason: "액션보다 작전의 압박과 불안으로 몰입을 끌어올린다.",
    skill: "보이지 않는 위협과 정보 비대칭의 긴장 읽기.",
  },
  "mission-impossible-fallout": {
    id: "mission-impossible-fallout",
    titleKo: "미션 임파서블: 폴아웃",
    labelKo: "미션 임파서블",
    titleEn: "Mission: Impossible - Fallout",
    year: 2018,
    runtimeMinutes: 147,
    director: "Christopher McQuarrie",
    country: "USA",
    entryZone: "조금 더 깊이",
    entryDifficulty: 1.8,
    tags: ["현대 액션", "스턴트", "추격", "설계"],
    reason: "현대 블록버스터 액션이 장면을 어떻게 설계하는지 선명하게 보여준다.",
    skill: "스턴트와 장면 설계가 만드는 추진력 보기.",
  },
  "top-gun-maverick": {
    id: "top-gun-maverick",
    titleKo: "탑건: 매버릭",
    labelKo: "탑건 매버릭",
    titleEn: "Top Gun: Maverick",
    year: 2022,
    runtimeMinutes: 130,
    director: "Joseph Kosinski",
    country: "USA",
    entryZone: "조금 더 깊이",
    entryDifficulty: 1.8,
    tags: ["비행", "스펙터클", "속도", "팀플레이"],
    reason: "목표가 선명하고 비행 장면의 속도감이 즉각적으로 몰입을 만든다.",
    skill: "공간감과 속도가 장면의 긴장을 만드는 방식 보기.",
  },
  rrr: {
    id: "rrr",
    titleKo: "RRR: 라이즈 로어 리볼트",
    labelKo: "RRR",
    titleEn: "RRR",
    year: 2022,
    runtimeMinutes: 182,
    director: "S. S. Rajamouli",
    country: "India",
    entryZone: "조금 더 깊이",
    entryDifficulty: 2.1,
    tags: ["대형 액션", "멜로드라마", "스펙터클", "과잉"],
    reason: "감정, 액션, 음악이 큰 파도로 이어져 긴 러닝타임도 추진력으로 밀어붙인다.",
    skill: "큰 감정과 큰 장면을 하나의 리듬으로 받아들이기.",
  },
  "mad-max-fury-road": {
    id: "mad-max-fury-road",
    titleKo: "매드 맥스: 분노의 도로",
    labelKo: "매드맥스",
    titleEn: "Mad Max: Fury Road",
    year: 2015,
    runtimeMinutes: 120,
    director: "George Miller",
    country: "Australia / USA",
    entryZone: "조금 더 깊이",
    entryDifficulty: 2.5,
    tags: ["추격", "시각 리듬", "액션 연출", "이미지"],
    reason: "거의 순수한 시각 리듬과 추격의 영화적 쾌감을 보여준다.",
    skill: "대사보다 이미지와 동선으로 영화를 따라가기.",
  },
  "john-wick-chapter-4": {
    id: "john-wick-chapter-4",
    titleKo: "존 윅 4",
    titleEn: "John Wick: Chapter 4",
    year: 2023,
    runtimeMinutes: 169,
    director: "Chad Stahelski",
    country: "USA",
    entryZone: "밀도 있음",
    entryDifficulty: 2.5,
    tags: ["종착역", "현대 액션", "스타일", "동선", "리듬"],
    reason: "액션의 동선, 색, 리듬이 끝까지 밀도를 유지하는 몰입선의 종착역.",
    skill: "장면 안의 이동, 타격, 시각 리듬을 함께 따라가기.",
  },
};

function getStationType(stationId: string): StationType {
  if (transferLineIds[stationId]) {
    return "transfer";
  }

  if (lines.some((line) => line.startStationId === stationId)) {
    return "start";
  }

  if (lines.some((line) => line.terminalStationId === stationId)) {
    return "terminal";
  }

  return "normal";
}

function getStationLines(stationId: string): LineId[] {
  return Object.entries(lineStationIds)
    .filter(([, stationIds]) => stationIds.includes(stationId))
    .map(([lineId]) => lineId as LineId);
}

function createStation(stationId: string): Station {
  const coordinates = stationCoordinates[stationId];
  const info = movieInfo[stationId];

  if (!coordinates) {
    throw new Error(`${stationId} needs map coordinates.`);
  }

  if (!info) {
    throw new Error(`${stationId} needs movie info.`);
  }

  return {
    ...info,
    stationKind: "movie",
    lines: getStationLines(stationId),
    stationType: getStationType(stationId),
    ...coordinates,
  };
}

const stationIdsInRenderOrder = [
  ...new Set(Object.values(lineStationIds).flat()),
];

export const stations: Station[] = stationIdsInRenderOrder.map(createStation);

function createEdge(
  lineId: LineId,
  from: string,
  to: string,
  reason: string,
): Edge {
  return {
    id: `${lineId}-${from}-${to}`,
    from,
    to,
    lineId,
    reason,
  };
}

const edgeReasons: Record<LineId, string[]> = {
  intro: [
    "영화적 규칙을 즐겼다면, 이번엔 스케일 큰 영화적 쾌감으로 갑니다.",
    "스펙터클의 재미에서, 쉬운 설정 안에 숨은 질문으로 넘어갑니다.",
    "현실을 의심하는 설정을 지나, 반복 구조를 코미디로 익혀봅니다.",
    "반복 구조가 괜찮았다면, 이번엔 대사와 편집의 속도로 갑니다.",
    "현대적 리듬을 지나, 집착과 압박이 몸으로 느껴지는 영화로 갑니다.",
    "압박감에서 벗어나, 영화의 색과 구도와 스타일을 즐겨봅니다.",
    "스타일을 즐겼다면, 장르 재미와 주제가 함께 작동하는 쪽으로 갑니다.",
    "장르와 주제를 같이 읽었다면, 이번엔 더 복잡한 구조를 따라가봅니다.",
    "규칙이 겹겹이 쌓인 구조를 지나, 감정으로 따라가는 비선형 영화에 도착합니다.",
  ],
  classic: [
    "지금 봐도 먹히는 서스펜스에서, 감정선이 선명한 스포츠 드라마로 갑니다.",
    "인물의 목표를 따라갔다면, 이번엔 고전 할리우드의 쇼와 리듬을 만납니다.",
    "고전의 즐거움을 맛봤다면, 흑백 대화극의 긴장으로 넘어갑니다.",
    "대화의 긴장이 괜찮았다면, 이번엔 시선과 공간으로 만드는 서스펜스를 봅니다.",
    "고전 스릴러의 문법을 지나, 현장감 강한 범죄극으로 갑니다.",
    "범죄극의 긴장을 따라왔다면, 느와르의 분위기와 미스터리로 넘어갑니다.",
    "도시와 미스터리를 지나, 무게 있는 가족과 권력의 서사로 갑니다.",
    "긴 호흡의 고전을 받아들였다면, 도시적 불안과 인물의 균열로 넘어갑니다.",
    "고전의 불안과 형식에 익숙해졌다면, 이제 시민 케인이 덜 숙제 같습니다.",
  ],
  drama: [
    "가족 코미디의 가벼운 감정에서, 더 개인적인 성장과 관계로 갑니다.",
    "성장의 결을 따라갔다면, 이번엔 상처와 회복의 대화로 넘어갑니다.",
    "감정 회복의 드라마에서, 삶과 정체성을 묻는 환승역으로 갑니다.",
    "정체성의 질문을 지나, 큰 사건 없이 대화만으로 생기는 관계를 봅니다.",
    "대화의 리듬이 괜찮았다면, 이번엔 절제된 감정과 긴 시간을 견뎌봅니다.",
    "절제된 감정을 지나, 말보다 시선과 침묵이 쌓이는 성장 드라마로 갑니다.",
    "정체성의 시간을 지나, 무너지는 관계의 양쪽 감정을 따라갑니다.",
    "관계의 붕괴를 봤다면, 이번엔 상실과 죄책감의 깊은 침묵으로 갑니다.",
    "한 사람의 상실을 지나, 한 가족과 삶 전체를 바라보는 종착역에 도착합니다.",
  ],
  momentum: [
    "정체를 모른 채 쫓기는 속도에서, 더 큰 스파이 액션의 심리전으로 갑니다.",
    "스파이 액션의 몸맛을 지나, 반복 구조가 속도를 만드는 SF 액션으로 갑니다.",
    "반복되는 전투의 몰입에서, 액션 없이도 몸이 조여드는 환승역으로 갑니다.",
    "음악과 편집의 압박을 지나, 작전 전체가 불안으로 조여오는 스릴러로 갑니다.",
    "작전의 긴장을 지나, 현대 블록버스터 스턴트가 만드는 추진력으로 갑니다.",
    "스턴트의 쾌감에서, 비행 장면의 속도와 공간감으로 넘어갑니다.",
    "선명한 목표와 속도감을 지나, 감정과 액션이 한꺼번에 밀려오는 스펙터클로 갑니다.",
    "큰 감정과 큰 장면을 지나, 이미지와 추격만으로 달리는 액션으로 갑니다.",
    "순수한 추격의 리듬을 지나, 스타일과 동선이 극대화된 종착역에 도착합니다.",
  ],
};

export const edges: Edge[] = Object.entries(lineStationIds).flatMap(
  ([lineId, stationIds]) => {
    const typedLineId = lineId as LineId;

    return stationIds.slice(0, -1).map((from, index) =>
      createEdge(
        typedLineId,
        from,
        stationIds[index + 1],
        edgeReasons[typedLineId][index],
      ),
    );
  },
);

export const transferNotes: TransferNote[] = [
  {
    stationId: "truman-show",
    lineIds: ["intro", "drama"],
    reason:
      "쉬운 설정으로 영화적 질문을 열면서도 인물의 삶과 선택을 따라가게 하는 영화. 입문선과 드라마선을 잇는다.",
  },
  {
    stationId: "whiplash",
    lineIds: ["intro", "momentum"],
    reason:
      "연출과 편집을 배우는 입문 영화이면서, 액션 없이도 강한 추진력을 만드는 영화. 입문선과 몰입선을 잇는다.",
  },
];

function assertEqualList(label: string, actual: string[], expected: string[]) {
  if (
    actual.length !== expected.length ||
    actual.some((item, index) => item !== expected[index])
  ) {
    throw new Error(`${label} must follow the v2 selection.`);
  }
}

type MapPoint = { x: number; y: number };

function distanceBetween(first: MapPoint, second: MapPoint) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function segmentAngle(first: MapPoint, second: MapPoint) {
  const horizontalDistance = Math.abs(first.x - second.x);
  const verticalDistance = Math.abs(first.y - second.y);

  if (horizontalDistance === 0 && verticalDistance === 0) {
    return null;
  }

  if (horizontalDistance === 0 || verticalDistance === 0) {
    return horizontalDistance === 0 ? 90 : 0;
  }

  if (horizontalDistance === verticalDistance) {
    return 45;
  }

  return null;
}

function pointsMatch(first: MapPoint, second: MapPoint) {
  return first.x === second.x && first.y === second.y;
}

function stationPoint(stationId: string): MapPoint {
  const coordinates = stationCoordinates[stationId];

  if (!coordinates) {
    throw new Error(`${stationId} needs map coordinates.`);
  }

  return coordinates;
}

function stationIsOnLinePath(line: Line, stationId: string) {
  if (!line.pathPoints?.length) {
    return true;
  }

  const coordinates = stationPoint(stationId);

  return line.pathPoints.some((point) => pointsMatch(point, coordinates));
}

function stationsAreConsecutive(firstStationId: string, secondStationId: string) {
  return Object.values(lineStationIds).some((stationIds) => {
    const firstIndex = stationIds.indexOf(firstStationId);
    const secondIndex = stationIds.indexOf(secondStationId);

    return firstIndex >= 0 && Math.abs(firstIndex - secondIndex) === 1;
  });
}

function pointSitsOnSegment(start: MapPoint, point: MapPoint, end: MapPoint) {
  const crossProduct =
    (point.y - start.y) * (end.x - start.x) -
    (point.x - start.x) * (end.y - start.y);

  if (Math.abs(crossProduct) > 0.0001) {
    return false;
  }

  return (
    point.x >= Math.min(start.x, end.x) &&
    point.x <= Math.max(start.x, end.x) &&
    point.y >= Math.min(start.y, end.y) &&
    point.y <= Math.max(start.y, end.y)
  );
}

function segmentIntersection(
  firstStart: MapPoint,
  firstEnd: MapPoint,
  secondStart: MapPoint,
  secondEnd: MapPoint,
) {
  const firstA = firstEnd.y - firstStart.y;
  const firstB = firstStart.x - firstEnd.x;
  const firstC = firstA * firstStart.x + firstB * firstStart.y;
  const secondA = secondEnd.y - secondStart.y;
  const secondB = secondStart.x - secondEnd.x;
  const secondC = secondA * secondStart.x + secondB * secondStart.y;
  const determinant = firstA * secondB - secondA * firstB;

  if (determinant !== 0) {
    const point = {
      x: (secondB * firstC - firstB * secondC) / determinant,
      y: (firstA * secondC - secondA * firstC) / determinant,
    };

    if (
      pointSitsOnSegment(firstStart, point, firstEnd) &&
      pointSitsOnSegment(secondStart, point, secondEnd)
    ) {
      return point;
    }

    return null;
  }

  for (const point of [firstStart, firstEnd]) {
    if (pointSitsOnSegment(secondStart, point, secondEnd)) {
      return point;
    }
  }

  for (const point of [secondStart, secondEnd]) {
    if (pointSitsOnSegment(firstStart, point, firstEnd)) {
      return point;
    }
  }

  return null;
}

function getLinePathSegments(line: Line) {
  const points = line.pathPoints ?? line.stationIds.map(stationPoint);

  return points.slice(0, -1).map((point, index) => ({
    from: point,
    to: points[index + 1],
  }));
}

function transferAllowsIntersection(
  point: MapPoint,
  firstLineId: LineId,
  secondLineId: LineId,
) {
  return Object.entries(transferLineIds).some(([stationId, lineIds]) => {
    return (
      lineIds.includes(firstLineId) &&
      lineIds.includes(secondLineId) &&
      pointsMatch(point, stationPoint(stationId))
    );
  });
}

function assertMapLayoutRules() {
  const uniqueLineStationIds = [...new Set(Object.values(lineStationIds).flat())];

  for (const line of lines) {
    for (const stationId of line.stationIds) {
      if (!stationIsOnLinePath(line, stationId)) {
        throw new Error(`${stationId} must sit on the ${line.id} route path.`);
      }
    }

    line.stationIds.slice(0, -1).forEach((stationId, index) => {
      const nextStationId = line.stationIds[index + 1];
      const angle = segmentAngle(stationPoint(stationId), stationPoint(nextStationId));
      const distance = distanceBetween(
        stationPoint(stationId),
        stationPoint(nextStationId),
      );

      if (
        angle === null ||
        !mapPlanningRules.allowedSegmentAngles.includes(angle)
      ) {
        throw new Error(`${line.id} has a disallowed angle from ${stationId}.`);
      }

      if (distance > mapPlanningRules.maxStationGap) {
        throw new Error(`${line.id} has an overlong jump from ${stationId}.`);
      }
    });
  }

  uniqueLineStationIds.forEach((stationId, index) => {
    const station = stationPoint(stationId);

    uniqueLineStationIds.slice(index + 1).forEach((otherStationId) => {
      if (stationsAreConsecutive(stationId, otherStationId)) {
        return;
      }

      const distance = distanceBetween(station, stationPoint(otherStationId));

      if (distance < mapPlanningRules.minUnrelatedStationGap) {
        throw new Error(`${stationId} and ${otherStationId} are too close.`);
      }
    });
  });

  lines.forEach((line, lineIndex) => {
    const lineSegments = getLinePathSegments(line);

    lines.slice(lineIndex + 1).forEach((otherLine) => {
      const otherLineSegments = getLinePathSegments(otherLine);

      lineSegments.forEach((lineSegment) => {
        otherLineSegments.forEach((otherLineSegment) => {
          const intersection = segmentIntersection(
            lineSegment.from,
            lineSegment.to,
            otherLineSegment.from,
            otherLineSegment.to,
          );

          if (
            intersection &&
            !transferAllowsIntersection(intersection, line.id, otherLine.id)
          ) {
            throw new Error(`${line.id} and ${otherLine.id} cross without transfer.`);
          }
        });
      });
    });
  });
}

function assertV2Map() {
  const allLineStationIds = Object.values(lineStationIds).flat();
  const uniqueLineStationIds = new Set(allLineStationIds);
  const stationIdCounts = new Map<string, number>();
  const stationIds = new Set(stations.map((station) => station.id));

  for (const line of lines) {
    if (line.stationIds.length !== 10) {
      throw new Error(`${line.id} must have exactly 10 stations.`);
    }

    assertEqualList(
      `${line.id} stationIds`,
      line.stationIds,
      lineStationIds[line.id],
    );
  }

  for (const station of stations) {
    stationIdCounts.set(station.id, (stationIdCounts.get(station.id) ?? 0) + 1);

    if (!uniqueLineStationIds.has(station.id)) {
      throw new Error(`${station.id} is not in the current line map.`);
    }

    const expectedLines = getStationLines(station.id);
    assertEqualList(`${station.id} lines`, station.lines, expectedLines);
  }

  for (const stationId of uniqueLineStationIds) {
    if (!stationIds.has(stationId)) {
      throw new Error(`${stationId} must exist as a station.`);
    }

    if ((stationIdCounts.get(stationId) ?? 0) !== 1) {
      throw new Error(`${stationId} must exist exactly once as a station.`);
    }
  }

  for (const [stationId, lineIds] of Object.entries(transferLineIds)) {
    const station = stations.find((item) => item.id === stationId);

    if (!station || station.stationType !== "transfer") {
      throw new Error(`${stationId} must be a v2 transfer station.`);
    }

    assertEqualList(`${stationId} transfer lines`, station.lines, lineIds);
  }

  assertEqualList(
    "transfer note stationIds",
    transferNotes.map((note) => note.stationId),
    Object.keys(transferLineIds),
  );

  for (const note of transferNotes) {
    assertEqualList(
      `${note.stationId} transfer note`,
      note.lineIds,
      transferLineIds[note.stationId] ?? [],
    );
  }

  for (const edge of edges) {
    if (!stationIds.has(edge.from)) {
      throw new Error(`${edge.id} has an unknown from station.`);
    }

    if (!stationIds.has(edge.to)) {
      throw new Error(`${edge.id} has an unknown to station.`);
    }

    if (!edge.reason.trim()) {
      throw new Error(`${edge.id} needs a reason.`);
    }
  }

  for (const line of lines) {
    const lineEdges = edges.filter((edge) => edge.lineId === line.id);

    if (lineEdges.length !== line.stationIds.length - 1) {
      throw new Error(`${line.id} must have one edge between every station.`);
    }

    line.stationIds.slice(0, -1).forEach((from, index) => {
      const to = line.stationIds[index + 1];
      const edge = lineEdges.find(
        (item) => item.from === from && item.to === to && item.reason.trim(),
      );

      if (!edge) {
        throw new Error(`${line.id} needs a reasoned edge from ${from} to ${to}.`);
      }
    });
  }

  assertMapLayoutRules();
}

assertV2Map();
