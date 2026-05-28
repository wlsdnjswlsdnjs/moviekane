export type Pace = "빠름" | "보통" | "느림";

export type Film = {
  id: string;
  stage: number;
  title: string;
  originalTitle: string;
  year: number;
  director: string;
  country: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  pace: Pace;
  contextLevel: 1 | 2 | 3 | 4 | 5;
  formLevel: 1 | 2 | 3 | 4 | 5;
  emotionalHook: 1 | 2 | 3 | 4 | 5;
  reason: string;
  beforeYouWatch: string;
  unlockCopy: string;
  connectionToNext: string;
};

export type MovieRoute = {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  difficultyLabel: string;
  totalStages: number;
  routeTheme: string;
  films: Film[];
};

export const routes: MovieRoute[] = [
  {
    id: "starter",
    slug: "starter",
    title: "영화 좀 좋아해볼까 싶어진 사람들",
    description:
      "막 영화에 재미가 붙기 시작한 사람을 위한 첫 번째 입구. 너무 어렵지 않지만, 보고 나면 영화라는 취미가 조금 더 커지는 작품들.",
    shortDescription:
      "익숙한 재미에서 출발해 영화라는 취미를 조금 더 크게 만드는 입구.",
    category: "가장 대중적인 starter route",
    difficultyLabel: "편하게 시작",
    totalStages: 8,
    routeTheme: "starter",
    films: [
      {
        id: "truman-show",
        stage: 1,
        title: "트루먼 쇼",
        originalTitle: "The Truman Show",
        year: 1998,
        director: "피터 위어",
        country: "미국",
        difficulty: 1,
        pace: "빠름",
        contextLevel: 1,
        formLevel: 2,
        emotionalHook: 5,
        reason:
          "설정은 쉽고 질문은 오래 남습니다. 영화가 현실을 비트는 재미를 바로 느낄 수 있어요.",
        beforeYouWatch:
          "풍자나 철학을 먼저 찾지 않아도 됩니다. 트루먼의 불편함을 따라가면 충분해요.",
        unlockCopy:
          "첫 입구입니다. 가볍게 들어가도 생각보다 오래 남는 영화예요.",
        connectionToNext:
          "현실이 이상하게 작동하는 이야기에서, 시간의 규칙을 즐기는 모험으로",
      },
      {
        id: "back-to-the-future",
        stage: 2,
        title: "백 투 더 퓨처",
        originalTitle: "Back to the Future",
        year: 1985,
        director: "로버트 저메키스",
        country: "미국",
        difficulty: 1,
        pace: "빠름",
        contextLevel: 1,
        formLevel: 1,
        emotionalHook: 4,
        reason:
          "복잡한 시간여행도 리듬 좋게 풀어냅니다. 고전 오락영화의 설계가 얼마나 매끈한지 보여줘요.",
        beforeYouWatch:
          "과학 설정보다 인물의 선택과 타이밍을 보면 더 잘 따라갈 수 있어요.",
        unlockCopy:
          "앞 영화가 괜찮았다면, 이번에는 더 경쾌한 영화적 장치를 만나볼 차례예요.",
        connectionToNext:
          "경쾌한 모험의 속도를 유지한 채, 스케일이 큰 극장형 재미로",
      },
      {
        id: "jurassic-park",
        stage: 3,
        title: "쥬라기 공원",
        originalTitle: "Jurassic Park",
        year: 1993,
        director: "스티븐 스필버그",
        country: "미국",
        difficulty: 1,
        pace: "빠름",
        contextLevel: 1,
        formLevel: 1,
        emotionalHook: 4,
        reason:
          "영화가 관객의 시선을 어떻게 붙잡는지 아주 선명하게 보입니다. 무섭지만 즐겁고, 쉽지만 정교해요.",
        beforeYouWatch:
          "공룡보다 사람들이 무엇을 보고 무엇을 놓치는지 따라가 보세요.",
        unlockCopy:
          "큰 재미를 놓치지 않으면서도 영화적 완성도를 느껴보기 좋은 단계입니다.",
        connectionToNext:
          "거대한 볼거리에서, 현대적인 욕망과 속도의 이야기로",
      },
      {
        id: "social-network",
        stage: 4,
        title: "소셜 네트워크",
        originalTitle: "The Social Network",
        year: 2010,
        director: "데이비드 핀처",
        country: "미국",
        difficulty: 2,
        pace: "빠름",
        contextLevel: 2,
        formLevel: 2,
        emotionalHook: 4,
        reason:
          "대화와 편집만으로도 스릴이 생깁니다. 현대적인 영화 리듬에 익숙해지기 좋아요.",
        beforeYouWatch:
          "실제 사건 지식보다, 인물들이 인정받고 싶어 하는 방식에 집중해보세요.",
        unlockCopy:
          "오락의 속도를 유지하면서 조금 더 날카로운 말맛으로 넘어가봅니다.",
        connectionToNext:
          "성공에 대한 집착에서, 리듬과 완벽주의의 압박으로",
      },
      {
        id: "whiplash",
        stage: 5,
        title: "위플래쉬",
        originalTitle: "Whiplash",
        year: 2014,
        director: "데이미언 셔젤",
        country: "미국",
        difficulty: 2,
        pace: "빠름",
        contextLevel: 1,
        formLevel: 2,
        emotionalHook: 5,
        reason:
          "음악영화처럼 보이지만 거의 스포츠 스릴러처럼 달립니다. 몰입감으로 다음 문을 열어줘요.",
        beforeYouWatch:
          "누가 맞고 틀렸는지보다, 압박이 어떤 에너지를 만드는지 느껴보세요.",
        unlockCopy:
          "강한 감정과 속도로 밀어붙이는 영화가 당길 때 좋은 다음 걸음입니다.",
        connectionToNext:
          "리듬의 긴장에서, 꿈과 현실이 섞이는 뮤지컬의 감정으로",
      },
      {
        id: "la-la-land",
        stage: 6,
        title: "라라랜드",
        originalTitle: "La La Land",
        year: 2016,
        director: "데이미언 셔젤",
        country: "미국",
        difficulty: 2,
        pace: "보통",
        contextLevel: 2,
        formLevel: 3,
        emotionalHook: 5,
        reason:
          "고전 뮤지컬 문법을 몰라도 감정으로 들어갈 수 있습니다. 형식이 낯설어도 꽤 따뜻한 입구예요.",
        beforeYouWatch:
          "노래가 시작될 때 이야기가 멈춘다고 느끼기보다, 감정이 커지는 순간으로 보면 편합니다.",
        unlockCopy:
          "조금 더 영화적인 표현을 만나도, 감정이 먼저 길을 안내해줄 거예요.",
        connectionToNext:
          "익숙한 감정의 입구에서, 한국 사회를 비트는 블랙코미디로",
      },
      {
        id: "parasite",
        stage: 7,
        title: "기생충",
        originalTitle: "Parasite",
        year: 2019,
        director: "봉준호",
        country: "한국",
        difficulty: 2,
        pace: "빠름",
        contextLevel: 2,
        formLevel: 3,
        emotionalHook: 5,
        reason:
          "장르적 재미와 사회적 감각이 같이 움직입니다. '좋은 영화'가 어렵기만 한 건 아니라는 걸 보여줘요.",
        beforeYouWatch:
          "상징을 맞히려 하지 않아도 됩니다. 집의 구조와 시선의 방향만 따라가도 많은 것이 보여요.",
        unlockCopy:
          "재미와 해석이 같이 오는 영화를 만날 준비가 된 단계입니다.",
        connectionToNext:
          "현실의 균열을 지나, 기억과 사랑이 뒤섞이는 더 낯선 감정으로",
      },
      {
        id: "eternal-sunshine",
        stage: 8,
        title: "이터널 선샤인",
        originalTitle: "Eternal Sunshine of the Spotless Mind",
        year: 2004,
        director: "미셸 공드리",
        country: "미국",
        difficulty: 3,
        pace: "보통",
        contextLevel: 2,
        formLevel: 4,
        emotionalHook: 5,
        reason:
          "구조는 조금 낯설지만 감정은 아주 직접적입니다. 형식적인 영화로 넘어가는 부드러운 징검다리예요.",
        beforeYouWatch:
          "시간 순서를 완벽히 맞추려 하기보다, 기억이 무너질 때의 감정선을 따라가면 좋습니다.",
        unlockCopy:
          "여기까지 왔다면 조금 낯선 구조도 감정으로 따라갈 수 있을 거예요.",
        connectionToNext:
          "이 루트는 여기서 잠시 쉬어가도 좋습니다. 다음 입구는 취향이 알려줄 거예요.",
      },
    ],
  },
  {
    id: "accessible-classics",
    slug: "accessible-classics",
    title: "고전영화, 일단 안 졸리는 것부터",
    description:
      "흑백영화나 오래된 영화가 숙제처럼 느껴지는 사람을 위한 입문 루트. 처음부터 Citizen Kane으로 가지 않고, 이야기와 재미가 강한 작품부터 들어간다.",
    shortDescription:
      "고전영화가 숙제처럼 느껴질 때, 이야기 힘이 센 작품부터 천천히.",
    category: "accessible classics route",
    difficultyLabel: "고전 입구",
    totalStages: 8,
    routeTheme: "classic",
    films: [
      {
        id: "12-angry-men",
        stage: 1,
        title: "12인의 성난 사람들",
        originalTitle: "12 Angry Men",
        year: 1957,
        director: "시드니 루멧",
        country: "미국",
        difficulty: 2,
        pace: "보통",
        contextLevel: 1,
        formLevel: 2,
        emotionalHook: 5,
        reason:
          "한 방 안에서 말만 하는데도 계속 긴장됩니다. 흑백영화의 거리감을 줄이기 좋은 시작점이에요.",
        beforeYouWatch:
          "법정 지식이 없어도 괜찮습니다. 사람들이 확신을 바꾸는 순간만 따라가보세요.",
        unlockCopy:
          "고전영화를 너무 거창하게 시작하지 않아도 됩니다. 이야기의 힘부터 만나볼까요.",
        connectionToNext:
          "한 공간의 긴장감이 괜찮았다면, 이번엔 창밖을 보세요",
      },
      {
        id: "rear-window",
        stage: 2,
        title: "이창",
        originalTitle: "Rear Window",
        year: 1954,
        director: "앨프리드 히치콕",
        country: "미국",
        difficulty: 2,
        pace: "보통",
        contextLevel: 1,
        formLevel: 2,
        emotionalHook: 4,
        reason:
          "보는 행위 자체가 사건이 됩니다. 영화가 시선을 설계하는 방식을 부담 없이 체감할 수 있어요.",
        beforeYouWatch:
          "범인을 맞히는 것보다, 주인공이 무엇을 보고 싶어 하는지 보는 쪽이 더 재밌습니다.",
        unlockCopy:
          "한정된 공간이 만드는 긴장감에 조금 더 익숙해지는 단계입니다.",
        connectionToNext:
          "서스펜스의 조임에서, 말맛과 속도가 살아있는 코미디로",
      },
      {
        id: "some-like-it-hot",
        stage: 3,
        title: "뜨거운 것이 좋아",
        originalTitle: "Some Like It Hot",
        year: 1959,
        director: "빌리 와일더",
        country: "미국",
        difficulty: 1,
        pace: "빠름",
        contextLevel: 2,
        formLevel: 1,
        emotionalHook: 4,
        reason:
          "오래된 코미디도 충분히 빠르고 영리할 수 있다는 걸 보여줍니다. 고전의 낡은 느낌을 덜어줘요.",
        beforeYouWatch:
          "시대감이 보이는 농담은 살짝 지나가도 괜찮아요. 리듬과 상황극을 즐기면 됩니다.",
        unlockCopy:
          "고전영화가 꼭 무겁지만은 않다는 쪽으로 문을 열어봅니다.",
        connectionToNext:
          "가볍게 웃었다면, 이번엔 로맨스와 전쟁의 그늘이 섞인 이야기로",
      },
      {
        id: "casablanca",
        stage: 4,
        title: "카사블랑카",
        originalTitle: "Casablanca",
        year: 1942,
        director: "마이클 커티즈",
        country: "미국",
        difficulty: 2,
        pace: "보통",
        contextLevel: 3,
        formLevel: 2,
        emotionalHook: 5,
        reason:
          "명대사의 무게보다 인물의 선택을 따라가면 훨씬 편합니다. 고전 멜로드라마의 감정 입구예요.",
        beforeYouWatch:
          "전쟁 배경을 모두 알 필요는 없습니다. 떠날 수 없는 사람들의 마음에 집중해보세요.",
        unlockCopy:
          "조금 더 시대의 공기가 있는 영화로 넘어가도 감정이 길을 잡아줄 거예요.",
        connectionToNext:
          "로맨스의 그림자에서, 할리우드 자신의 어두운 거울로",
      },
      {
        id: "sunset-boulevard",
        stage: 5,
        title: "선셋 대로",
        originalTitle: "Sunset Boulevard",
        year: 1950,
        director: "빌리 와일더",
        country: "미국",
        difficulty: 3,
        pace: "보통",
        contextLevel: 3,
        formLevel: 3,
        emotionalHook: 4,
        reason:
          "고전 할리우드의 화려함과 불안을 동시에 봅니다. 영화 산업에 대한 영화로 자연스럽게 들어가요.",
        beforeYouWatch:
          "옛 스타 시스템을 자세히 몰라도, 잊히는 사람의 공포로 보면 충분히 선명합니다.",
        unlockCopy:
          "고전영화가 스스로를 바라보는 순간을 만나볼 차례입니다.",
        connectionToNext:
          "무대 뒤의 욕망에서, 범죄와 도덕의 차가운 계산으로",
      },
      {
        id: "double-indemnity",
        stage: 6,
        title: "이중 배상",
        originalTitle: "Double Indemnity",
        year: 1944,
        director: "빌리 와일더",
        country: "미국",
        difficulty: 3,
        pace: "보통",
        contextLevel: 3,
        formLevel: 3,
        emotionalHook: 4,
        reason:
          "필름 누아르의 매력을 비교적 또렷하게 만날 수 있습니다. 어둠, 욕망, 선택이 깔끔하게 맞물려요.",
        beforeYouWatch:
          "누가 나쁜 사람인지보다, 이미 꼬인 계획이 어떻게 더 꼬이는지 보면 재밌습니다.",
        unlockCopy:
          "고전 장르의 문법이 손에 잡히기 시작하는 지점입니다.",
        connectionToNext:
          "범죄의 계산에서, 대사와 권력이 부딪히는 백스테이지로",
      },
      {
        id: "all-about-eve",
        stage: 7,
        title: "이브의 모든 것",
        originalTitle: "All About Eve",
        year: 1950,
        director: "조지프 L. 맹키위츠",
        country: "미국",
        difficulty: 3,
        pace: "보통",
        contextLevel: 3,
        formLevel: 2,
        emotionalHook: 4,
        reason:
          "말과 표정으로 긴장이 쌓입니다. 화려한 사건보다 관계의 방향을 읽는 재미가 커져요.",
        beforeYouWatch:
          "등장인물 이름이 조금 많아도 괜찮습니다. 누가 누구의 자리를 원하는지만 잡으면 됩니다.",
        unlockCopy:
          "화려한 사건보다 관계의 압력으로 움직이는 영화에 익숙해져 봅니다.",
        connectionToNext:
          "무대의 질투를 지나, 영화사에서 자주 불리는 이름을 조금 덜 막막하게",
      },
      {
        id: "citizen-kane",
        stage: 8,
        title: "시민 케인",
        originalTitle: "Citizen Kane",
        year: 1941,
        director: "오슨 웰스",
        country: "미국",
        difficulty: 4,
        pace: "느림",
        contextLevel: 4,
        formLevel: 4,
        emotionalHook: 3,
        reason:
          "처음부터 보면 숙제처럼 느껴질 수 있지만, 앞의 영화들을 지나오면 형식과 신화가 조금 더 보입니다.",
        beforeYouWatch:
          "위대함을 증명하려 애쓰지 않아도 됩니다. 한 사람을 여러 조각으로 더듬는 영화라고 생각해보세요.",
        unlockCopy:
          "이제 조금 덜 막막한 상태로 만날 수 있습니다. 졸려도 실패는 아니에요.",
        connectionToNext:
          "여기까지 온 것만으로도 고전영화의 문턱은 꽤 낮아졌습니다.",
      },
    ],
  },
  {
    id: "bong-adjacent",
    slug: "after-parasite",
    title: "기생충 다음에 뭐 보지",
    description:
      "봉준호 영화가 재밌었던 사람을 위한 확장 루트. 블랙코미디, 계급, 장르 혼합, 범죄, 불안한 사회 분위기로 이어지는 영화들.",
    shortDescription:
      "봉준호 영화가 좋았다면, 블랙코미디와 범죄와 사회적 불안 쪽으로.",
    category: "Bong Joon-ho adjacent route",
    difficultyLabel: "장르 확장",
    totalStages: 8,
    routeTheme: "bong",
    films: [
      {
        id: "parasite",
        stage: 1,
        title: "기생충",
        originalTitle: "Parasite",
        year: 2019,
        director: "봉준호",
        country: "한국",
        difficulty: 2,
        pace: "빠름",
        contextLevel: 2,
        formLevel: 3,
        emotionalHook: 5,
        reason:
          "웃기고 불편하고 무섭게 변합니다. 봉준호식 장르 혼합을 가장 넓게 열어주는 출발점이에요.",
        beforeYouWatch:
          "상징을 맞히는 시험처럼 보지 않아도 됩니다. 계단, 창, 냄새처럼 반복되는 감각을 따라가세요.",
        unlockCopy:
          "이미 봤다면 체크하고 바로 다음으로 넘어가도 좋아요.",
        connectionToNext:
          "계급과 공간의 감각에서, 한국적 범죄 미스터리의 늪으로",
      },
      {
        id: "memories-of-murder",
        stage: 2,
        title: "살인의 추억",
        originalTitle: "Memories of Murder",
        year: 2003,
        director: "봉준호",
        country: "한국",
        difficulty: 3,
        pace: "보통",
        contextLevel: 3,
        formLevel: 3,
        emotionalHook: 5,
        reason:
          "범죄 스릴러의 몰입감 안에 시대의 무력감이 들어 있습니다. 웃음과 공포가 함께 굴러가요.",
        beforeYouWatch:
          "사건 해결보다, 사람들이 모르는 것을 어떻게 견디는지 보세요.",
        unlockCopy:
          "재미있게 따라가다 보면 어느 순간 시대의 공기가 따라붙는 영화입니다.",
        connectionToNext:
          "미스터리의 답답함에서, 더 개인적인 죄책감과 모성의 이야기로",
      },
      {
        id: "mother",
        stage: 3,
        title: "마더",
        originalTitle: "Mother",
        year: 2009,
        director: "봉준호",
        country: "한국",
        difficulty: 3,
        pace: "보통",
        contextLevel: 2,
        formLevel: 3,
        emotionalHook: 5,
        reason:
          "장르의 틀 안에서 감정이 점점 이상해집니다. 익숙한 가족 이야기의 바닥이 살짝 흔들려요.",
        beforeYouWatch:
          "모성이라는 단어를 미리 결론내리지 말고, 인물이 어디까지 가는지만 따라가보세요.",
        unlockCopy:
          "조금 더 불편하지만 강하게 붙드는 영화로 넘어갑니다.",
        connectionToNext:
          "가족의 불안에서, 괴수와 사회 풍자가 섞인 더 큰 소동으로",
      },
      {
        id: "the-host",
        stage: 4,
        title: "괴물",
        originalTitle: "The Host",
        year: 2006,
        director: "봉준호",
        country: "한국",
        difficulty: 2,
        pace: "빠름",
        contextLevel: 2,
        formLevel: 3,
        emotionalHook: 5,
        reason:
          "괴수영화의 재미와 가족극의 정서가 동시에 갑니다. 장르가 섞일 때 생기는 탄력을 느끼기 좋아요.",
        beforeYouWatch:
          "괴물의 정체보다, 가족이 계속 어긋나면서도 움직이는 방식을 보면 더 잘 들어옵니다.",
        unlockCopy:
          "봉준호 영화의 장르적 재미를 조금 더 크게 만나는 단계입니다.",
        connectionToNext:
          "계급과 공간의 감각을 더 고전적인 방식으로",
      },
      {
        id: "high-and-low",
        stage: 5,
        title: "천국과 지옥",
        originalTitle: "High and Low",
        year: 1963,
        director: "구로사와 아키라",
        country: "일본",
        difficulty: 4,
        pace: "보통",
        contextLevel: 3,
        formLevel: 4,
        emotionalHook: 4,
        reason:
          "공간, 계급, 범죄가 정확하게 맞물립니다. 봉준호 영화가 좋아한 감각을 더 고전적인 방식으로 볼 수 있어요.",
        beforeYouWatch:
          "초반의 긴 대화가 지나면 영화의 시야가 확 넓어집니다. 집과 거리의 차이를 눈여겨보세요.",
        unlockCopy:
          "여기서부터는 조금 더 고전적이지만, 연결고리가 뚜렷해서 따라갈 만합니다.",
        connectionToNext:
          "사회적 범죄의 구조에서, 집요한 수사의 시간 감각으로",
      },
      {
        id: "zodiac",
        stage: 6,
        title: "조디악",
        originalTitle: "Zodiac",
        year: 2007,
        director: "데이비드 핀처",
        country: "미국",
        difficulty: 4,
        pace: "느림",
        contextLevel: 3,
        formLevel: 3,
        emotionalHook: 4,
        reason:
          "답이 늦게 오는 스릴러입니다. 사건보다 집착과 시간의 피로가 영화의 중심이 돼요.",
        beforeYouWatch:
          "빠른 반전보다, 오래 붙잡고 있는 사람들이 어떻게 닳아가는지 보는 영화에 가깝습니다.",
        unlockCopy:
          "속도가 조금 느려져도 긴장이 사라지지 않는 영화를 만나봅니다.",
        connectionToNext:
          "수사의 집착에서, 설명되지 않는 불안이 번지는 심리 스릴러로",
      },
      {
        id: "cure",
        stage: 7,
        title: "큐어",
        originalTitle: "Cure",
        year: 1997,
        director: "구로사와 기요시",
        country: "일본",
        difficulty: 4,
        pace: "느림",
        contextLevel: 3,
        formLevel: 4,
        emotionalHook: 4,
        reason:
          "무서운 장면보다 분위기로 천천히 압박합니다. 설명되지 않는 불안에 적응하는 좋은 단계예요.",
        beforeYouWatch:
          "모든 동기를 바로 이해하려 하지 않아도 됩니다. 반복되는 질문과 침묵의 감각을 따라가세요.",
        unlockCopy:
          "조금 조용하고 서늘한 영화도 충분히 붙잡을 수 있는 단계입니다.",
        connectionToNext:
          "도시의 불안에서, 생존과 노동이 한계까지 밀리는 고전 스릴러로",
      },
      {
        id: "wages-of-fear",
        stage: 8,
        title: "공포의 보수",
        originalTitle: "The Wages of Fear",
        year: 1953,
        director: "앙리 조르주 클루조",
        country: "프랑스",
        difficulty: 4,
        pace: "느림",
        contextLevel: 3,
        formLevel: 3,
        emotionalHook: 5,
        reason:
          "느리게 출발하지만 한번 움직이면 긴장이 아주 물리적으로 느껴집니다. 사회적 압박과 장르적 스릴이 만나요.",
        beforeYouWatch:
          "초반을 인물들이 왜 위험한 일을 받아들이는지 쌓는 시간으로 보면 뒤가 훨씬 강해집니다.",
        unlockCopy:
          "이 루트의 마지막은 오래된 영화지만, 긴장감만큼은 아주 직접적입니다.",
        connectionToNext:
          "불안한 사회와 장르의 재미가 만나는 길은 여기서도 계속 이어집니다.",
      },
    ],
  },
  {
    id: "high-engagement",
    slug: "high-engagement",
    title: "일단 재밌어야 계속 보니까",
    description:
      "액션, 스릴러, 범죄, 서스펜스처럼 몰입이 빠른 영화들로 영화 감상 체력을 올리는 루트. 영화적 완성도와 오락성을 같이 가져간다.",
    shortDescription:
      "몰입이 빠른 장르영화로 감상 체력을 올리고, 조금씩 밀도를 높이는 길.",
    category: "high-engagement genre route",
    difficultyLabel: "몰입 빠름",
    totalStages: 8,
    routeTheme: "genre",
    films: [
      {
        id: "die-hard",
        stage: 1,
        title: "다이 하드",
        originalTitle: "Die Hard",
        year: 1988,
        director: "존 맥티어넌",
        country: "미국",
        difficulty: 1,
        pace: "빠름",
        contextLevel: 1,
        formLevel: 1,
        emotionalHook: 4,
        reason:
          "공간, 목표, 위험이 아주 명확합니다. 액션영화가 관객을 붙드는 기본기를 느끼기 좋아요.",
        beforeYouWatch:
          "건물 구조와 주인공의 위치가 어떻게 긴장을 만드는지 보면 더 재밌습니다.",
        unlockCopy:
          "일단 재밌게 시작합니다. 장르영화의 힘을 믿고 들어가도 좋아요.",
        connectionToNext:
          "한 공간의 액션 쾌감에서, 더 큰 스케일의 추격과 운명감으로",
      },
      {
        id: "terminator-2",
        stage: 2,
        title: "터미네이터 2",
        originalTitle: "Terminator 2: Judgment Day",
        year: 1991,
        director: "제임스 카메론",
        country: "미국",
        difficulty: 1,
        pace: "빠름",
        contextLevel: 2,
        formLevel: 1,
        emotionalHook: 5,
        reason:
          "액션의 크기와 감정선이 같이 갑니다. 속도감 있는 영화 안에서도 인물이 남는 경험을 줘요.",
        beforeYouWatch:
          "전편을 몰라도 큰 줄기는 따라갈 수 있습니다. 보호하는 관계에 집중해보세요.",
        unlockCopy:
          "큰 액션과 또렷한 감정이 함께 움직이는 단계입니다.",
        connectionToNext:
          "액션의 쾌감에서, 도시와 범죄의 무게로",
      },
      {
        id: "heat",
        stage: 3,
        title: "히트",
        originalTitle: "Heat",
        year: 1995,
        director: "마이클 만",
        country: "미국",
        difficulty: 3,
        pace: "보통",
        contextLevel: 2,
        formLevel: 3,
        emotionalHook: 4,
        reason:
          "총격보다 도시와 직업인의 리듬이 오래 남습니다. 범죄영화가 묵직해지는 순간을 만나요.",
        beforeYouWatch:
          "상영 시간이 길어도 사건만 기다리지 말고, 각자의 규칙으로 사는 사람들을 보세요.",
        unlockCopy:
          "재미는 유지하면서 영화의 무게를 조금 늘려봅니다.",
        connectionToNext:
          "도시의 무게에서, 거의 순수한 속도와 이미지의 질주로",
      },
      {
        id: "mad-max-fury-road",
        stage: 4,
        title: "매드 맥스: 분노의 도로",
        originalTitle: "Mad Max: Fury Road",
        year: 2015,
        director: "조지 밀러",
        country: "오스트레일리아",
        difficulty: 2,
        pace: "빠름",
        contextLevel: 1,
        formLevel: 3,
        emotionalHook: 4,
        reason:
          "이야기는 단순하지만 화면과 리듬은 놀라울 만큼 치밀합니다. 액션을 이미지로 읽는 입구예요.",
        beforeYouWatch:
          "설정보다 방향을 보면 됩니다. 어디로 가고, 왜 돌아오는지만 잡아도 충분해요.",
        unlockCopy:
          "속도와 이미지가 이야기를 끌고 가는 영화를 만나봅니다.",
        connectionToNext:
          "질주의 에너지에서, 더 미니멀하고 정교한 복수 액션으로",
      },
      {
        id: "john-wick",
        stage: 5,
        title: "존 윅",
        originalTitle: "John Wick",
        year: 2014,
        director: "채드 스타헬스키",
        country: "미국",
        difficulty: 1,
        pace: "빠름",
        contextLevel: 1,
        formLevel: 2,
        emotionalHook: 4,
        reason:
          "군더더기 없이 동작과 규칙으로 밀고 갑니다. 액션의 동선과 리듬이 또렷하게 보이는 영화예요.",
        beforeYouWatch:
          "세계관 설명을 다 외우기보다, 액션이 얼마나 읽기 쉽게 설계되는지 보세요.",
        unlockCopy:
          "복잡한 해석 없이도 장면의 설계를 즐길 수 있는 단계입니다.",
        connectionToNext:
          "깔끔한 동작 설계에서, 훨씬 거칠고 밀도 높은 육탄전으로",
      },
      {
        id: "the-raid",
        stage: 6,
        title: "레이드: 첫 번째 습격",
        originalTitle: "The Raid",
        year: 2011,
        director: "가렛 에반스",
        country: "인도네시아",
        difficulty: 2,
        pace: "빠름",
        contextLevel: 1,
        formLevel: 2,
        emotionalHook: 4,
        reason:
          "거의 한 건물 안에서 액션의 밀도를 끝까지 밀어붙입니다. 몸의 리듬이 서사를 대신하는 순간이 있어요.",
        beforeYouWatch:
          "대사보다 동선과 체력의 변화를 따라가면 영화가 훨씬 선명합니다.",
        unlockCopy:
          "액션의 속도가 꽤 높지만, 구조는 단순해서 따라가기 좋습니다.",
        connectionToNext:
          "거친 육탄전에서, 코미디와 스턴트가 섞인 홍콩 액션의 탄력으로",
      },
      {
        id: "police-story",
        stage: 7,
        title: "폴리스 스토리",
        originalTitle: "Police Story",
        year: 1985,
        director: "성룡",
        country: "홍콩",
        difficulty: 2,
        pace: "빠름",
        contextLevel: 2,
        formLevel: 2,
        emotionalHook: 4,
        reason:
          "위험한 스턴트와 코미디가 한 몸처럼 움직입니다. 액션이 몸으로 만들어지는 느낌을 직접 볼 수 있어요.",
        beforeYouWatch:
          "톤이 갑자기 가벼워져도 당황하지 않아도 됩니다. 홍콩 액션의 리듬 자체가 매력입니다.",
        unlockCopy:
          "액션이 얼마나 물리적이고 유쾌할 수 있는지 보는 단계입니다.",
        connectionToNext:
          "스턴트의 탄력에서, 총격과 우정과 멜로드라마가 폭발하는 세계로",
      },
      {
        id: "hard-boiled",
        stage: 8,
        title: "첩혈속집",
        originalTitle: "Hard Boiled",
        year: 1992,
        director: "오우삼",
        country: "홍콩",
        difficulty: 3,
        pace: "빠름",
        contextLevel: 2,
        formLevel: 3,
        emotionalHook: 4,
        reason:
          "액션이 거의 감정의 언어처럼 터집니다. 과장된 멋과 리듬을 받아들이면 아주 신나게 볼 수 있어요.",
        beforeYouWatch:
          "현실성보다 리듬, 우정, 멋의 과잉을 즐기면 훨씬 편합니다.",
        unlockCopy:
          "장르영화의 즐거움이 꽤 멀리까지 데려다줄 수 있다는 마무리입니다.",
        connectionToNext:
          "계속 재밌게 보는 힘이 생겼다면, 더 조용한 영화도 덜 멀게 느껴질 거예요.",
      },
    ],
  },
];

export function getRouteBySlug(slug: string) {
  return routes.find((route) => route.slug === slug);
}
