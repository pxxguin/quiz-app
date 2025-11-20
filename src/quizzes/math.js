export default {
    id: 'quiz-math-001',
    title: '수학 및 과학 기초 (수식 테스트)',
    description: '이미지와 LaTeX 수식이 포함된 문제들을 테스트합니다.',
    author: 'ScienceLab',
    category: 'Math',
    createdAt: '2024-05-26',
    questions: [
      {
        id: 101,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Pythagorean.svg/440px-Pythagorean.svg.png',
        // LaTeX 수식은 $ 기호로 감싸줍니다.
        text: '다음 그림에서 밑변이 $a=3$, 높이가 $b=4$일 때, 빗변 $c$의 값은?',
        options: [
          '$c = 4$', 
          '$c = 5$', 
          '$c = 6$', 
          '$c = \\sqrt{20}$'
        ],
        answer: 1,
        shortExplanation: '피타고라스의 정리를 이용하세요.',
        detailedExplanation: '피타고라스의 정리 $a^2 + b^2 = c^2$ 에 대입하면, $3^2 + 4^2 = 9 + 16 = 25$ 입니다. 따라서 $c^2 = 25$ 이므로 $c=5$ 입니다.',
      }
    ]      
};