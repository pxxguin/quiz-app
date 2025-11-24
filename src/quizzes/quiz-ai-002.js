export default {
  id: 'quiz-ai-002',
  title: '어텐션 알고리즘의 이해',
  description: 'What is Attention Algorithms?에 대한 퀴즈입니다. 해당 포스팅을 참고하여 문제를 풀어보세요.',
  author: 'Hong',
  category: '자연어 처리',
  points: 100,
  createdAt: '2025-11-19',
  questions: [
    {
      id: 301,
      text: '기존의 Seq2Seq 모델이 가진 가장 큰 문제점으로, 입력 문장의 길이가 길어질수록 성능이 저하되는 원인은 무엇인가요?',
      options: ['경사 소실 문제', '고정된 크기의 문맥 벡터', '과적합 발생', '느린 학습 속도'],
      answer: 1,
      shortExplanation: '고정된 크기의 문맥 벡터가 병목 현상을 일으킵니다.',
      detailedExplanation: '기존 Seq2Seq 모델은 입력 문장의 모든 정보를 고정된 크기의 문맥 벡터(Context Vector)에 압축해야 했기 때문에, 문장이 길어지면 정보 손실이 발생하는 병목 현상이 문제였습니다.',
    },
    {
      id: 302,
      text: '어텐션 메커니즘의 핵심 아이디어는 디코더가 출력 단어를 예측할 때마다 인코더의 어떤 정보를 참고하는 것인가요?',
      options: ['마지막 은닉 상태만 참고', '입력 문장 전체의 은닉 상태', '랜덤하게 선택된 단어', '이전 시점의 출력값만 참고'],
      answer: 1,
      shortExplanation: '입력 문장 전체의 은닉 상태를 참고합니다.',
      detailedExplanation: '어텐션은 디코더가 시점마다 입력 문장의 모든 부분을 다시 한 번 참고하되, 해당 시점에서 예측해야 할 단어와 연관성이 높은 부분에 더 집중(Attention)하는 방식입니다.',
    },
    {
      id: 303,
      text: '어텐션 값(Attention Value)을 구하기 위해 사용되는 3가지 핵심 요소가 아닌 것은 무엇인가요?',
      options: ['Query', 'Key', 'Value', 'Bias'],
      answer: 3,
      shortExplanation: 'Bias는 어텐션 계산의 3대 요소가 아닙니다.',
      detailedExplanation: '어텐션 메커니즘은 Query(질문), Key(답변의 키), Value(실제 값)라는 세 가지 요소를 기반으로 연산이 수행됩니다.',
    },
    {
      id: 304,
      text: 'Query와 Key의 유사도를 구한 어텐션 스코어를 확률값(0~1 사이, 합은 1)으로 변환하기 위해 주로 사용하는 함수는 무엇인가요?',
      options: ['Sigmoid', 'ReLU', 'Softmax', 'Tanh'],
      answer: 2,
      shortExplanation: 'Softmax 함수를 사용합니다.',
      detailedExplanation: '어텐션 스코어에 Softmax 함수를 적용하여 각 입력 단어가 현재 예측에 얼마나 중요한지를 나타내는 어텐션 가중치(확률분포)를 구합니다.',
    },
    {
      id: 305,
      text: '어텐션 메커니즘의 최종 결과값인 컨텍스트 벡터는 어텐션 가중치와 무엇을 가중합(Weighted Sum)하여 구해지나요?',
      options: ['Query', 'Key', 'Value', 'Input'],
      answer: 2,
      shortExplanation: 'Value와 가중합을 합니다.',
      detailedExplanation: 'Softmax를 통해 구한 어텐션 가중치를 각 은닉 상태에 해당하는 Value 벡터에 곱하고, 이를 모두 더하여(Weighted Sum) 최종적인 컨텍스트 벡터를 생성합니다.',
    }
  ]
};