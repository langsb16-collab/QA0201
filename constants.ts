
export const APP_NAME = "리워드보이스 (RewardVoice)";
export const APP_SLOGAN = "수수료는 0원, 참여는 가치 있게";

export const AGE_GROUPS = ["10대", "20대", "30대", "40대", "50대", "60대 이상"];
export const GENDERS = ["남성", "여성"];
export const TIME_BUCKETS = ["오전", "점심", "오후", "저녁", "야간"];

export const CATEGORIES = [
  { id: 'food', name: '음식점/카페' },
  { id: 'politics', name: '정치/정책' },
  { id: 'economy', name: '경제/물가' },
  { id: 'society', name: '사회/복지' },
  { id: 'culture', name: '문화/축제' },
  { id: 'market', name: '전통시장' }
];

export const GOALS = [
  { id: 'sales', name: '매출/활성화 증대' },
  { id: 'opinion', name: '여론 수렴' },
  { id: 'influx', name: '신규 유입' },
  { id: 'retention', name: '재방문/재참여 강화' }
];

export const AI_QUESTION_TEMPLATES: Record<string, any> = {
  food: [
    { id: "q1", text: "주로 어떤 경로로 이용하시나요?", type: "SINGLE_CHOICE", options: ["직접 매장 방문", "배달 앱", "포장"] },
    { id: "q2", text: "가장 선호하는 메뉴는?", type: "MULTIPLE_CHOICE", options: ["한식", "중식", "양식", "일식", "기타"] },
    { id: "q4", text: "매장 개선이 필요한 부분은?", type: "TEXT" }
  ],
  politics: [
    { id: "p1", text: "현재 가장 시급한 지역 정책 현안은 무엇입니까?", type: "SINGLE_CHOICE", options: ["청년 일자리", "주거 안정", "보육/교육 인프라", "노인 복지", "교통 체증 개선"] },
    { id: "p2", text: "지역 예산 투입 시 가장 우선순위를 두어야 할 분야는?", type: "MULTIPLE_CHOICE", options: ["문화/관광", "복지 서비스", "사회 기반 시설", "지역 경제 활성화", "재난 안전"] },
    { id: "p3", text: "정책 수립 시 시민의 의견이 충분히 반영되고 있다고 느끼시나요?", type: "SINGLE_CHOICE", options: ["매우 그렇다", "그렇다", "보통", "부족하다", "매우 부족하다"] },
    { id: "p4", text: "지자체에 바라는 새로운 정책 아이디어를 적어주세요.", type: "TEXT" }
  ],
  economy: [
    { id: "e1", text: "최근 물가 상승으로 인해 가장 지출을 줄인 항목은?", type: "SINGLE_CHOICE", options: ["외식비", "문화/취미생활", "의류/잡화", "생필품 구입"] },
    { id: "e2", text: "지역 경제 활성화를 위해 가장 효과적이라고 생각하는 방안은?", type: "SINGLE_CHOICE", options: ["지역 화폐 혜택 확대", "전통시장 현대화", "소상공인 대출 지원", "공공 배달 앱 활성화"] },
    { id: "e3", text: "우리 지역의 소비 환경에 대한 의견을 자유롭게 적어주세요.", type: "TEXT" }
  ],
  society: [
    { id: "s1", text: "현재 우리 지역의 전반적인 복지 수준에 만족하십니까?", type: "SINGLE_CHOICE", options: ["매우 만족", "만족", "보통", "불만족", "매우 불만족"] },
    { id: "s2", text: "일상생활에서 느끼는 가장 큰 사회적 불편함은 무엇인가요?", type: "SINGLE_CHOICE", options: ["교통 소음", "치안 불안", "주차 공간 부족", "의료 서비스 접근성 저하"] },
    { id: "s3", text: "사회 서비스 개선을 위한 구체적인 제안이 있다면 작성해주세요.", type: "TEXT" }
  ],
  culture: [
    { id: "c1", text: "지난 1년간 지역 문화 행사에 참여한 횟수는?", type: "SINGLE_CHOICE", options: ["0회", "1-2회", "3-5회", "5회 이상"] },
    { id: "c2", text: "가장 선호하는 문화 축제 테마는 무엇인가요?", type: "MULTIPLE_CHOICE", options: ["K-POP/음악", "역사/전통", "미식/먹거리", "예술/전시", "어린이/가족"] },
    { id: "c3", text: "축제 방문 시 가장 만족스럽거나 아쉬웠던 점을 적어주세요.", type: "TEXT" }
  ],
  market: [
    { id: "m1", text: "전통시장 방문 빈도는?", type: "SINGLE_CHOICE", options: ["주 1회 이상", "월 1-2회", "명절/행사 시에만"] },
    { id: "m3", text: "시장 이용 시 가장 불편한 점은?", type: "SINGLE_CHOICE", options: ["주차장 부족", "카드 결제 불편", "위생 상태", "길 찾기 어려움"] },
    { id: "m4", text: "전통시장에 필요한 변화는?", type: "TEXT" }
  ]
};
