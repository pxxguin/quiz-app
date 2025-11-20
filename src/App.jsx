import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Brain, CheckCircle, XCircle, ChevronRight, 
  RefreshCw, Award, Lightbulb, Home, Search, Filter, 
  Sparkles, Grid, Layers
} from 'lucide-react';

// ----------------------------------------------------------------------
// 🚀 [설정 가이드] 로컬 개발 vs 미리보기
// ----------------------------------------------------------------------
//
// [1] 로컬(VS Code)에서 실행할 때:
//     아래 'import.meta.glob' 관련 코드(옵션 A)의 주석을 해제하고, 
//     INITIAL_QUIZZES 변수에 LOADED_QUIZZES를 할당하세요.
//
// [2] 현재 미리보기 화면:
//     오류 방지를 위해 아래의 고정 데이터(STATIC_QUIZ_DATA)를 사용합니다.
// ----------------------------------------------------------------------

// --- [옵션 A] 로컬 Vite 환경용 코드 (주석 해제하여 사용) ---
const quizModules = import.meta.glob('./quizzes/*.js', { eager: true });
const LOADED_QUIZZES = Object.values(quizModules).map(module => module.default);


// --- [옵션 B] 미리보기 및 기본 데이터 ---
// const STATIC_QUIZ_DATA = [];

// ⚠️ 로컬에서 파일을 불러올 때는 여기를 LOADED_QUIZZES 로 변경하세요.
const INITIAL_QUIZZES = LOADED_QUIZZES;


export default function QuizPlatform() {
  const [view, setView] = useState('home'); // 'home', 'solve'
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  
  // 퀴즈 데이터 상태 관리
  const [quizzes] = useState(INITIAL_QUIZZES);

  // --- Navigation Helpers ---
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

  // --- Render Logic ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Global Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            onClick={goHome}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Brain className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-900">QuizMaster</span>
          </div>
          
          <div className="flex items-center gap-4">
            {view !== 'home' && (
              <button 
                onClick={goHome}
                className="flex items-center gap-1 text-gray-500 hover:text-blue-600 font-medium transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">홈으로</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {view === 'home' && <HomeView quizzes={quizzes} onSelect={startSolve} />}
        {view === 'solve' && selectedQuiz && <SolverView quiz={selectedQuiz} onBack={goHome} />}
      </main>
    </div>
  );
}

// ----------------------------------------------------------------------
// VIEW 1: Home (카테고리 + 최신 퀴즈 + 검색)
// ----------------------------------------------------------------------
function HomeView({ quizzes, onSelect }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. 카테고리 목록 자동 추출 (중복 제거)
  const categories = useMemo(() => {
    const cats = quizzes.map(q => q.category || '기타');
    return ['All', ...new Set(cats)];
  }, [quizzes]);

  // 2. 최신 퀴즈 추출 (날짜순 정렬 후 상위 2개)
  const recentQuizzes = useMemo(() => {
    return [...quizzes]
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      .slice(0, 2);
  }, [quizzes]);

  // 3. 필터링된 퀴즈 목록 (카테고리 + 검색)
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(q => {
      // 카테고리 필터 (버튼 선택)
      const matchCategory = selectedCategory === 'All' || (q.category || '기타') === selectedCategory;
      
      // 검색어 소문자 변환
      const lowerTerm = searchTerm.toLowerCase();
      
      // ✅ [수정됨] 제목(Title), 설명(Description), 그리고 카테고리(Category) 텍스트까지 검색
      const matchSearch = q.title.toLowerCase().includes(lowerTerm) ||
                          q.description.toLowerCase().includes(lowerTerm) ||
                          (q.category || '').toLowerCase().includes(lowerTerm);
                          
      return matchCategory && matchSearch;
    });
  }, [quizzes, selectedCategory, searchTerm]);

  return (
    <div className="animate-fade-in space-y-10">
      
      {/* 섹션 1: 최신 업데이트 (검색/필터 중이 아닐 때만 표시) */}
      {!searchTerm && selectedCategory === 'All' && recentQuizzes.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900">따끈따끈한 최신 문제 🔥</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {recentQuizzes.map((quiz, idx) => (
              <div 
                key={`recent-${quiz.id || idx}`}
                onClick={() => onSelect(quiz)}
                className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all relative overflow-hidden"
              >
                <div className="relative z-10">
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-lg mb-3 text-blue-50">
                    {quiz.category || 'New'}
                  </span>
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">{quiz.title}</h3>
                  <p className="text-blue-100 text-sm line-clamp-2 mb-4">{quiz.description}</p>
                  <div className="flex items-center text-xs text-blue-200 font-medium">
                    <span>{quiz.createdAt} 등록</span>
                    <span className="mx-2">•</span>
                    <span>{quiz.author}</span>
                  </div>
                </div>
                {/* 장식용 원 */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 섹션 2: 카테고리 및 검색 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-blue-600" />
          {/* ✅ [수정됨] 헤더 텍스트 변경 */}
          <h2 className="text-xl font-bold text-gray-900">카테고리 및 퀴즈 검색</h2>
        </div>

        {/* 검색 바 */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            // ✅ [수정됨] 플레이스홀더 텍스트 변경
            placeholder="제목, 카테고리, 내용을 검색해보세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>

        {/* 카테고리 탭 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                selectedCategory === cat 
                  ? 'bg-gray-900 text-white shadow-md transform scale-105' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat === 'All' ? '전체 보기' : cat}
            </button>
          ))}
        </div>

        {/* 퀴즈 리스트 그리드 */}
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Grid className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">
              {searchTerm ? '검색 결과가 없습니다.' : '등록된 퀴즈가 없습니다.'}
            </p>
            {quizzes.length === 0 && (
              <p className="text-xs text-gray-400 mt-2">src/quizzes 폴더에 파일을 추가해보세요.</p>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredQuizzes.map((quiz, idx) => (
              <div 
                key={quiz.id || idx}
                onClick={() => onSelect(quiz)}
                className="group bg-white p-5 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {quiz.category || '기타'}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{quiz.createdAt}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{quiz.description}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ----------------------------------------------------------------------
// VIEW 2: Solver (문제 풀기 모드)
// ----------------------------------------------------------------------
function SolverView({ quiz, onBack }) {
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const question = quiz.questions[currentQIdx];
  const progress = ((currentQIdx + 1) / quiz.questions.length) * 100;

  const handleSelect = (idx) => {
    if (isChecked) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsChecked(true);
    if (selectedOption === question.answer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQIdx + 1 < quiz.questions.length) {
      setCurrentQIdx(c => c + 1);
      setSelectedOption(null);
      setIsChecked(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentQIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsChecked(false);
    setIsFinished(false);
  };

  if (isFinished) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="max-w-md mx-auto text-center py-12 animate-fade-in">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Award className="w-12 h-12 text-yellow-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">결과 확인</h2>
        <p className="text-gray-500 mb-8">{quiz.title}</p>
        <div className="text-6xl font-black text-blue-600 mb-4 tracking-tighter">
          {score} <span className="text-2xl text-gray-400 font-medium">/ {quiz.questions.length}</span>
        </div>
        <p className="text-lg font-medium text-gray-800 mb-12 bg-gray-50 px-6 py-3 rounded-full inline-block border border-gray-200">
          {percentage === 100 ? '완벽합니다! 🎉' : percentage >= 60 ? '잘 하셨어요! 👍' : '조금 더 힘내세요! 💪'}
        </p>
        <div className="space-y-3">
          <button onClick={handleRetry} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg flex justify-center items-center gap-2">
            <RefreshCw className="w-5 h-5" /> 다시 풀기
          </button>
          <button onClick={onBack} className="w-full bg-white text-gray-700 border border-gray-200 py-4 rounded-xl font-bold hover:bg-gray-50 flex justify-center items-center gap-2">
            다른 퀴즈 풀러가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header: Progress & Exit */}
      <div className="mb-8 flex items-center justify-between">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors flex items-center gap-1">
          &larr; 나가기
        </button>
        <div className="flex items-center gap-3">
          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{width: `${progress}%`}}></div>
          </div>
          <span className="text-sm font-bold text-blue-600">
            {currentQIdx + 1} / {quiz.questions.length}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-8 leading-relaxed">
          Q. {question.text}
        </h2>

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
              <button 
                key={idx} 
                onClick={() => handleSelect(idx)}
                disabled={isChecked}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center ${statusClass}`}
              >
                <span>{option}</span>
                {isChecked && idx === question.answer && <CheckCircle className="w-5 h-5 text-green-600" />}
                {isChecked && idx === selectedOption && idx !== question.answer && <XCircle className="w-5 h-5 text-red-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions Area */}
      {!isChecked ? (
        <button 
          onClick={handleSubmit}
          disabled={selectedOption === null}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
            selectedOption === null 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200'
          }`}
        >
          정답 확인
        </button>
      ) : (
        <div className="animate-fade-in-up">
          {(question.explanation || isChecked) && (
            <div className={`p-5 rounded-xl mb-6 flex gap-3 ${selectedOption === question.answer ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
              <Lightbulb className={`w-5 h-5 flex-shrink-0 mt-0.5 ${selectedOption === question.answer ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <p className={`font-bold mb-1 ${selectedOption === question.answer ? 'text-green-800' : 'text-red-800'}`}>
                  {selectedOption === question.answer ? '정답입니다!' : '오답입니다.'}
                </p>
                {question.explanation && <p className="text-gray-700 text-sm leading-relaxed">{question.explanation}</p>}
              </div>
            </div>
          )}
          <button 
            onClick={handleNext}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 shadow-lg flex justify-center items-center gap-2"
          >
            {currentQIdx + 1 < quiz.questions.length ? '다음 문제' : '결과 보기'} <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}