import type { ToeicPart6Question } from '../../types';

export const toeicPart6Questions: ToeicPart6Question[] = [
  {
    id: 'toeic_p6_001',
    part: 6,
    tag: 'toeic-part6-memo',
    passageTitle: 'Internal Memo',
    passage: [
      'To all staff: Starting next Monday, the office will ___(1)___ a new system for booking meeting rooms.',
      'Employees will need to log in to the company portal and select an available time slot. This change is being ___(2)___ to reduce scheduling conflicts.',
      'If you have any questions, please contact the IT department. We ___(3)___ your cooperation during this transition.',
      'Thank you for your ___(4)___ in this matter.',
    ],
    explanation: '社内通達で、新しい会議室予約システムの導入について案内しています。各空欄は文脈に合う語形・語彙を選びます。',
    blanks: [
      { choices: ['implement', 'implementing', 'implements', 'implemented'], correctIndex: 0 },
      { choices: ['introduce', 'introduced', 'introducing', 'introduction'], correctIndex: 1 },
      { choices: ['appreciate', 'appreciates', 'appreciating', 'appreciation'], correctIndex: 0 },
      { choices: ['cooperate', 'cooperative', 'cooperation', 'cooperatively'], correctIndex: 2 },
    ],
  },
  {
    id: 'toeic_p6_002',
    part: 6,
    tag: 'toeic-part6-email',
    passageTitle: 'Email to a Client',
    passage: [
      'Dear Ms. Rivera, Thank you for your recent order. Your items have been ___(1)___ and will arrive within five business days.',
      'Please note that our return policy ___(2)___ for thirty days after delivery.',
      'If you have any concerns ___(3)___ your order, feel free to contact our support team.',
      'We look forward to ___(4)___ with you again in the future.',
    ],
    explanation: '顧客への発送完了メールです。返品ポリシーの案内や、今後の取引への期待を伝えています。',
    blanks: [
      { choices: ['ship', 'shipped', 'shipping', 'ships'], correctIndex: 1 },
      { choices: ['apply', 'applies', 'applying', 'applied'], correctIndex: 1 },
      { choices: ['regarding', 'regard', 'regarded', 'regards'], correctIndex: 0 },
      { choices: ['work', 'working', 'worked', 'works'], correctIndex: 1 },
    ],
  },
  {
    id: 'toeic_p6_003',
    part: 6,
    tag: 'toeic-part6-notice',
    passageTitle: 'Public Notice',
    passage: [
      'Notice: The library will be closed for renovation ___(1)___ March 1 to March 15.',
      'During this period, all books must be returned via the outdoor drop box. Late fees ___(2)___ during the closure.',
      'We apologize for any ___(3)___ this may cause.',
      'The library will reopen with extended hours ___(4)___ better serve our community.',
    ],
    explanation: '図書館の改装のための臨時休館についての案内です。',
    blanks: [
      { choices: ['from', 'since', 'at', 'by'], correctIndex: 0 },
      { choices: ['will not apply', 'do not apply', 'did not apply', 'have not applied'], correctIndex: 0 },
      { choices: ['convenient', 'convenience', 'inconvenience', 'inconvenient'], correctIndex: 2 },
      { choices: ['to', 'for', 'in order that', 'so'], correctIndex: 0 },
    ],
  },
  {
    id: 'toeic_p6_004',
    part: 6,
    tag: 'toeic-part6-advertisement',
    passageTitle: 'Advertisement',
    passage: [
      'Looking for reliable office furniture? Our new collection ___(1)___ desks, chairs, and storage solutions for every budget.',
      'All items are ___(2)___ with a two-year warranty.',
      'Visit our showroom this month and receive a ___(3)___ discount of fifteen percent.',
      'Don\'t miss this ___(4)___ opportunity to upgrade your workspace.',
    ],
    explanation: 'オフィス家具の広告です。保証内容や期間限定割引について案内しています。',
    blanks: [
      { choices: ['include', 'includes', 'including', 'included'], correctIndex: 1 },
      { choices: ['back', 'backed', 'backing', 'backs'], correctIndex: 1 },
      { choices: ['limit', 'limits', 'limited', 'limiting'], correctIndex: 2 },
      { choices: ['special', 'specially', 'speciality', 'specialize'], correctIndex: 0 },
    ],
  },
  {
    id: 'toeic_p6_005',
    part: 6,
    tag: 'toeic-part6-report',
    passageTitle: 'Quarterly Update',
    passage: [
      'Dear Shareholders, We are pleased to report that revenue ___(1)___ by 12 percent compared to the previous quarter.',
      'This growth was ___(2)___ mainly to strong performance in our online division.',
      'Looking ahead, we ___(3)___ continued growth in the next two quarters as new products launch.',
      'Thank you for your ___(4)___ support of our company.',
    ],
    explanation: '株主向けの四半期業績報告です。オンライン部門の好調が成長を牽引していることが述べられています。',
    blanks: [
      { choices: ['increase', 'increases', 'increased', 'increasing'], correctIndex: 2 },
      { choices: ['attribute', 'attributed', 'attributing', 'attributes'], correctIndex: 1 },
      { choices: ['expect', 'expects', 'expected', 'expecting'], correctIndex: 0 },
      { choices: ['continue', 'continued', 'continuing', 'continuous'], correctIndex: 3 },
    ],
  },
];
