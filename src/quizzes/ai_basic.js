export default {
    id: 'quiz-001',
    title: '인공지능 기초 상식',
    description: 'AI, 머신러닝, 딥러닝의 기본 개념을 잘 이해하고 있는지 테스트해보세요.',
    author: '관리자',
    category: 'AI', 
    createdAt: '2024-05-25',
    questions: [
      {
        id: 101,
        text: '다음 중 인공지능 분야의 포함 관계가 올바른 것은?',
        options: ['딥러닝 > 머신러닝 > 인공지능', '인공지능 > 머신러닝 > 딥러닝', '머신러닝 > 인공지능 > 딥러닝', '모두 별개의 개념이다'],
        answer: 1,
        shortExplanation: '가장 큰 개념이 무엇인지 생각해보세요. (AI > ML > DL)',
        detailedExplanation: '인공지능(AI)이 가장 포괄적인 개념이며, 그 안에 데이터를 학습하는 머신러닝(ML)이 포함되고, 머신러닝 안에 인공신경망을 사용하는 딥러닝(DL)이 포함됩니다. 따라서 정답은 인공지능 > 머신러닝 > 딥러닝 입니다.',
        explanation: '인공지능이 가장 큰 범주이며, 그 안에 머신러닝, 그 안에 딥러닝이 포함됩니다.'
      }
    ]
};