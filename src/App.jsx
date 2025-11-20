import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BookOpen, Brain, CheckCircle, XCircle, ChevronRight, 
  RefreshCw, Award, Lightbulb, Home, Search, Filter, 
  Sparkles, Grid, Layers, Check, X, MessageCircle, ChevronDown
} from 'lucide-react';

// ----------------------------------------------------------------------
// 🚀 [설정 가이드] 로컬 개발 vs 미리보기
// ----------------------------------------------------------------------
// [1] 로컬(VS Code): 아래 주석을 해제하여 파일 로딩 활성화
const quizModules = import.meta.glob('./quizzes/*.js', { eager: true });
const LOADED_QUIZZES = Object.values(quizModules).map(module => module.default);

// ⚠️ 로컬에서 파일을 불러올 때는 여기를 LOADED_QUIZZES 로 변경하세요.
const INITIAL_QUIZZES = LOADED_QUIZZES;

// ----------------------------------------------------------------------
// ✨ [Helper] 텍스트 내의 LaTeX 수식 렌더링 컴포넌트
// ----------------------------------------------------------------------
const KatexRenderer = ({ formula }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (window.katex && containerRef.current) {
      try {
        window.katex.render(formula, containerRef.current, {
          throwOnError: false,
          displayMode: false 
        });
      } catch (e) {
        console.error("KaTeX render error:", e);
        containerRef.current.innerText = formula;
      }
    }
  }, [formula]);

  if (!window.katex && typeof window !== 'undefined') {
    return <span>${formula}$</span>;
  }
  return <span ref={containerRef} />;
};

const RenderContent = ({ content }) => {
  if (!content) return null;
  if (typeof content !== 'string') return <span>{content}</span>;
  
  const parts = content.split('$');
  
  return (
    <span>
      {parts.map((part, index) => {
        if (index % 2 === 0) {
          return <span key={index}>{part}</span>;
        }
        return <KatexRenderer key={index} formula={part} />;
      })}
    </span>
  );
};


export default function QuizPlatform() {
  const [view, setView] = useState('home'); 
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizzes] = useState(INITIAL_QUIZZES);

  const goHome = () => {
    setView('home');
    setSelectedQuiz(null);
    window.scrollTo(0, 0);
  };

  const startSolve = (quiz) => {
    setSelectedQuiz(quiz);
    setView('solve');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div onClick={goHome} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Brain className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-900">QuizMaster</span>
          </div>
          <div className="flex items-center gap-4">
            {view !== 'home' && (
              <button onClick={goHome} className="flex items-center gap-1 text-gray-500 hover:text-blue-600 font-medium transition-colors">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">홈으로</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {view === 'home' && <HomeView quizzes={quizzes} onSelect={startSolve} />}
        {view === 'solve' && selectedQuiz && <SolverView quiz={selectedQuiz} onBack={goHome} />}
      </main>
    </div>
  );
}

// ----------------------------------------------------------------------
// VIEW 1: Home
// ----------------------------------------------------------------------
function HomeView({ quizzes, onSelect }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(() => {
    const cats = quizzes.map(q => q.category || '기타');
    return ['All', ...new Set(cats)];
  }, [quizzes]);

  const recentQuizzes = useMemo(() => {
    return [...quizzes].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 2);
  }, [quizzes]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(q => {
      const matchCategory = selectedCategory === 'All' || (q.category || '기타') === selectedCategory;
      const lowerTerm = searchTerm.toLowerCase();
      const matchSearch = q.title.toLowerCase().includes(lowerTerm) ||
                          q.description.toLowerCase().includes(lowerTerm) ||
                          (q.category || '').toLowerCase().includes(lowerTerm);
      return matchCategory && matchSearch;
    });
  }, [quizzes, selectedCategory, searchTerm]);

  return (
    <div className="animate-fade-in space-y-10">
      {!searchTerm && selectedCategory === 'All' && recentQuizzes.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900">따끈따끈한 최신 문제 🔥</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {recentQuizzes.map((quiz, idx) => (
              <div key={`recent-${quiz.id || idx}`} onClick={() => onSelect(quiz)} className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all relative overflow-hidden">
                <div className="relative z-10">
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-lg mb-3 text-blue-50">{quiz.category || 'New'}</span>
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">{quiz.title}</h3>
                  <p className="text-blue-100 text-sm line-clamp-2 mb-4">{quiz.description}</p>
                  <div className="flex items-center text-xs text-blue-200 font-medium">
                    <span>{quiz.createdAt} 등록</span>
                    <span className="mx-2">•</span>
                    <span>{quiz.author}</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">카테고리 및 퀴즈 검색</h2>
        </div>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="제목, 카테고리, 내용을 검색해보세요..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-gray-900 text-white shadow-md transform scale-105' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              {cat === 'All' ? '전체 보기' : cat}
            </button>
          ))}
        </div>
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3"><Grid className="w-6 h-6 text-gray-400" /></div>
            <p className="text-gray-500 font-medium">{searchTerm ? '검색 결과가 없습니다.' : '등록된 퀴즈가 없습니다.'}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredQuizzes.map((quiz, idx) => (
              <div key={quiz.id || idx} onClick={() => onSelect(quiz)} className="group bg-white p-5 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{quiz.category || '기타'}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{quiz.createdAt}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{quiz.title}</h3>
                  <p className="text-sm text-gray-500 truncate">{quiz.description}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0"><ChevronRight className="w-5 h-5" /></div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ----------------------------------------------------------------------
// VIEW 2: Solver (랜덤 셔플 기능 추가됨)
// ----------------------------------------------------------------------
function SolverView({ quiz, onBack }) {
  // 1. 문제 섞기 함수 (Fisher-Yates Shuffle)
  const shuffleQuestions = (questions) => {
    if (!questions || questions.length === 0) return [];
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 2. 상태 초기화: 렌더링 시 문제를 섞어서 저장
  const [shuffledQuestions, setShuffledQuestions] = useState(() => shuffleQuestions(quiz.questions));
  
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const [userAnswers, setUserAnswers] = useState([]); 
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  // 3. 섞인 문제 리스트 사용
  const question = shuffledQuestions[currentQIdx];
  const progress = ((currentQIdx + 1) / shuffledQuestions.length) * 100;
  const currentExplanation = question.shortExplanation || question.explanation;

  const handleSelect = (idx) => {
    if (isChecked) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsChecked(true);
    const newAnswers = [...userAnswers];
    newAnswers[currentQIdx] = selectedOption;
    setUserAnswers(newAnswers);
    if (selectedOption === question.answer) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentQIdx + 1 < shuffledQuestions.length) {
      setCurrentQIdx(c => c + 1);
      setSelectedOption(null);
      setIsChecked(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetry = () => {
    // 4. 다시 풀기 시 문제 재섞기
    setShuffledQuestions(shuffleQuestions(quiz.questions));
    setCurrentQIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsChecked(false);
    setIsFinished(false);
    setUserAnswers([]); 
    setShowAllQuestions(false);
    window.scrollTo(0, 0);
  };

  // --- 결과 화면 ---
  if (isFinished) {
    const percentage = Math.round((score / shuffledQuestions.length) * 100);
    const visibleQuestions = showAllQuestions ? shuffledQuestions : [shuffledQuestions[0]];

    return (
      <div className="max-w-2xl mx-auto animate-fade-in pb-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-10 text-center relative">
          <div className="bg-blue-600 h-32 relative">
            <div className="absolute inset-0 bg-blue-600 opacity-50 pattern-grid-lg"></div>
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="w-24 h-24 bg-yellow-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center"><Award className="w-12 h-12 text-white" /></div>
            </div>
          </div>
          <div className="pt-16 pb-8 px-6">
            <h2 className="text-3xl font-black text-gray-900 mb-2">결과 확인</h2>
            <p className="text-gray-500 mb-6 text-sm font-medium">{quiz.title}</p>
            <div className="flex justify-center items-baseline gap-2 mb-6">
              <span className="text-5xl font-black text-blue-600 tracking-tighter">{score}</span>
              <span className="text-xl text-gray-400 font-bold">/ {shuffledQuestions.length}</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${percentage === 100 ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
              {percentage === 100 ? <Sparkles className="w-4 h-4"/> : <CheckCircle className="w-4 h-4"/>}
              {percentage === 100 ? '완벽합니다! 🎉' : '수고하셨습니다! 👍'}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 px-2">
            <BookOpen className="w-5 h-5 text-blue-600" /> 문제 다시보기 & 상세 해설
          </h3>
          
          <div className="space-y-8">
            {visibleQuestions.map((q, idx) => {
              const myAnswer = userAnswers[idx];
              const isCorrect = myAnswer === q.answer;
              const reviewExplanation = q.detailedExplanation || q.explanation || '해설이 없습니다.';
              
              return (
                <div key={q.id} className={`bg-white rounded-2xl border-2 p-6 ${isCorrect ? 'border-gray-100' : 'border-red-100'}`}>
                  <div className="mb-4">
                    <div className="flex gap-3 mb-2">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isCorrect ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>Q{idx + 1}</span>
                      <h4 className="text-lg font-bold text-gray-800 leading-snug pt-0.5">
                        <RenderContent content={q.text} />
                      </h4>
                    </div>
                    {q.image && <img src={q.image} alt="참고 이미지" className="block mt-4 max-w-full h-auto max-h-60 rounded-lg object-contain border border-gray-100 mx-auto" />}
                  </div>

                  <div className="space-y-2 mb-5">
                    {q.options.map((opt, optIdx) => {
                      let style = "p-3 rounded-xl border text-sm font-medium flex justify-between items-center ";
                      if (optIdx === q.answer) style += "bg-green-50 border-green-200 text-green-800";
                      else if (optIdx === myAnswer && !isCorrect) style += "bg-red-50 border-red-200 text-red-800";
                      else style += "bg-white border-gray-100 text-gray-400";

                      return (
                        <div key={optIdx} className={style}>
                          <RenderContent content={opt} />
                          {optIdx === q.answer && <Check className="w-4 h-4 text-green-600"/>}
                          {optIdx === myAnswer && !isCorrect && <X className="w-4 h-4 text-red-600"/>}
                        </div>
                      );
                    })}
                  </div>
                  <details className="group bg-gray-50 rounded-xl overflow-hidden transition-all duration-300 border border-gray-100">
                    <summary className="flex items-center justify-between p-4 cursor-pointer list-none select-none hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-700"><Lightbulb className="w-5 h-5 text-yellow-500" /><span>해설 확인하기</span></div>
                      <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-300 group-open:rotate-180" />
                    </summary>
                    <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-200 pt-4 bg-white">
                      <span className="font-bold text-gray-900 block mb-2">상세 해설</span>
                      <RenderContent content={reviewExplanation} />
                    </div>
                  </details>
                </div>
              );
            })}
          </div>

          {!showAllQuestions && shuffledQuestions.length > 1 && (
            <button onClick={() => setShowAllQuestions(true)} className="w-full mt-6 py-4 bg-white border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-bold hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
              나머지 {shuffledQuestions.length - 1}문제 전체 보기 <ChevronDown className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sticky bottom-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-200">
          <button onClick={handleRetry} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 flex justify-center items-center gap-2 shadow-md transition-all"><RefreshCw className="w-5 h-5" /> 다시 풀기</button>
          <button onClick={onBack} className="flex-1 bg-white text-gray-700 border border-gray-300 py-3 rounded-xl font-bold hover:bg-gray-50 flex justify-center items-center gap-2 transition-all">다른 퀴즈 풀러가기</button>
        </div>
      </div>
    );
  }

  // --- 문제 풀이 화면 ---
  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors flex items-center gap-1">&larr; 나가기</button>
        <div className="flex items-center gap-3">
          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{width: `${progress}%`}}></div>
          </div>
          <span className="text-sm font-bold text-blue-600">{currentQIdx + 1} / {shuffledQuestions.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
        {/* 1. 질문 텍스트 */}
        <h2 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
          <span className="mr-2 text-blue-600">Q.</span>
          <RenderContent content={question.text} />
        </h2>

        {/* 2. 이미지 */}
        {question.image && (
          <div className="mb-8 flex justify-center">
            <img 
              src={question.image} 
              alt="문제 이미지" 
              className="max-w-full max-h-80 rounded-lg shadow-sm border border-gray-100 object-contain"
            />
          </div>
        )}

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let statusClass = "border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-700";
            if (selectedOption === idx) statusClass = "border-blue-600 bg-blue-50 text-blue-800";
            if (isChecked) {
              if (idx === question.answer) statusClass = "border-green-500 bg-green-50 text-green-800";
              else if (idx === selectedOption) statusClass = "border-red-500 bg-red-50 text-red-800";
              else statusClass = "border-gray-100 text-gray-300 opacity-50";
            }

            return (
              <button key={idx} onClick={() => handleSelect(idx)} disabled={isChecked} className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center ${statusClass}`}>
                <RenderContent content={option} />
                {isChecked && idx === question.answer && <CheckCircle className="w-5 h-5 text-green-600" />}
                {isChecked && idx === selectedOption && idx !== question.answer && <XCircle className="w-5 h-5 text-red-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {!isChecked ? (
        <button onClick={handleSubmit} disabled={selectedOption === null} className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${selectedOption === null ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200'}`}>정답 확인</button>
      ) : (
        <div className="animate-fade-in-up">
          {currentExplanation && (
            <div className={`p-5 rounded-xl mb-6 flex gap-3 ${selectedOption === question.answer ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
              <MessageCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${selectedOption === question.answer ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <p className={`font-bold mb-1 ${selectedOption === question.answer ? 'text-green-800' : 'text-red-800'}`}>{selectedOption === question.answer ? '정답입니다!' : '오답입니다.'}</p>
                <p className="text-gray-700 text-sm leading-relaxed"><RenderContent content={currentExplanation} /></p>
              </div>
            </div>
          )}
          <button onClick={handleNext} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 shadow-lg flex justify-center items-center gap-2">{currentQIdx + 1 < shuffledQuestions.length ? '다음 문제' : '결과 보기'} <ChevronRight className="w-5 h-5" /></button>
        </div>
      )}
    </div>
  );
}