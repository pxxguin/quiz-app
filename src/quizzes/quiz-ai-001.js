export default {
  id: 'quiz-ai-001',
  title: '기본적인 Bert의 이해',
  description: 'How BERT model operate in python?에 대한 퀴즈입니다. 해당 포스팅을 참고하여 문제를 풀어보세요.',
  author: 'Hong',
  category: '자연어 처리',
  points: 100,
  createdAt: '2025-11-18',
  questions: [
    {
      id: 101,
      text: 'Bert 모델은 어떤 종류의 신경망 아키텍처를 기반으로 하나요?',
      options: ['컨볼루션 신경망', '순환 신경망', '트랜스포머', '생성적 적대 신경망'],
      answer: 2,
      shortExplanation: 'Bert는 트랜스포머 아키텍처를 기반으로 합니다.',
      detailedExplanation: 'Bert는 트랜스포머 아키텍처를 사용하여 문맥을 이해하고 자연어 처리 작업을 수행합니다. 트랜스포머는 셀프 어텐션 메커니즘을 통해 입력 시퀀스의 모든 단어 간의 관계를 효과적으로 모델링할 수 있습니다.',
    },
    {
      id: 102,
      text: '우리가 아는 단어를 벡터로 표현하는 방법은 무엇인가요?',
      options: ['원-핫 인코딩', '워드 임베딩', 'TF-IDF', 'Bag of Words'],
      answer: 1,
      shortExplanation: '워드 임베딩은 단어를 벡터로 표현하는 방법입니다.',
      detailedExplanation: '워드 임베딩은 단어를 고차원 공간의 밀집된 벡터로 표현하는 방법입니다. 이를 통해 단어 간의 의미적 유사성을 캡처할 수 있으며, Bert와 같은 모델에서 효과적으로 사용됩니다.',
    },
    {
      id: 103,
      text: '서로 다른 문장에서, 같은 단어가 있을 때 그 단어의 의미를 이해하는 데 중요한 메커니즘은 무엇인가요?',
      options: ['컨볼루션', '셀프 어텐션', '풀링', '드롭아웃'],
      answer: 1,
      shortExplanation: '셀프 어텐션은 단어의 문맥적 의미를 이해하는 데 중요합니다.',
      detailedExplanation: '셀프 어텐션 메커니즘은 입력 시퀀스 내의 모든 단어가 서로를 참조할 수 있도록 하여, 단어의 문맥적 의미를 이해하는 데 중요한 역할을 합니다. 이를 통해 Bert는 문장 내에서 단어의 다양한 의미를 효과적으로 파악할 수 있습니다.',
    },
    {
      id: 104,
      text: 'Encoder 모델 구조를 사용하는 모델 중 아닌 것을 고르세요.',
      options: ['Bert', 'GPT', 'RoBERTa', 'DistilBERT'],
      answer: 1,
      shortExplanation: 'GPT는 Encoder 모델 구조를 사용하지 않습니다.',
      detailedExplanation: 'GPT는 주로 디코더 아키텍처를 기반으로 하며, 주로 텍스트 생성 작업에 사용됩니다. 반면에 Bert, RoBERTa, DistilBERT는 모두 Encoder 구조를 사용하여 문맥을 이해하는 데 중점을 둡니다.',
    }
  ]
};