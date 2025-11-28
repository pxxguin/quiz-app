export default {
  id: 'quiz-paper-003',
  title: 'Understanding Tool-Integrated Reasoning 논문 리뷰',
  description: 'Review with Understanding Tool-Integrated Reasoning에 대한 퀴즈입니다. 해당 포스팅을 참고하여 문제를 풀어보세요.',
  author: 'Hong',
  category: '논문 리뷰',
  points: 100,
  createdAt: '2025-11-28',
  questions: [
    {
      id: 901,
      text: '논문에서 순수 텍스트 모델이 학습된 패턴 안에서만 답변을 생성할 수 있고, 근본적으로 새로운 해결 경로를 창조하지 못하는 한계를 무엇에 비유했나요?',
      options: ['유리 천장', '보이지 않는 끈', '알고리즘의 벽', '데이터의 족쇄'],
      answer: 1,
      shortExplanation: '정답은 보이지 않는 끈입니다.',
      detailedExplanation: '논문에서는 순수 텍스트 모델이 자신이 원래 알고 있던 지식이나 문장 패턴(Support) 안에 갇혀 있다는 한계를 강아지의 목줄에 비유하여 "보이지 않는 끈"이라고 표현했습니다.',
    },
    {
      id: 902,
      text: '순수 텍스트 모델은 확률이 0에 가까워 맞추기 힘든 문제(예: 해시 역산)를, TIR 모델은 파이썬 인터프리터와 같은 무엇을 사용하여 확실한 결과로 얻을 수 있나요?',
      options: ['결정론적 도구', '확률적 도구', '생성형 도구', '추상적 도구'],
      answer: 0,
      shortExplanation: '결정론적 도구를 사용합니다.',
      detailedExplanation: '파이썬 인터프리터처럼 같은 입력에 항상 같은 결과를 내놓는 결정론적 도구를 사용하면, 텍스트 모델로는 불가능에 가까운 연산도 확실하게 수행할 수 있습니다.',
    },
    {
      id: 903,
      text: '기존의 상대 평가 기반 강화 학습(GRPO)에서 정답을 맞췄음에도 코드를 늦게 썼다는 이유로 점수가 깎여 학습이 불안정해지는 문제를 해결하기 위해 제안된 알고리즘은 무엇인가요?',
      options: ['PPO', 'DPO', 'ASPO', 'TRPO'],
      answer: 2,
      shortExplanation: '정답은 ASPO입니다.',
      detailedExplanation: 'ASPO(Advantage Shaping Policy Optimization)는 보상 함수 자체가 아닌 이점(Advantage) 함수를 수정하여, 정답을 맞힌 경우에 한해 안정적으로 코드 조기 실행을 유도합니다.',
    },
    {
      id: 904,
      text: 'ASPO 알고리즘에서 모델이 정답 여부보다 코드를 빨리 실행하는 것에만 집착하는 보상 해킹(Reward Hacking)을 막기 위해 가산점에 적용한 안전장치는 무엇인가요?',
      options: ['드롭아웃', '클리핑', '정규화', '조기 종료'],
      answer: 1,
      shortExplanation: '가산점을 제한하는 클리핑을 적용했습니다.',
      detailedExplanation: '코드를 빨리 쓴 것에 대한 가산점이 정답 점수의 일정 비율을 넘지 못하도록 클리핑(Clipping)하여, 주객이 전도되는 현상을 방지하고 학습 안정성을 확보했습니다.',
    },
    {
      id: 905,
      text: 'TIR 모델이 단순히 계산기 역할만 하는 것이 아니라, 도구를 통해 가설을 세우고 검증하며 고차원적인 사고를 하는 인지 패턴을 무엇이라고 설명했나요?',
      options: ['단순 암기', '기계적 반복', '코드를 통한 탐색', '무작위 대입'],
      answer: 2,
      shortExplanation: '코드를 통한 탐색과 같은 패턴을 보입니다.',
      detailedExplanation: 'TIR 모델은 복잡한 문제에서 코드를 실행해보고 그 결과를 바탕으로 다시 추론을 이어가는 "코드를 통한 탐색"이나 "통찰을 계산으로 변환"하는 고차원적인 능력을 보여줍니다.',
    }
  ]
};