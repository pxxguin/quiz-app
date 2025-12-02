export default {
  id: 'quiz-paper-004',
  title: 'StepWiser: Stepwise Generative Judges for Wiser Reasoning 논문 리뷰',
  description: 'StepWiser: Stepwise Generative Judges for Wiser Reasoning에 대한 퀴즈입니다. 해당 포스팅을 참고하여 문제를 풀어보세요.',
  author: 'Hong',
  category: '논문 리뷰',
  points: 100,
  createdAt: '2025-12-02',
  questions: [
    {
      id: 1,
      image: "",
      text: '기존의 프로세스 보상 모델(PRM)이 가지고 있는 주요 단점 두 가지는 무엇인가요?',
      options: [
        '높은 훈련 비용과 느린 추론 속도',
        '분류기로 작동하여 설명이 부재하며, 정적 데이터셋 의존으로 인한 일반화 한계',
        '복잡한 아키텍처와 과적합(Overfitting) 문제',
        '짧은 문맥 길이와 낮은 정밀도'
      ],
      answer: 1,
      shortExplanation: '기존 PRM은 설명을 제공하지 않는 분류기이며, 정적 데이터셋에 의존합니다.',
      detailedExplanation: '논문에서는 기존 PRM이 "블랙박스" 분류기로 작동하여 단계별 점수만 제공할 뿐 이유를 설명하지 못한다는 점과, 정적인 데이터셋을 사용한 지도 미세 조정(SFT)에 의존하여 새로운 추론 패턴에 대한 일반화 능력이 제한된다는 점을 주요 단점으로 지적합니다.',
    },
    {
      id: 2,
      image: "",
      text: 'StepWiser가 제안하는 단계별 보상 모델링의 핵심 접근 방식은 무엇인가요?',
      options: [
        '판별 작업을 추론 작업으로 재구성하여, 최종 판결 전에 사고 과정(Thinking tokens)을 생성한다.',
        '모든 중간 단계에 대해 사람이 직접 레이블링을 수행하여 데이터의 정확도를 높인다.',
        '최종 결과만을 보상으로 사용하여 강화 학습 효율을 극대화한다.',
        '기존의 분류 기반 PRM에 더 많은 파라미터를 추가하여 성능을 높인다.'
      ],
      answer: 0,
      shortExplanation: 'StepWiser는 보상 모델링을 분류가 아닌 또 하나의 추론 작업(Meta-reasoning)으로 정의합니다.',
      detailedExplanation: 'StepWiser는 판사(Judge) 모델이 단순히 점수를 매기는 것이 아니라, 정책 모델의 추론 단계를 검토하고 논리적인 사고 과정(CoT)을 거친 후에 최종 판결을 내리도록 설계된 생성형 판별 모델입니다.',
    },
    {
      id: 3,
      image: "",
      text: '논문에서 추론 과정을 논리적으로 일관된 단위로 나누기 위해 사용한 기법은 무엇인가요?',
      options: [
        '고정 길이 토큰 분할(Fixed-length splitting)',
        '줄바꿈 문자(\\n\\n) 기준의 단순 분할',
        'LLM 기반의 자체 분할(Self-segmentation)',
        '랜덤 포레스트 기반의 청크 분할'
      ],
      answer: 2,
      shortExplanation: '모델이 스스로 추론 과정을 유의미한 덩어리(Chunks-of-Thought)로 나누도록 훈련시킵니다.',
      detailedExplanation: '기존의 단순 줄바꿈이나 "Step k" 같은 규칙은 정보가 불완전한 경우가 많습니다. StepWiser는 LLM에게 명확한 분할 규칙을 학습시켜 스스로 논리적으로 완결된 "Chunks-of-Thought"를 생성하고 분할하도록 하는 자체 분할(Self-segmentation) 기법을 제안합니다.',
    },
    {
      id: 4,
      image: "",
      text: 'StepWiser 판사 모델을 훈련시킬 때 가장 효과적인 것으로 나타난 레이블링 신호 방식은 무엇인가요?',
      options: [
        '절대적 Q-값 임계값 (Absolute Q-value thresholding)',
        '상대적 진척도 (Relative signals: Rel-Effective, Rel-Ratio)',
        '사람의 수동 평가 점수',
        '무작위 탐색 보상'
      ],
      answer: 1,
      shortExplanation: '단계를 전후로 성공 확률의 변화(진척도)를 반영하는 상대적 신호가 더 효과적입니다.',
      detailedExplanation: '실험 결과, 단순히 해당 단계의 절대적인 Q-값만 보는 것(Abs-Q)보다, 이전 단계 대비 성공 확률이 어떻게 변했는지를 반영하는 상대적 신호(Rel-Ratio, Rel-Effective)를 사용하여 훈련했을 때 판별 정확도와 모델 성능이 더 높게 나타났습니다.',
    },
    {
      id: 5,
      image: "",
      text: '논문에서 StepWiser 판사 모델을 활용하여 성능을 향상시킨 사례가 아닌 것은 무엇인가요?',
      options: [
        '추론 시 탐색(Inference-time search)을 통한 Chunk-Reset',
        '고품질 훈련 데이터 선별(Data Selection)',
        '강화 학습(RL) 훈련 시의 보상 신호 제공',
        '이미지 생성 모델의 프롬프트 최적화'
      ],
      answer: 3,
      shortExplanation: '이 논문은 수학적 추론 문제 해결에 초점을 맞추고 있습니다.',
      detailedExplanation: 'StepWiser는 추론 과정에서 잘못된 단계를 감지하여 다시 생성하게 하는 추론 시 탐색(Chunk-Reset Reasoning), 미세 조정을 위한 고품질 데이터 선별, 그리고 RL 훈련의 보상 모델로 활용되어 수학적 추론 성능을 향상시켰습니다. 이미지 생성과는 관련이 없습니다.',
    },
  ]
};