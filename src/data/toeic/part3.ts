import type { ToeicPart3Question } from '../../types';

export const toeicPart3Questions: ToeicPart3Question[] = [
  {
    id: 'toeic_p3_001',
    part: 3,
    tag: 'toeic-part3-office',
    conversation: [
      'W: Did you get a chance to review the budget proposal I sent yesterday?',
      'M: Yes, I looked it over this morning. I think the marketing costs are a bit too high.',
      'W: I agree. Let\'s meet at two o\'clock to revise the numbers together.',
    ],
    explanation: '会話全体が予算案（budget proposal）とその修正について話しているので、話題は予算案です。二時に会う予定であることにも注意しましょう。',
    questions: [
      { id: 'toeic_p3_001_q1', question: 'What are the speakers mainly discussing?', choices: ['A hiring plan', 'A budget proposal', 'A travel schedule', 'A new client'], correctIndex: 1 },
      { id: 'toeic_p3_001_q2', question: 'What does the man think about the marketing costs?', choices: ['They are too low.', 'They are too high.', 'They are exactly right.', 'He has no opinion.'], correctIndex: 1 },
      { id: 'toeic_p3_001_q3', question: 'What will the speakers do at two o\'clock?', choices: ['Have lunch', 'Meet a client', 'Revise the numbers', 'Leave the office'], correctIndex: 2 },
    ],
  },
  {
    id: 'toeic_p3_002',
    part: 3,
    tag: 'toeic-part3-restaurant',
    conversation: [
      'M: Hi, I\'d like to make a reservation for four people this Saturday evening.',
      'W: I\'m sorry, but we\'re fully booked after seven. Would six o\'clock work for you?',
      'M: That should be fine. Can we get a table near the window?',
    ],
    explanation: 'レストランの予約についての会話です。7時以降は満席で、6時なら空いていることが分かります。',
    questions: [
      { id: 'toeic_p3_002_q1', question: 'What is the man trying to do?', choices: ['Cancel a reservation', 'Make a reservation', 'Order food', 'Pay the bill'], correctIndex: 1 },
      { id: 'toeic_p3_002_q2', question: 'Why can\'t the man get a table after seven?', choices: ['The restaurant is closed.', 'The restaurant is fully booked.', 'The kitchen is closed.', 'The staff is on break.'], correctIndex: 1 },
      { id: 'toeic_p3_002_q3', question: 'What does the man request?', choices: ['A table near the window', 'A discount', 'A private room', 'A later time'], correctIndex: 0 },
    ],
  },
  {
    id: 'toeic_p3_003',
    part: 3,
    tag: 'toeic-part3-it',
    conversation: [
      'W: My computer keeps freezing whenever I open the sales database.',
      'M: That\'s strange. Let me check if the software needs an update.',
      'W: Thanks. I have a report due this afternoon, so I need it fixed soon.',
    ],
    explanation: 'コンピューターの不具合とIT担当者への対応依頼についての会話です。',
    questions: [
      { id: 'toeic_p3_003_q1', question: 'What problem does the woman have?', choices: ['Her password doesn\'t work.', 'Her computer freezes.', 'Her printer is broken.', 'Her email won\'t send.'], correctIndex: 1 },
      { id: 'toeic_p3_003_q2', question: 'What will the man probably do next?', choices: ['Buy a new computer', 'Check for a software update', 'Call a client', 'Write a report'], correctIndex: 1 },
      { id: 'toeic_p3_003_q3', question: 'Why is the woman in a hurry?', choices: ['She has a meeting soon.', 'She has a report due this afternoon.', 'She is leaving early today.', 'She has a phone call to make.'], correctIndex: 1 },
    ],
  },
  {
    id: 'toeic_p3_004',
    part: 3,
    tag: 'toeic-part3-travel',
    conversation: [
      'M: Excuse me, is this the line for check-in for flight 205?',
      'W: Yes, but this counter is only for business class passengers.',
      'M: Oh, I see. Where should I go for economy class?',
    ],
    explanation: '空港のチェックインカウンターについての会話です。男性はビジネスクラス用のカウンターに並んでいたことが分かります。',
    questions: [
      { id: 'toeic_p3_004_q1', question: 'Where does this conversation most likely take place?', choices: ['At a hotel', 'At an airport', 'At a train station', 'At a restaurant'], correctIndex: 1 },
      { id: 'toeic_p3_004_q2', question: 'What is the problem?', choices: ['The flight was canceled.', 'The man is in the wrong line.', 'The counter is closed.', 'The man lost his ticket.'], correctIndex: 1 },
      { id: 'toeic_p3_004_q3', question: 'What does the man ask about?', choices: ['The flight time', 'The economy class counter', 'The baggage fee', 'The gate number'], correctIndex: 1 },
    ],
  },
  {
    id: 'toeic_p3_005',
    part: 3,
    tag: 'toeic-part3-hr',
    conversation: [
      'W: I heard the company is offering a new training program for new employees.',
      'M: Yes, it starts next Monday. It covers communication skills and basic computer software.',
      'W: That sounds useful. How can I sign up?',
    ],
    explanation: '新入社員向け研修プログラムについての会話です。',
    questions: [
      { id: 'toeic_p3_005_q1', question: 'What is being discussed?', choices: ['A new product', 'A training program', 'A business trip', 'A company party'], correctIndex: 1 },
      { id: 'toeic_p3_005_q2', question: 'When does the program start?', choices: ['Today', 'Next Monday', 'Next month', 'Tomorrow'], correctIndex: 1 },
      { id: 'toeic_p3_005_q3', question: 'What does the woman want to know?', choices: ['The cost of the program', 'How to sign up', 'Who teaches the program', 'Where it is held'], correctIndex: 1 },
    ],
  },
  {
    id: 'toeic_p3_006',
    part: 3,
    tag: 'toeic-part3-retail',
    conversation: [
      "W: I'm looking for a birthday gift for my sister. Do you have any recommendations?",
      "M: We just got a new shipment of scarves. They're very popular right now.",
      'W: That sounds perfect. Could you show me a few colors?',
    ],
    explanation: '店員と客の会話です。誕生日プレゼント探しの客に、新しく入荷したスカーフを勧めています。',
    questions: [
      { id: 'toeic_p3_006_q1', question: 'What is the woman looking for?', choices: ['A birthday gift', 'A job', 'A refund', 'Directions'], correctIndex: 0 },
      { id: 'toeic_p3_006_q2', question: 'What does the man recommend?', choices: ['Shoes', 'Scarves', 'Books', 'Jewelry'], correctIndex: 1 },
      { id: 'toeic_p3_006_q3', question: 'What does the woman ask to see?', choices: ['A receipt', 'A few colors', 'A discount', 'A manager'], correctIndex: 1 },
    ],
  },
  {
    id: 'toeic_p3_007',
    part: 3,
    tag: 'toeic-part3-schedule',
    conversation: [
      'M: Are you free for a quick call this afternoon to go over the client proposal?',
      "W: I have a meeting until three, but I'm open after that.",
      "M: Great, let's talk at three thirty then.",
    ],
    explanation: 'クライアント提案について電話で話す時間を調整する会話です。',
    questions: [
      { id: 'toeic_p3_007_q1', question: 'What do they need to discuss?', choices: ['A client proposal', 'A vacation schedule', 'A job opening', 'A software update'], correctIndex: 0 },
      { id: 'toeic_p3_007_q2', question: "Why can't the woman talk now?", choices: ['She is out of the office', 'She has a meeting until three', 'She is on vacation', 'Her phone is broken'], correctIndex: 1 },
      { id: 'toeic_p3_007_q3', question: 'What time will they talk?', choices: ["Three o'clock", 'Three thirty', "Four o'clock", 'Tomorrow'], correctIndex: 1 },
    ],
  },
  {
    id: 'toeic_p3_008',
    part: 3,
    tag: 'toeic-part3-delivery',
    conversation: [
      'W: Has the shipment from the supplier arrived yet?',
      "M: Not yet. I just checked, and it's been delayed by two days.",
      "W: That's a problem. We need those parts for Friday's production run.",
    ],
    explanation: 'サプライヤーからの出荷遅延について話す会話です。',
    questions: [
      { id: 'toeic_p3_008_q1', question: 'What are they discussing?', choices: ['A delayed shipment', 'A canceled order', 'A new supplier', 'A price increase'], correctIndex: 0 },
      { id: 'toeic_p3_008_q2', question: 'How long has the shipment been delayed?', choices: ['One day', 'Two days', 'A week', "It hasn't been delayed"], correctIndex: 1 },
      { id: 'toeic_p3_008_q3', question: 'Why is the delay a problem?', choices: ["The parts are needed for Friday's production", 'The supplier went out of business', 'The price went up', 'The warehouse is full'], correctIndex: 0 },
    ],
  },
  {
    id: 'toeic_p3_009',
    part: 3,
    tag: 'toeic-part3-facilities',
    conversation: [
      "M: The air conditioning in the conference room isn't working again.",
      "W: I'll call the maintenance team right away. Can we use the small meeting room instead?",
      "M: Sure, that should work for today's meeting.",
    ],
    explanation: '会議室の空調の不具合と代替案についての会話です。',
    questions: [
      { id: 'toeic_p3_009_q1', question: 'What is the problem?', choices: ['The projector is broken', "The air conditioning isn't working", 'The room is too small', 'The lights are off'], correctIndex: 1 },
      { id: 'toeic_p3_009_q2', question: 'What will the woman do?', choices: ['Fix it herself', 'Call the maintenance team', 'Cancel the meeting', 'Order a new air conditioner'], correctIndex: 1 },
      { id: 'toeic_p3_009_q3', question: "Where will today's meeting be held?", choices: ['In the conference room', 'In the small meeting room', 'In the lobby', 'Outside'], correctIndex: 1 },
    ],
  },
  {
    id: 'toeic_p3_010',
    part: 3,
    tag: 'toeic-part3-marketing',
    conversation: [
      'W: What did the team decide about the new ad campaign?',
      "M: We're going with the online video option instead of print ads.",
      'W: That makes sense given our target audience. When does it launch?',
    ],
    explanation: '新しい広告キャンペーンの方針についての会話です。',
    questions: [
      { id: 'toeic_p3_010_q1', question: 'What did the team decide?', choices: ['To use print ads', 'To use an online video', 'To cancel the campaign', 'To hire a new agency'], correctIndex: 1 },
      { id: 'toeic_p3_010_q2', question: 'Why did they choose this option?', choices: ['It is cheaper', 'It suits their target audience', "It was the client's request", 'It was the only option'], correctIndex: 1 },
      { id: 'toeic_p3_010_q3', question: 'What does the woman ask about?', choices: ['The budget', 'The launch date', 'The video length', 'The team size'], correctIndex: 1 },
    ],
  },
  {
    id: 'toeic_p3_011',
    part: 3,
    tag: 'toeic-part3-hotel',
    conversation: [
      "M: I'd like to check out a day early if that's possible.",
      "W: Let me check your reservation... Yes, that's fine. There's no cancellation fee since you're a loyalty member.",
      'M: Great, thank you. Could I also get a receipt for my stay?',
    ],
    explanation: 'ホテルでの早期チェックアウトについての会話です。',
    questions: [
      { id: 'toeic_p3_011_q1', question: 'What does the man want to do?', choices: ['Extend his stay', 'Check out early', 'Change rooms', 'Order room service'], correctIndex: 1 },
      { id: 'toeic_p3_011_q2', question: 'Why is there no cancellation fee?', choices: ['The hotel is empty', 'He is a loyalty member', 'He booked directly', 'It is a holiday'], correctIndex: 1 },
      { id: 'toeic_p3_011_q3', question: 'What does the man request at the end?', choices: ['A discount', 'A receipt', 'A late checkout', 'A wake-up call'], correctIndex: 1 },
    ],
  },
  {
    id: 'toeic_p3_012',
    part: 3,
    tag: 'toeic-part3-recruitment',
    conversation: [
      'W: We received over two hundred applications for the marketing position.',
      "M: That's a lot. How are we going to narrow down the list?",
      'W: I suggest we focus on candidates with at least three years of experience first.',
    ],
    explanation: '採用選考についての会話です。',
    questions: [
      { id: 'toeic_p3_012_q1', question: 'What are they discussing?', choices: ['A product launch', 'Job applications', 'A budget report', 'A training schedule'], correctIndex: 1 },
      { id: 'toeic_p3_012_q2', question: 'How many applications did they receive?', choices: ['Twenty', 'Two hundred', 'Two thousand', 'Twelve'], correctIndex: 1 },
      { id: 'toeic_p3_012_q3', question: 'What does the woman suggest?', choices: ['Interviewing everyone', 'Focusing on experienced candidates', 'Canceling the search', 'Hiring randomly'], correctIndex: 1 },
    ],
  },
  {
    id: 'toeic_p3_013',
    part: 3,
    tag: 'toeic-part3-warehouse',
    conversation: [
      "M: We're running low on shipping boxes in the warehouse.",
      "W: I'll place an order with our usual supplier today.",
      'M: Thanks. Also, could you check if the forklift has been repaired yet?',
    ],
    explanation: '倉庫の在庫と設備についての会話です。',
    questions: [
      { id: 'toeic_p3_013_q1', question: 'What problem does the man mention first?', choices: ['Low inventory of boxes', 'A broken forklift', 'A staffing shortage', 'A late shipment'], correctIndex: 0 },
      { id: 'toeic_p3_013_q2', question: 'What will the woman do?', choices: ['Repair the forklift herself', 'Order more boxes', 'Hire more staff', 'Cancel the shipment'], correctIndex: 1 },
      { id: 'toeic_p3_013_q3', question: 'What does the man ask about at the end?', choices: ['A delivery date', 'The forklift repair', 'A new supplier', 'The budget'], correctIndex: 1 },
    ],
  },
];
