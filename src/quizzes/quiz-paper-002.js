export default {
  id: 'quiz-paper-002',
  title: 'Deep Think with Confidence 논문 리뷰',
  description: 'Review with Deep Think with Confidence에 대한 퀴즈입니다. 해당 포스팅을 참고하여 문제를 풀어보세요.',
  author: 'Hong',
  category: '논문 리뷰',
  points: 100,
  createdAt: '2025-11-27',
  questions: [
    {
      id: 801,
      text: '기존의 다수결 투표 방식을 사용할 때, 추론 횟수를 계속 늘려도 성능 향상폭이 줄어들거나 비용 대비 효율이 떨어지는 현상을 무엇이라고 하나요?',
      options: ['수확 체감', '과적합', '기울기 소실', '나비 효과'],
      answer: 0,
      shortExplanation: '정답은 수확 체감입니다.',
      detailedExplanation: '문제를 푸는 횟수를 10번에서 100번으로 늘린다고 해서 성능이 비례하여 10배로 증가하지 않는 비효율성을 수확 체감 현상이라고 합니다.',
    },
    {
      id: 802,
      text: 'DeepConf 방법론에서 추론 경로의 품질을 판단하기 위해 사용하는 핵심 지표는 무엇인가요?',
      options: ['전체 토큰의 평균 자신감', '가장 낮은 그룹 자신감', '첫 번째 토큰의 자신감', '마지막 토큰의 자신감'],
      answer: 1,
      shortExplanation: '가장 낮은 그룹 자신감을 지표로 사용합니다.',
      detailedExplanation: '전체 평균은 국소적인 실패를 가릴 수 있기 때문에, DeepConf는 추론 과정 중 가장 자신감이 낮았던 구간의 점수를 해당 경로의 품질 점수로 사용합니다.',
    },
    {
      id: 803,
      text: '포스팅에서 99개의 강철 사슬과 1개의 종이 사슬 예시를 통해 설명하고자 했던 개념은 무엇인가요?',
      options: ['전역적 성공', '국소적 실패', '평균의 오류', '데이터 편향'],
      answer: 1,
      shortExplanation: '종이 사슬 하나가 끊어지는 국소적 실패를 의미합니다.',
      detailedExplanation: '전체적으로 자신감이 높아 보여도(강철 사슬), 중간에 논리적으로 취약한 부분(종이 사슬)이 하나라도 있다면 전체 추론이 실패할 수 있음을 보여주는 예시입니다.',
    },
    {
      id: 804,
      text: 'DeepConf의 온라인 방식에서, 추론 생성 중에 특정 구간의 자신감이 임계값보다 떨어질 경우 취하는 조치는 무엇인가요?',
      options: ['처음부터 다시 생성', '즉시 생성 중단', '사람에게 검토 요청', '다른 모델로 교체'],
      answer: 1,
      shortExplanation: '토큰 낭비를 막기 위해 즉시 생성을 중단합니다.',
      detailedExplanation: '온라인 방식은 노래 심사에서 못하면 마이크를 끄는 것처럼, 품질이 낮다고 판단되는 즉시 생성을 멈추어(Early stopping) 불필요한 연산 비용을 절감합니다.',
    },
    {
      id: 805,
      text: 'DeepConf 방법론의 가장 큰 장점으로 언급된 것은 무엇인가요?',
      options: ['추가적인 모델 학습 불필요', '데이터셋 크기 증가', '하이퍼파라미터 튜닝 필수', '하드웨어 교체 필요'],
      answer: 0,
      shortExplanation: '추가적인 모델 학습이 필요 없습니다.',
      detailedExplanation: 'DeepConf는 기존 모델을 다시 훈련시킬 필요 없이, 추론 단계에서 즉시 적용할 수 있는 플러그 앤 플레이 방식을 지원합니다.',
    }
  ]
};