import type {
  AudioAsset,
  AudioRange,
  AssetImage,
  BestScores,
  CatalogGroup,
  Lesson,
  LibraryItem,
  Question,
} from "../types/learning";

export const assetImages = {
  riceCooker: {
    src: "/images/image1.png",
    alt: "Nồi cơm điện có bảng điều khiển phía trước",
    width: 159,
    height: 120,
  },
  lighter: {
    src: "/images/image2.jpeg",
    alt: "Bật lửa kim loại màu đen đang cháy",
    width: 363,
    height: 324,
  },
  wheelbarrow: {
    src: "/images/image3.png",
    alt: "Xe cút kít một bánh có hai tay cầm",
    width: 170,
    height: 141,
  },
  worker: {
    src: "/images/image4.png",
    alt: "Công nhân đội mũ bảo hộ đang dùng thiết bị đo gần dây điện",
    width: 163,
    height: 153,
  },
  biohazard: {
    src: "/images/image5.png",
    alt: "Biển cảnh báo nguy hiểm sinh học hình tam giác vàng",
    width: 167,
    height: 125,
  },
  noSmoking: {
    src: "/images/image6.png",
    alt: "Biển cấm hút thuốc hình tròn đỏ",
    width: 151,
    height: 141,
  },
} satisfies Record<string, AssetImage>;

const groupDefinitions = [
  ["foundation", "Foundation", "Core routines for getting started."],
  ["workplace", "Workplace", "Common workday situations and responsibilities."],
  ["safety", "Safety", "Practical signals, precautions, and procedures."],
  ["services", "Services", "Everyday public and customer-service interactions."],
  ["community", "Community", "Planning, travel, and shared activities."],
  ["review", "Review", "Short mixed review sessions."],
] as const;

const lessonTitles = [
  "Starting point", "Daily routine", "Simple choices", "Time and dates", "Places nearby",
  "People and roles", "Useful objects", "Clear directions", "Short notices", "Quick review",
  "Arriving at work", "Task sequence", "Tools and materials", "Schedules", "Team updates",
  "Requests", "Quality check", "Break time", "End of shift", "Quick review",
  "Protective equipment", "Warning signs", "Safe movement", "Emergency steps", "Clean spaces",
  "Reporting a risk", "Handling materials", "Shared equipment", "Safety check", "Quick review",
  "Making an appointment", "At the counter", "Finding information", "Payments", "Deliveries",
  "Public transport", "Food and shopping", "Phone messages", "Confirmation", "Quick review",
  "Meeting plans", "Weather plans", "Travel details", "Home routines", "Visitors",
  "Local events", "Personal goals", "Helpful questions", "Follow-up", "Quick review",
  "Reading focus", "Listening focus", "Number practice", "Sequence practice", "Sign practice",
  "Choice practice", "Short dialogue", "Longer notice", "Mixed quiz", "Final review",
] as const;

export const lessons: Lesson[] = lessonTitles.map((label, index) => {
  const group = groupDefinitions[Math.floor(index / 10)];

  return {
    id: `lesson-${String(index + 1).padStart(2, "0")}`,
    groupId: group[0],
    label: `Lesson ${String(index + 1).padStart(2, "0")} · ${label}`,
    description: `A short, focused practice set for ${label.toLowerCase()}.`,
    order: index + 1,
  };
});

export const catalogGroups: CatalogGroup[] = groupDefinitions.map(([id, label, description], index) => ({
  id,
  label,
  description,
  lessonIds: lessons.slice(index * 10, (index + 1) * 10).map((lesson) => lesson.id),
}));

export const libraryItems: LibraryItem[] = [
  { id: "guide-start", title: "Getting started", description: "A brief guide to the practice flow.", category: "guide", image: assetImages.riceCooker },
  { id: "guide-safety", title: "Safety signals", description: "A visual reference for common safety cues.", category: "reference", image: assetImages.biohazard },
  { id: "guide-signs", title: "Public signs", description: "A visual reference for restrictions and notices.", category: "reference", image: assetImages.noSmoking },
  { id: "practice-tools", title: "Tools at work", description: "A short picture-supported practice set.", category: "practice", image: assetImages.wheelbarrow },
  { id: "practice-audio", title: "Listening practice", description: "A timed listening practice track.", category: "practice", audioSrc: "/audio/listening-practice.m4a" },
  { id: "guide-work", title: "Work routines", description: "A visual prompt for work-related practice.", category: "guide", image: assetImages.worker },
  { id: "reference-objects", title: "Everyday objects", description: "A visual prompt for identifying familiar items.", category: "reference", image: assetImages.lighter },
];

export const defaultBestScores: BestScores = {
  reading: 0,
  listening: 0,
  combined: 0,
};

export const listeningPracticeAudio: AudioAsset = {
  src: "/audio/listening-practice.m4a",
  durationSeconds: 86.889116,
};

const readingPrompts: Array<[string, string[], number]> = [
  ["A sign says ‘Staff only’. Who may enter?", ["Any visitor", "Only workers", "Only children", "Only drivers"], 1],
  ["A notice says ‘Closed at 18:00’. When should you arrive?", ["Before 18:00", "At midnight", "After 20:00", "Tomorrow only"], 0],
  ["A schedule lists a break from 12:00 to 12:30. How long is the break?", ["15 minutes", "20 minutes", "30 minutes", "60 minutes"], 2],
  ["A map arrow points left to the reception desk. Which way should you go?", ["Up", "Down", "Left", "Right"], 2],
  ["A label says ‘Fragile’. What needs extra care?", ["The package", "The calendar", "The chair", "The door"], 0],
  ["A reminder says ‘Bring your badge’. What should you take?", ["A badge", "A receipt", "A bottle", "A key"], 0],
  ["A room list shows ‘Meeting B — Floor 2’. Where is Meeting B?", ["Floor 1", "Floor 2", "Floor 3", "Outside"], 1],
  ["A queue notice says ‘Take a number’. What should you do first?", ["Sit down", "Take a number", "Call a friend", "Leave"], 1],
  ["A delivery note says ‘Two boxes’. How many boxes are expected?", ["One", "Two", "Three", "Four"], 1],
  ["A message says ‘Call back after lunch’. When should you call?", ["Before lunch", "During lunch", "After lunch", "Next week"], 2],
  ["A sign says ‘Wet floor’. What is the safest action?", ["Run", "Walk carefully", "Jump", "Sit down"], 1],
  ["A list says ‘Check, pack, send’. What happens second?", ["Check", "Pack", "Send", "Wait"], 1],
  ["A form asks for a phone number. Which detail is needed?", ["A color", "A phone number", "A hobby", "A meal"], 1],
  ["A notice says ‘Use the side entrance’. Which entrance should you use?", ["Main entrance", "Side entrance", "Garage", "Roof"], 1],
  ["A calendar marks Friday as a holiday. What is Friday?", ["A workday", "A holiday", "A meeting", "A deadline"], 1],
  ["A label reads ‘Cold storage’. What is this area for?", ["Warm food", "Cold items", "Office work", "Parking"], 1],
  ["A ticket shows seat 14. Which seat is yours?", ["Seat 4", "Seat 10", "Seat 14", "Seat 40"], 2],
  ["A message says ‘The bus is delayed’. What has changed?", ["The bus color", "The arrival time", "The route name", "The ticket price"], 1],
  ["A poster says ‘Meeting moved to Room 5’. Where is the meeting now?", ["Room 2", "Room 3", "Room 4", "Room 5"], 3],
  ["A reminder says ‘Submit by Monday’. What is the deadline?", ["Saturday", "Sunday", "Monday", "Tuesday"], 2],
];

const listeningPrompts: Array<[string, string[], number]> = [
  ["The speaker confirms a morning appointment. When is it?", ["Morning", "Afternoon", "Evening", "Night"], 0],
  ["The speaker asks for a name at the desk. What information is requested?", ["A name", "A color", "A meal", "A route"], 0],
  ["The announcement mentions platform three. Where should listeners go?", ["Platform one", "Platform two", "Platform three", "Platform four"], 2],
  ["The caller says the package arrives today. What is arriving?", ["A letter", "A package", "A bus", "A guest"], 1],
  ["The notice asks everyone to wait. What should they do?", ["Wait", "Run", "Shop", "Drive"], 0],
  ["The speaker says the meeting starts at nine. What time is it?", ["Seven", "Eight", "Nine", "Ten"], 2],
  ["The message asks for a callback. What action is needed?", ["Send a photo", "Call back", "Open a door", "Buy a ticket"], 1],
  ["The announcement says the lift is unavailable. What is unavailable?", ["The stairs", "The lift", "The café", "The gate"], 1],
  ["The speaker confirms a table for four. How many people?", ["Two", "Three", "Four", "Five"], 2],
  ["The caller says to bring identification. What should you bring?", ["Identification", "A map", "A chair", "A cup"], 0],
  ["The message says the office is on the third floor. Which floor?", ["First", "Second", "Third", "Fourth"], 2],
  ["The speaker asks listeners to use the rear door. Which door?", ["Front", "Rear", "Side", "Locked"], 1],
  ["The announcement says the next stop is Central Square. What is next?", ["The airport", "Central Square", "The library", "The station"], 1],
  ["The caller says the order is ready for collection. What is ready?", ["An order", "A lesson", "A train", "A room"], 0],
  ["The message asks for a receipt. What document is requested?", ["A receipt", "A passport", "A timetable", "A badge"], 0],
  ["The speaker says the event is cancelled. What happened?", ["It moved", "It ended", "It was cancelled", "It started"], 2],
  ["The announcement gives gate six. Which gate?", ["Gate four", "Gate five", "Gate six", "Gate seven"], 2],
  ["The caller says the technician will arrive later. Who will arrive?", ["A teacher", "A technician", "A visitor", "A driver"], 1],
  ["The message says to meet outside. Where should you meet?", ["Inside", "Outside", "Upstairs", "Online"], 1],
  ["The speaker says the office opens at eight. When does it open?", ["Six", "Seven", "Eight", "Nine"], 2],
];

const listeningRanges: AudioRange[] = [
  { src: listeningPracticeAudio.src, startSeconds: 0, endSeconds: 2.8, transcript: "Question one. Your appointment is in the morning." },
  { src: listeningPracticeAudio.src, startSeconds: 4.3, endSeconds: 7, transcript: "Question two. Please tell the desk your name." },
  { src: listeningPracticeAudio.src, startSeconds: 8.5, endSeconds: 11.55, transcript: "Question three. Please go to platform three." },
  { src: listeningPracticeAudio.src, startSeconds: 13, endSeconds: 15.85, transcript: "Question four. Your package arrives today." },
  { src: listeningPracticeAudio.src, startSeconds: 17.3, endSeconds: 19.55, transcript: "Question five. Please wait here." },
  { src: listeningPracticeAudio.src, startSeconds: 20.95, endSeconds: 23.9, transcript: "Question six. The meeting starts at nine." },
  { src: listeningPracticeAudio.src, startSeconds: 25.3, endSeconds: 28, transcript: "Question seven. Please call back later." },
  { src: listeningPracticeAudio.src, startSeconds: 29.45, endSeconds: 32, transcript: "Question eight. The lift is unavailable." },
  { src: listeningPracticeAudio.src, startSeconds: 33.45, endSeconds: 36.45, transcript: "Question nine. Your table is for four people." },
  { src: listeningPracticeAudio.src, startSeconds: 37.85, endSeconds: 40.95, transcript: "Question ten. Please bring identification." },
  { src: listeningPracticeAudio.src, startSeconds: 42.35, endSeconds: 45.45, transcript: "Question eleven. The office is on the third floor." },
  { src: listeningPracticeAudio.src, startSeconds: 46.85, endSeconds: 49.55, transcript: "Question twelve. Please use the rear door." },
  { src: listeningPracticeAudio.src, startSeconds: 51, endSeconds: 54.45, transcript: "Question thirteen. The next stop is Central Square." },
  { src: listeningPracticeAudio.src, startSeconds: 55.85, endSeconds: 59.35, transcript: "Question fourteen. Your order is ready for collection." },
  { src: listeningPracticeAudio.src, startSeconds: 60.7, endSeconds: 63.6, transcript: "Question fifteen. Please bring your receipt." },
  { src: listeningPracticeAudio.src, startSeconds: 65, endSeconds: 67.95, transcript: "Question sixteen. The event is cancelled." },
  { src: listeningPracticeAudio.src, startSeconds: 69.35, endSeconds: 72.45, transcript: "Question seventeen. Please use gate six." },
  { src: listeningPracticeAudio.src, startSeconds: 73.65, endSeconds: 76.9, transcript: "Question eighteen. The technician will arrive later." },
  { src: listeningPracticeAudio.src, startSeconds: 78.3, endSeconds: 81.1, transcript: "Question nineteen. Please meet outside." },
  { src: listeningPracticeAudio.src, startSeconds: 82.5, endSeconds: 85.3, transcript: "Question twenty. The office opens at eight." },
];

function buildQuestions(
  kind: "reading" | "listening",
  prompts: Array<[string, string[], number]>,
): Question[] {
  return prompts.map(([label, options, answerIndex], index) => ({
    id: `${kind}-${String(index + 1).padStart(2, "0")}`,
    kind,
    label,
    options,
    answerIndex,
    explanation: "Choose the option that directly matches the neutral prompt.",
    ...(kind === "listening" ? { audioRange: listeningRanges[index] } : {}),
  }));
}

export const readingQuestions = buildQuestions("reading", readingPrompts);
export const listeningQuestions = buildQuestions("listening", listeningPrompts);

export const lessonPracticeQuestions: Question[] = [
  {
    id: "lesson-practice-01",
    kind: "reading",
    label: "A card says ‘Start here’. What should you do?",
    options: ["Start here", "Stop here", "Wait outside", "Return tomorrow"],
    answerIndex: 0,
    explanation: "The instruction clearly identifies the starting point.",
  },
  {
    id: "lesson-practice-02",
    kind: "reading",
    label: "A label says ‘Room 8’. Which room should you find?",
    options: ["Room 6", "Room 7", "Room 8", "Room 9"],
    answerIndex: 2,
    explanation: "Match the room number shown on the label.",
  },
  {
    id: "lesson-practice-03",
    kind: "reading",
    label: "A message says ‘Bring a pen’. What is needed?",
    options: ["A pen", "A bag", "A ticket", "A coat"],
    answerIndex: 0,
    explanation: "The message directly names the required item.",
  },
];
