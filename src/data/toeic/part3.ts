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
];
