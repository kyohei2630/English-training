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
  {
    id: 'toeic_p4_005',
    part: 4,
    tag: 'toeic-part4-safety',
    talk: [
      'Attention all warehouse staff. Please remember that safety helmets are required in all loading areas.',
      'We have noticed an increase in minor incidents this month, so please take extra care when operating machinery.',
      'If you notice any safety hazards, report them to your supervisor immediately.',
    ],
    explanation: '倉庫スタッフ向けの安全に関する社内アナウンスです。',
    questions: [
      { id: 'toeic_p4_005_q1', question: 'Who is this announcement intended for?', choices: ['Office staff', 'Warehouse staff', 'Customers', 'Delivery drivers'], correctIndex: 1 },
      { id: 'toeic_p4_005_q2', question: 'What has increased this month?', choices: ['Sales', 'Minor incidents', 'Staff numbers', 'Deliveries'], correctIndex: 1 },
      { id: 'toeic_p4_005_q3', question: 'What should employees do if they notice a hazard?', choices: ['Ignore it', 'Report it to their supervisor', 'Fix it themselves', 'Leave the building'], correctIndex: 1 },
    ],
  },
  {
    id: 'toeic_p4_006',
    part: 4,
    tag: 'toeic-part4-podcast',
    talk: [
      "Welcome back to Business Insights, the podcast about trends shaping the modern workplace.",
      "Today we're talking with a guest about the rise of remote work and how companies are adapting their office spaces.",
      'Stay tuned after the break for tips on managing a hybrid team effectively.',
    ],
    explanation: 'ビジネス系ポッドキャストの冒頭部分です。リモートワークとハイブリッドチームの運営について扱っています。',
    questions: [
      { id: 'toeic_p4_006_q1', question: 'What is this podcast about?', choices: ['Cooking recipes', 'Workplace trends', 'Sports news', 'Travel destinations'], correctIndex: 1 },
      { id: 'toeic_p4_006_q2', question: "What is today's episode about?", choices: ['Remote work and office space', 'A new product launch', 'Company history', 'Stock market news'], correctIndex: 0 },
      { id: 'toeic_p4_006_q3', question: 'What will be discussed after the break?', choices: ['Managing a hybrid team', 'A new podcast host', 'Advertising rates', 'Listener questions'], correctIndex: 0 },
    ],
  },
  {
    id: 'toeic_p4_007',
    part: 4,
    tag: 'toeic-part4-weather',
    talk: [
      'Good evening, here is your weather forecast for the week.',
      'Tomorrow will be mostly sunny with a high of twenty-two degrees, perfect for outdoor activities.',
      'However, rain is expected to move in by Thursday, so plan any outdoor events accordingly.',
    ],
    explanation: '週間天気予報の放送です。',
    questions: [
      { id: 'toeic_p4_007_q1', question: 'What is the forecast for tomorrow?', choices: ['Rainy', 'Mostly sunny', 'Snowy', 'Foggy'], correctIndex: 1 },
      { id: 'toeic_p4_007_q2', question: 'What is the high temperature expected tomorrow?', choices: ['Twelve degrees', 'Twenty-two degrees', 'Thirty degrees', 'Fifteen degrees'], correctIndex: 1 },
      { id: 'toeic_p4_007_q3', question: 'When is rain expected?', choices: ['Tomorrow', 'Thursday', 'This weekend', 'Next month'], correctIndex: 1 },
    ],
  },
  {
    id: 'toeic_p4_008',
    part: 4,
    tag: 'toeic-part4-conference',
    talk: [
      'Good morning, everyone, and welcome to the third annual Technology Innovation Summit.',
      "Over the next two days, you'll hear from industry leaders and have the chance to network with fellow professionals.",
      'Please check the schedule in your welcome packet for the room assignments for each session.',
    ],
    explanation: 'カンファレンスの開会あいさつです。',
    questions: [
      { id: 'toeic_p4_008_q1', question: 'What event is taking place?', choices: ['A job fair', 'A technology summit', 'A product sale', 'A sports competition'], correctIndex: 1 },
      { id: 'toeic_p4_008_q2', question: 'How long will the event last?', choices: ['One day', 'Two days', 'One week', 'Three days'], correctIndex: 1 },
      { id: 'toeic_p4_008_q3', question: 'Where can attendees find room assignments?', choices: ['On a screen', 'In their welcome packet', 'At the front desk', 'On the website'], correctIndex: 1 },
    ],
  },
  {
    id: 'toeic_p4_009',
    part: 4,
    tag: 'toeic-part4-retirement',
    talk: [
      "Before we end today's meeting, I'd like to say a few words about Karen, who is retiring after twenty-five years with the company.",
      'Karen has trained countless employees and always brought a positive attitude to every project.',
      "Please join me in the break room at four o'clock for a small farewell celebration.",
    ],
    explanation: '退職する社員へのお別れのスピーチです。',
    questions: [
      { id: 'toeic_p4_009_q1', question: 'What is the purpose of this talk?', choices: ['To announce a promotion', 'To honor a retiring employee', 'To introduce a new hire', 'To review the budget'], correctIndex: 1 },
      { id: 'toeic_p4_009_q2', question: 'How long did Karen work at the company?', choices: ['Ten years', 'Fifteen years', 'Twenty-five years', 'Five years'], correctIndex: 2 },
      { id: 'toeic_p4_009_q3', question: "What will happen at four o'clock?", choices: ['A meeting', 'A farewell celebration', 'A training session', 'A client call'], correctIndex: 1 },
    ],
  },
  {
    id: 'toeic_p4_010',
    part: 4,
    tag: 'toeic-part4-instructions',
    talk: [
      'Before using this equipment, please read all the instructions carefully.',
      'Make sure the power switch is off before connecting any cables.',
      'If you experience any unusual noise or smell, disconnect the device immediately and contact technical support.',
    ],
    explanation: '機器の安全な使用方法についての説明です。',
    questions: [
      { id: 'toeic_p4_010_q1', question: 'What should be done before connecting cables?', choices: ['Turn on the power', 'Turn off the power', 'Call support', 'Read the warranty'], correctIndex: 1 },
      { id: 'toeic_p4_010_q2', question: 'What should you do if you notice an unusual smell?', choices: ['Ignore it', 'Disconnect the device and contact support', 'Continue using it', 'Restart the device'], correctIndex: 1 },
      { id: 'toeic_p4_010_q3', question: 'What is this talk mainly about?', choices: ['How to assemble furniture', 'How to safely use equipment', 'How to return a product', 'How to install software'], correctIndex: 1 },
    ],
  },
  {
    id: 'toeic_p4_011',
    part: 4,
    tag: 'toeic-part4-flight',
    talk: [
      'We are now ready to begin boarding Flight 482 to Chicago.',
      'Passengers seated in rows one through fifteen, please proceed to the gate first.',
      'We ask all other passengers to remain seated until their row is called.',
    ],
    explanation: '空港での搭乗案内アナウンスです。',
    questions: [
      { id: 'toeic_p4_011_q1', question: 'What is being announced?', choices: ['A flight delay', 'The start of boarding', 'A gate change', 'A flight cancellation'], correctIndex: 1 },
      { id: 'toeic_p4_011_q2', question: 'Who should board first?', choices: ['Passengers in rows one through fifteen', 'All passengers at once', 'Passengers with children', 'First class passengers only'], correctIndex: 0 },
      { id: 'toeic_p4_011_q3', question: 'What are other passengers asked to do?', choices: ['Line up immediately', 'Remain seated until called', 'Check in at the counter', 'Go to a different gate'], correctIndex: 1 },
    ],
  },
];
