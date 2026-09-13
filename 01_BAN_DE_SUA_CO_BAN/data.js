/*
  FILE DỮ LIỆU - PHẦN DỄ SỬA NHẤT
  Có thể thêm, xóa hoặc đổi nội dung mà không cần sửa app.js.
*/

window.TAPA_DATA = {
  vocabularyTopics: [
    { icon: "🏠", title: "Sinh hoạt hằng ngày", korean: "일상생활", count: 420, description: "Nhà ở, mua sắm, giao thông, bệnh viện" },
    { icon: "🏢", title: "Nơi làm việc", korean: "직장생활", count: 510, description: "Thái độ, đồng nghiệp, quản lý công việc" },
    { icon: "⚙️", title: "Cơ khí và sản xuất", korean: "제조업", count: 680, description: "Dụng cụ, gia công, lắp ráp, đóng gói" },
    { icon: "🌿", title: "Nông - lâm - ngư nghiệp", korean: "농림어업", count: 390, description: "Trồng trọt, chăn nuôi, thủy sản" },
    { icon: "⛑️", title: "An toàn lao động", korean: "산업 안전", count: 360, description: "Biển báo, bảo hộ, tai nạn và sơ cứu" },
    { icon: "📄", title: "Pháp luật lao động", korean: "노동 법률", count: 240, description: "Hợp đồng, lương, bảo hiểm, cư trú" }
  ],

  grammarGroups: [
    { title: "Đuôi kết thúc câu", forms: "-아요/어요 · -(스)ㅂ니다 · -지요?" },
    { title: "Nối câu", forms: "-고 · -아서/어서 · -(으)니까 · -지만" },
    { title: "Thời gian và trình tự", forms: "-기 전에 · -(으)ㄴ 후에 · -다가" },
    { title: "Mệnh lệnh và yêu cầu", forms: "-아/어 주세요 · -(으)세요 · -도록 하다" },
    { title: "Kinh nghiệm và suy đoán", forms: "-아/어 보다 · -(으)ㄴ 적이 있다 · 것 같다" },
    { title: "Gián tiếp và bị động", forms: "-(으)라고 하다 · -다고 하다 · -아/어지다" }
  ],

  book1: [
    "자기소개", "생활용품", "위치와 장소", "동작과 사물", "날짜와 요일", "하루 일과", "계절과 날씨", "가족과 친구", "음식 주문", "물건 구입",
    "집안일", "대중교통", "주말 활동", "길 찾기", "옷차림", "집 구하기", "휴가", "취미", "요리", "인터넷과 스마트폰",
    "병원", "약국", "우체국", "은행", "외국인 근로자 지원 기관", "한국의 주거 문화와 음식 문화", "한국의 기념일", "한국의 명절", "한국의 예절", "한국의 대중문화"
  ],

  book2: [
    "복장과 근무 태도", "회사 시설 이용", "동료와의 관계", "성희롱 및 성추행 예방", "작업장 관리", "출하 관리", "기계 가공", "기계 조립", "금속 가공", "플라스틱·고무 성형",
    "섬유 제조", "가구 제작", "건축 시공", "토목 시공", "농작물 재배", "사육 관리", "연안 어업과 양식", "선체 건조", "광물 자원 개발·생산", "산림 자원 조성",
    "숙박 서비스", "음식 조리", "산업 안전 및 보건 표지", "산업 안전 및 보건 수칙", "산업 안전 및 위생 장비", "산업 재해 예방 및 응급 조치", "고용허가제", "근로기준법", "외국인 등록과 체류", "근로자 보험"
  ],

  lesson39: {
    vocabulary: [
      ["파이프", "ống"], ["바이스", "ê-tô"], ["쇠톱", "cưa sắt"],
      ["용접기", "máy hàn"], ["불꽃", "tia lửa"], ["고정하다", "cố định"]
    ],
    grammar: [
      { form: "-(으)라고 하다", meaning: "Truyền đạt mệnh lệnh", example: "반장님이 파이프를 자르라고 했어요." },
      { form: "-기", meaning: "Danh từ hóa hành động", example: "파이프를 자르기 쉬워요." }
    ]
  },

  /* correct: A=0, B=1, C=2, D=3 */
  readingQuestions: [
    { id: 1, image: "assets/images/image1.png", question: "다음 그림을 보고 맞는 단어를 고르십시오.", options: ["냄비입니다.", "프라이팬입니다.", "전기밥솥입니다.", "자동차입니다."], correct: 2, explanation: "그림은 전기밥솥입니다." },
    { id: 2, image: "assets/images/image2.jpeg", question: "다음 그림을 보고 맞는 단어를 고르십시오.", options: ["스피커입니다.", "라이터입니다.", "라벨입니다.", "계산기입니다."], correct: 1, explanation: "불을 붙이는 물건은 라이터입니다." },
    { id: 3, question: "교통카드는 대중교통을 이용하기 전에 미리 ______ 합니다.", options: ["교환해야", "환불해야", "송금해야", "충전해야"], correct: 3, explanation: "교통카드에 돈을 넣는 것은 충전하다입니다." },
    { id: 4, question: "공원이나 지하철 같은 ______에서 큰 소리로 떠들면 안 됩니다.", options: ["공공장소", "경기장", "운동장", "위험 지역"], correct: 0, explanation: "여러 사람이 함께 쓰는 곳은 공공장소입니다." },
    { id: 5, question: "‘기상하다’와 비슷한 말은 무엇입니까?", options: ["말다툼을 하다", "마련하다", "믿다", "일어나다"], correct: 3, explanation: "기상하다와 일어나다는 비슷한 뜻입니다." }
  ]
};

