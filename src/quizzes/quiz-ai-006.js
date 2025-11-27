export default {
  id: 'quiz-ai-007',
  title: 'The Free Transformer 논문 리뷰',
  description: 'Review with The Free Transformer에 대한 퀴즈입니다. 해당 포스팅을 참고하여 문제를 풀어보세요.',
  author: 'Hong',
  category: '논문 리뷰',
  points: 100,
  createdAt: '2025-11-26',
  questions: [
    {
      id: 701,
      text: '포스팅에서 기존의 오토회귀(Autoregressive) 디코더 모델이 가진 한계점으로, 전체적인 그림을 보지 못하고 확률에만 의존하여 문장을 생성하는 방식을 무엇에 비유했나요?',
      options: ['스무고개', '끝말잇기', '숨바꼭질', '퍼즐 맞추기'],
      answer: 1,
      shortExplanation: '기존 모델은 끝말잇기와 비슷합니다.',
      detailedExplanation: '기존 디코더 모델은 앞의 단어 꼬리를 물며 확률적으로 다음 단어를 선택하기 때문에, 글 전체를 관통하는 계획 없이 마치 끝말잇기를 하듯 문장을 생성한다는 한계가 있습니다.',
    },
    {
      id: 702,
      text: 'The Free Transformer 모델에서 문장의 전체적인 분위기나 방향(예: 긍정, 부정)을 담기 위해 새롭게 도입한 핵심 변수는 무엇인가요?',
      options: ['잠재 변수', '편향 변수', '가중치 변수', '시간 변수'],
      answer: 0,
      shortExplanation: '정답은 잠재 변수(Z)입니다.',
      detailedExplanation: '이 모델은 조건부 변분 오토인코더(CVAE) 구조를 차용하여, 문장의 전체적인 맥락이나 계획을 담은 잠재 변수 Z를 디코더에 주입하여 생성을 유도합니다.',
    },
    {
      id: 703,
      text: '논문에서 제안한 모델 효율화 기법 중 하나로, 인코더와 디코더가 별도로 존재하지 않고 디코더의 일부를 인코더가 같이 사용하는 방식을 무엇이라고 하나요?',
      options: ['공유 블록', '잔차 연결', '드롭아웃', '레이어 정규화'],
      answer: 0,
      shortExplanation: '인코더와 디코더가 블록을 공유하는 공유 블록 방식입니다.',
      detailedExplanation: '인코더와 디코더 모두 글을 이해하는 초기 과정은 유사하므로, 디코더 블록의 절반을 인코더와 공유(Shared Blocks)하여 모델 크기 증가를 최소화했습니다.',
    },
    {
      id: 704,
      text: '잠재 변수 Z를 디코더에 주입할 때, 문장의 기초적인 분석과 생성된 의미 사이의 균형을 맞추기 위해 가장 적절하다고 언급된 위치는 어디인가요?',
      options: ['입력층(맨 처음)', '출력층(맨 마지막)', '중간층', '모든 층'],
      answer: 2,
      shortExplanation: '디코더의 중간층에 주입합니다.',
      detailedExplanation: '너무 처음엔 Z를 이해할 기초가 부족하고, 마지막엔 이미 문장이 다 생성된 뒤라 의미가 없으므로, 디코더 레이어의 중간 지점(L/2)에 주입하는 것이 가장 효과적입니다.',
    },
    {
      id: 705,
      text: 'The Free Transformer의 추론(Inference) 단계에서 잠재 변수 Z는 어떤 분포에서 샘플링하여 가져오나요?',
      options: ['사후 분포', '사전 분포', '정규 분포', '균등 분포'],
      answer: 1,
      shortExplanation: '추론 시에는 사전 분포에서 샘플링합니다.',
      detailedExplanation: '학습 시에는 완성된 문장을 보고 사후 분포에서 Z를 뽑지만, 추론 시에는 완성된 문장이 없으므로 미리 학습된 사전 분포에서 임의의 Z를 샘플링하여 사용합니다.',
    }
  ]
};