export default {
  id: 'quiz-math-001',
  title: '미분 정복하기',
  description: '테스트 문제이긴 합니다.',
  author: 'Hong',
  category: 'Math',
  points: 100,
  createdAt: '2025-11-19',
  questions: [
    {
      id: 101,
      // image: 'https://i.imgur.com/c5wW32w.png', 
      text: '$f(x) = x^2 + 3x + 2$ 의 도함수 $f\'(x)$ 는 무엇인가요?',
      options: ['$2x + 3$', '$2x + 6$', '$x^2 + 3$', '$2x^2 + 3x$'],
      answer: 0,
      shortExplanation: '도함수는 함수의 기울기를 나타냅니다.',
      detailedExplanation: '$f(x) = x^2 + 3x + 2$ 의 도함수는 $f\'(x) = 2x + 3$ 입니다.',
    }
  ]
};