import type { ToeicPart4Question } from '../../types';

export const toeicPart4Questions: ToeicPart4Question[] = [
  {
    id: 'toeic_p4_001',
    part: 4,
    tag: 'toeic-part4-announcement',
    talk: [
      'Attention, shoppers. Our store will be closing in fifteen minutes.',
      'Please bring your final selections to the checkout counters at the front of the store.',
      'We would like to remind you that our weekend sale continues tomorrow with discounts of up to fifty percent.',
    ],
    explanation: '閉店15分前の店内アナウンスです。会計を促し、翌日のセール継続を案内しています。',
    questions: [
      { id: 'toeic_p4_001_q1', question: 'Where is this announcement being made?', choices: ['At a train station', 'At a store', 'At an airport', 'At a restaurant'], correctIndex: 1 },
      { id: 'toeic_p4_001_q2', question: 'What are customers asked to do?', choices: ['Leave the building immediately', 'Bring items to the checkout', 'Return items to shelves', 'Wait outside'], correctIndex: 1 },
      { id: 'toeic_p4_001_q3', question: 'What will happen tomorrow?', choices: ['The store will be closed.', 'The sale will continue.', 'New items will arrive.', 'Prices will increase.'], correctIndex: 1 },
    ],
  },
  {
    id: 'toeic_p4_002',
    part: 4,
    tag: 'toeic-part4-broadcast',
    talk: [
      'Good morning, and welcome to the local news update.',
      'Traffic on Main Street is heavier than usual this morning due to construction work near the bridge.',
      'Drivers are advised to use Second Avenue as an alternative route until the work is completed next week.',
    ],
    explanation: 'ラジオの交通ニュースです。工事による渋滞と迂回路の案内をしています。',
    questions: [
      { id: 'toeic_p4_002_q1', question: 'What is the main topic of this report?', choices: ['Weather conditions', 'Traffic conditions', 'A sports event', 'A new store opening'], correctIndex: 1 },
      { id: 'toeic_p4_002_q2', question: 'Why is traffic heavier than usual?', choices: ['An accident occurred.', 'Construction work is happening.', 'It is a holiday.', 'A parade is taking place.'], correctIndex: 1 },
      { id: 'toeic_p4_002_q3', question: 'What are drivers advised to do?', choices: ['Avoid driving today', 'Use Second Avenue', 'Take the train instead', 'Wait until next month'], correctIndex: 1 },
    ],
  },
  {
    id: 'toeic_p4_003',
    part: 4,
    tag: 'toeic-part4-voicemail',
    talk: [
      'Hi, this is Sarah from the accounting department.',
      'I\'m calling about the invoice you sent last week. A couple of the numbers don\'t match our records.',
      'Could you please call me back at extension 204 so we can sort this out before Friday?',
    ],
    explanation: '経理部からの留守番電話メッセージです。請求書の数字の不一致について折り返しを依頼しています。',
    questions: [
      { id: 'toeic_p4_003_q1', question: 'Who most likely is Sarah?', choices: ['A client', 'An accounting employee', 'A delivery driver', 'A job applicant'], correctIndex: 1 },
      { id: 'toeic_p4_003_q2', question: 'Why is Sarah calling?', choices: ['To place an order', 'To report a problem with an invoice', 'To schedule a meeting', 'To offer a job'], correctIndex: 1 },
      { id: 'toeic_p4_003_q3', question: 'What does Sarah ask the listener to do?', choices: ['Send a new invoice', 'Call her back', 'Visit her office', 'Cancel the order'], correctIndex: 1 },
    ],
  },
  {
    id: 'toeic_p4_004',
    part: 4,
    tag: 'toeic-part4-tour',
    talk: [
      'Welcome to the museum. Before we begin the tour, please turn off your mobile phones.',
      'We will start in the main hall and then move to the modern art section.',
      'Photography is allowed, but please do not use flash near the paintings.',
    ],
    explanation: '美術館ツアーの開始時の案内です。写真撮影は可能だがフラッシュは禁止と述べています。',
    questions: [
      { id: 'toeic_p4_004_q1', question: 'Where is this talk taking place?', choices: ['At a museum', 'At a hotel', 'At a theater', 'At a library'], correctIndex: 0 },
      { id: 'toeic_p4_004_q2', question: 'What are visitors asked to do before the tour?', choices: ['Buy a ticket', 'Turn off their phones', 'Sign a form', 'Wear a badge'], correctIndex: 1 },
      { id: 'toeic_p4_004_q3', question: 'What is NOT allowed during the tour?', choices: ['Taking photos', 'Using flash near paintings', 'Asking questions', 'Walking around'], correctIndex: 1 },
    ],
  },
];
