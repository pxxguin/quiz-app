export default {
  id: 'quiz-ai-003',
  title: 'ANN의 기초와 구현',
  description: 'How can deploy ANN in python?에 대한 퀴즈입니다. 해당 포스팅을 참고하여 문제를 풀어보세요.',
  author: 'Hong',
  category: '딥러닝',
  points: 100,
  createdAt: '2025-11-20',
  questions: [
    {
      id: 401,
      text: '포스팅 서론에서 언급된 내용으로, 침입 탐지 시스템(IDS)과 같이 실시간성이 중요한 환경에서 복잡한 최신 딥러닝 모델 대신 전통적 머신러닝 모델을 사용하는 주된 이유는 무엇인가요?',
      options: ['높은 정확도', '빠른 연산 속도', '구현의 복잡성', '데이터 수집의 용이성'],
      answer: 1,
      shortExplanation: '실시간 처리를 위해서는 빠른 연산 속도가 중요합니다.',
      detailedExplanation: '최신 SOTA 모델들은 성능은 좋지만 모델의 복잡도와 연산량이 매우 큽니다. 반면 로지스틱 회귀와 같은 전통적 모델은 연산이 가벼워 실시간성이 요구되는 환경에 적합합니다.',
    },
    {
      id: 402,
      text: '인공신경망 모델을 흔히 내부 작동 방식을 명확히 알기 어렵다는 의미에서 무엇이라고 부르나요?',
      options: ['화이트박스 모델', '블랙박스 모델', '그레이박스 모델', '오픈박스 모델'],
      answer: 1,
      shortExplanation: '정답은 블랙박스 모델입니다.',
      detailedExplanation: '입력층과 출력층 사이의 은닉층에서 데이터가 어떻게 처리되어 결과가 나오는지 명확하게 설명하기 어렵기 때문에 인공신경망을 블랙박스 모델이라고 부릅니다.',
    },
    {
      id: 403,
      text: '완전연결 신경망(FC Layer)에 2차원 또는 3차원 형태의 이미지 데이터를 입력하기 위해 반드시 거쳐야 하는 전처리 과정은 무엇인가요?',
      options: ['정규화', '평탄화', '이진화', '증강'],
      answer: 1,
      shortExplanation: '데이터를 1차원으로 펼치는 평탄화 과정이 필요합니다.',
      detailedExplanation: '완전연결 신경망은 입력 데이터가 1차원 벡터 형태여야 합니다. 따라서 2차원 이상의 이미지 데이터는 flatten 함수 등을 사용하여 1차원으로 쭉 펼쳐주는 평탄화 작업이 필수적입니다.',
    },
    {
      id: 404,
      text: 'PyTorch를 이용한 학습 과정에서, 역전파를 수행하기 전에 이전 단계에서 계산된 기울기(gradient)를 초기화하기 위해 사용하는 함수는 무엇인가요?',
      options: ['optimizer.step()', 'loss.backward()', 'optimizer.zero_grad()', 'model.train()'],
      answer: 2,
      shortExplanation: 'optimizer.zero_grad()를 사용합니다.',
      detailedExplanation: 'PyTorch에서는 기울기가 누적되는 특성이 있으므로, 매 반복(epoch/batch)마다 새로운 기울기를 계산하기 위해 zero_grad()를 호출하여 기존 기울기를 0으로 초기화해야 합니다.',
    },
    {
      id: 405,
      text: '포스팅 결론에서 언급된 ANN 모델이 이미지 처리(MNIST)에서 더 높은 성능을 내지 못하는 근본적인 한계점은 무엇인가요?',
      options: ['데이터의 양 부족', '위치 정보의 소실', '학습 횟수 부족', '모델의 크기 문제'],
      answer: 1,
      shortExplanation: '평탄화 과정에서 위치 정보가 소실되기 때문입니다.',
      detailedExplanation: '이미지를 1차원으로 평탄화하여 ANN에 입력하면, 픽셀 간의 인접성이나 공간적 배치와 같은 중요한 위치 정보가 사라지게 되어 성능에 한계가 발생합니다. 이를 해결하기 위해 CNN이 등장했습니다.',
    }
  ]
};