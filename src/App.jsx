import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BookOpen, Brain, CheckCircle, XCircle, ChevronRight,
  RefreshCw, Award, Lightbulb, Home, Search, Filter,
  Sparkles, Grid, Layers, Check, X, MessageCircle, ChevronDown,
  Pause, Play, Moon, Sun, Trophy, User, Flame, TrendingUp, Star,
  LogOut, Mail, Lock, LogIn, Coins, BarChart3, AlertCircle, Calendar
} from 'lucide-react';

// ----------------------------------------------------------------------
// 🚨 [설정] Supabase 제거 및 로컬 스토리지 모드 전환
// ----------------------------------------------------------------------
// import { createClient } from '@supabase/supabase-js'; 
// const supabase = null; // Supabase 클라이언트 제거 


// --- [데이터] 정적 퀴즈 데이터 ---
const quizModules = import.meta.glob('./quizzes/*.js', { eager: true });
const LOADED_QUIZZES = Object.values(quizModules).map(module => module.default);

// ⚠️ 로컬에서 파일을 불러올 때는 여기를 LOADED_QUIZZES 로 변경하세요.
const INITIAL_QUIZZES = LOADED_QUIZZES;

// ----------------------------------------------------------------------
// 🏆 [Logic] 10단계 티어 계산 시스템
// ----------------------------------------------------------------------
const calculateTier = (xp) => {
  const tiers = [
    { name: 'Iron', min: 0, color: 'text-slate-600 bg-slate-100 border-slate-300', icon: '🛡️' },
    { name: 'Bronze', min: 100, color: 'text-amber-700 bg-amber-100 border-amber-300', icon: '🥉' },
    { name: 'Silver', min: 300, color: 'text-slate-500 bg-slate-50 border-slate-300', icon: '🥈' },
    { name: 'Gold', min: 600, color: 'text-yellow-600 bg-yellow-100 border-yellow-300', icon: '🥇' },
    { name: 'Platinum', min: 1000, color: 'text-cyan-600 bg-cyan-100 border-cyan-300', icon: '💠' },
    { name: 'Emerald', min: 1500, color: 'text-emerald-600 bg-emerald-100 border-emerald-300', icon: '❇️' },
    { name: 'Diamond', min: 2200, color: 'text-blue-600 bg-blue-100 border-blue-300', icon: '💎' },
    { name: 'Master', min: 3000, color: 'text-purple-600 bg-purple-100 border-purple-300', icon: '🔮' },
    { name: 'Grandmaster', min: 4000, color: 'text-rose-600 bg-rose-100 border-rose-300', icon: '👑' },
    { name: 'Challenger', min: 5000, color: 'text-yellow-500 bg-slate-900 border-yellow-400 shadow-lg shadow-yellow-500/50', icon: '🏆' },
  ];

  let currentTier = tiers[0];
  let nextTier = tiers[1];

  for (let i = 0; i < tiers.length; i++) {
    if (xp >= tiers[i].min) {
      currentTier = tiers[i];
      nextTier = tiers[i + 1] || { min: 999999 };
    }
  }

  const level = Math.floor(xp / 100) + 1;

  return {
    tier: currentTier.name,
    styles: currentTier.color,
    icon: currentTier.icon,
    level,
    nextLevelXp: nextTier.min,
    currentTierMin: currentTier.min
  };
};

// ----------------------------------------------------------------------
// 🏅 [Logic] 뱃지 정의 및 계산 시스템
// ----------------------------------------------------------------------
const BADGES = [
  {
    id: 'first_step',
    name: '시작이 반이다',
    description: '첫 번째 퀴즈를 완료하세요.',
    icon: '🐣',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-600 dark:text-yellow-400',
    condition: (profile, history) => (profile?.total_solved || 0) >= 1
  },
  {
    id: 'combo_master',
    name: '작심삼일 극복',
    description: '3일 연속으로 학습하세요.',
    icon: '🔥',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-600 dark:text-orange-400',
    condition: (profile, history) => (profile?.streak || 0) >= 3
  },
  {
    id: 'quiz_explorer',
    name: '퀴즈 탐험가',
    description: '퀴즈를 5개 이상 푸세요.',
    icon: '🧭',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    condition: (profile, history) => (profile?.total_solved || 0) >= 5
  },
  {
    id: 'perfectionist',
    name: '완벽주의자',
    description: '한 번의 퀴즈에서 만점을 받으세요.',
    icon: '💯',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-600 dark:text-purple-400',
    condition: (profile, history) => history && history.some(h => h.points_earned && h.points_earned > 0) // 단순화: 점수를 획득한 기록이 있으면 달성으로 간주 (상세 로직은 데이터 구조에 따라 고도화 가능)
  },
  {
    id: 'bronze_tier',
    name: '레벨업의 시작',
    description: 'Bronze 티어(100 XP)를 달성하세요.',
    icon: '🥉',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    condition: (profile, history) => (profile?.total_xp || 0) >= 100
  },
  {
    id: 'silver_tier',
    name: '숙련된 조교',
    description: 'Silver 티어(300 XP)를 달성하세요.',
    icon: '🥈',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-400',
    condition: (profile, history) => (profile?.total_xp || 0) >= 300
  }
];

const calculateBadges = (userProfile, solvedHistory) => {
  if (!userProfile) return [];
  return BADGES.filter(badge => badge.condition(userProfile, solvedHistory)).map(b => b.id);
};

// ----------------------------------------------------------------------
// 🎨 Helper Components
// ----------------------------------------------------------------------
const getCategoryTheme = (category) => {
  const themes = [
    { gradient: 'from-blue-600 to-indigo-700', badgeBg: 'bg-blue-50 dark:bg-blue-900/30', badgeText: 'text-blue-700 dark:text-blue-300', hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-700', iconHover: 'group-hover:bg-blue-600' },
    { gradient: 'from-emerald-500 to-teal-700', badgeBg: 'bg-emerald-50 dark:bg-emerald-900/30', badgeText: 'text-emerald-700 dark:text-emerald-300', hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700', iconHover: 'group-hover:bg-emerald-600' },
    { gradient: 'from-orange-500 to-amber-600', badgeBg: 'bg-orange-50 dark:bg-orange-900/30', badgeText: 'text-orange-700 dark:text-orange-300', hoverBorder: 'hover:border-orange-300 dark:hover:border-orange-700', iconHover: 'group-hover:bg-orange-600' },
    { gradient: 'from-rose-500 to-pink-600', badgeBg: 'bg-rose-50 dark:bg-rose-900/30', badgeText: 'text-rose-700 dark:text-rose-300', hoverBorder: 'hover:border-rose-300 dark:hover:border-rose-700', iconHover: 'group-hover:bg-rose-600' },
    { gradient: 'from-violet-600 to-purple-700', badgeBg: 'bg-violet-50 dark:bg-violet-900/30', badgeText: 'text-violet-700 dark:text-violet-300', hoverBorder: 'hover:border-violet-300 dark:hover:border-violet-700', iconHover: 'group-hover:bg-violet-600' }
  ];
  if (!category) return themes[0];
  let hash = 0;
  for (let i = 0; i < category.length; i++) hash = category.charCodeAt(i) + ((hash << 5) - hash);
  return themes[Math.abs(hash) % themes.length];
};

const KatexRenderer = ({ formula }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (window.katex && containerRef.current) {
      try { window.katex.render(formula, containerRef.current, { throwOnError: false, displayMode: false }); } catch (e) { containerRef.current.innerText = formula; }
    }
  }, [formula]);
  if (!window.katex && typeof window !== 'undefined') return <span>${formula}$</span>;
  return <span ref={containerRef} />;
};

const RenderContent = ({ content }) => {
  if (!content) return null;
  if (typeof content !== 'string') return <span>{content}</span>;
  const parts = content.split('$');
  return (<span>{parts.map((part, index) => (index % 2 === 0 ? <span key={index}>{part}</span> : <KatexRenderer key={index} formula={part} />))}</span>);
};

const Confetti = () => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const colors = ['#FFC700', '#FF0000', '#2E3192', '#41BBC7', '#73ff00'];
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100 - 20,
      color: colors[Math.floor(Math.random() * colors.length)], delay: Math.random() * 2, size: Math.random() * 10 + 5, rotation: Math.random() * 360
    }));
    setParticles(newParticles);
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div key={p.id} className="absolute animate-confetti-fall" style={{ left: `${p.x}%`, top: `-10%`, width: `${p.size}px`, height: `${p.size}px`, backgroundColor: p.color, animationDelay: `${p.delay}s`, transform: `rotate(${p.rotation}deg)` }} />
      ))}
      <style>{`@keyframes confetti-fall { 0% { top: -10%; transform: translateX(0) rotate(0deg); opacity: 1; } 100% { top: 110%; transform: translateX(${Math.random() * 40 - 20}vw) rotate(720deg); opacity: 0; } } .animate-confetti-fall { animation: confetti-fall 4s linear forwards; }`}</style>
    </div>
  );
};

const AnimatedCounter = ({ end, duration = 1500 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime;
    const startValue = 0;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(startValue + (1 - Math.pow(1 - progress, 3)) * (end - startValue)));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);
  return <span>{count}</span>;
};



const BadgeModal = ({ isOpen, onClose, earnedBadgeIds }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-700 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2 dark:text-white">
            <Award className="w-6 h-6 text-yellow-500" />
            업적 배지 ({earnedBadgeIds.length}/{BADGES.length})
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BADGES.map(badge => {
            const isEarned = earnedBadgeIds.includes(badge.id);
            return (
              <div key={badge.id} className={`p-4 rounded-xl border transition-all ${isEarned ? 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 shadow-sm' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 opacity-60 grayscale'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${isEarned ? badge.bg : 'bg-gray-200 dark:bg-gray-700'}`}>
                    {badge.icon}
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm mb-1 ${isEarned ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      {badge.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {badge.description}
                    </p>
                    {isEarned && <div className="mt-2 text-[10px] font-bold text-blue-500 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> 획득 완료</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 🔑 Auth View
// ----------------------------------------------------------------------


// ----------------------------------------------------------------------
// 🌟 사이드바 (왼쪽: 내 정보) - 🚀 [NEW] 차트 업그레이드
// ----------------------------------------------------------------------
const SidebarLeft = ({ userProfile, onViewSolved, totalQuizzesCount, solvedHistory, earnedBadges, onOpenBadgeModal }) => {
  // LocalStorage 모드에서는 user 객체 검사를 하지 않습니다.
  const nickname = userProfile?.nickname || 'Guest';


  const xp = userProfile?.total_xp || 0;
  const { tier, styles, nextLevelXp, currentTierMin, icon } = calculateTier(xp);

  // 티어 내 진행률
  let progress = 0;
  if (nextLevelXp > currentTierMin) {
    progress = ((xp - currentTierMin) / (nextLevelXp - currentTierMin)) * 100;
  }
  progress = Math.min(Math.max(progress, 0), 100);

  const solvedCount = userProfile?.total_solved || 0;
  const totalCount = totalQuizzesCount || 1;
  const solvedPercentage = Math.min((solvedCount / totalCount) * 100, 100);
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (solvedPercentage / 100) * circumference;

  // 🚀 [NEW] 주간 학습 꺾은선 그래프 생성기
  const generateWeeklyStats = () => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const today = new Date();
    const stats = [];
    let maxVal = 0;

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const count = solvedHistory ? solvedHistory.filter(item => item.solved_at && item.solved_at.startsWith(dateStr)).length : 0;
      if (count > maxVal) maxVal = count;
      stats.push({ day: days[d.getDay()], date: dateStr, count });
    }
    return { stats, maxVal: Math.max(maxVal, 5) }; // 최소 5칸 확보
  };

  const { stats: weeklyStats, maxVal } = generateWeeklyStats();

  // SVG 좌표 계산
  const chartHeight = 60;
  const chartWidth = 220;
  const points = weeklyStats.map((s, i) => {
    const x = (i / (weeklyStats.length - 1)) * chartWidth;
    const y = chartHeight - (s.count / maxVal) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const [hoveredData, setHoveredData] = useState(null);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-3xl shadow-lg ${styles}`}>
            {icon}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">{nickname}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles}`}>
              {tier}
            </span>
          </div>
        </div>

        <div className="mb-2 flex justify-between text-xs font-bold text-gray-600 dark:text-gray-300">
          <span>{xp} XP</span>
          <span>{nextLevelXp} XP (Next)</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 mb-6 overflow-hidden">
          <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl text-center flex flex-col justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={onOpenBadgeModal}>
            <div className="text-orange-500 mb-1 flex justify-center gap-1">
              {earnedBadges.length > 0 ? (
                <span className="text-xl">{BADGES.find(b => b.id === earnedBadges[earnedBadges.length - 1]).icon}</span>
              ) : (
                <Award className="w-5 h-5" />
              )}
            </div>
            <div className="text-xl font-black text-gray-900 dark:text-white">{earnedBadges.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">내 뱃지</div>
          </div>

          <div onClick={onViewSolved} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl text-center cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group flex flex-col justify-center items-center relative">
            <div className="relative w-14 h-14 mb-1">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r={radius} className="stroke-gray-200 dark:stroke-gray-600" strokeWidth="4" fill="transparent" />
                <circle cx="28" cy="28" r={radius} className="stroke-blue-500 transition-all duration-1000 ease-out" strokeWidth="4" fill="transparent" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} style={{ strokeDashoffset }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center"><Trophy className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" /></div>
            </div>
            <div className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">{solvedCount} / {totalCount}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">푼 퀴즈</div>
          </div>
        </div>

        {/* 🚀 [NEW] 꺾은선 그래프 */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 relative">
          <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 최근 7일 학습량
          </h4>
          <div className="h-20 w-full relative" onMouseLeave={() => setHoveredData(null)}>
            <svg className="w-full h-full overflow-visible">
              {/* 라인 */}
              <polyline
                points={points}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* 포인트 (Dots) */}
              {weeklyStats.map((s, i) => {
                const x = (i / (weeklyStats.length - 1)) * chartWidth;
                const y = chartHeight - (s.count / maxVal) * chartHeight;
                return (
                  <circle
                    key={i}
                    cx={x} cy={y} r="4"
                    className={`fill-white stroke-blue-500 stroke-2 cursor-pointer transition-all hover:r-6 ${hoveredData?.index === i ? 'r-6 fill-blue-100' : ''}`}
                    onMouseEnter={() => setHoveredData({ index: i, x, y, ...s })}
                  />
                );
              })}
            </svg>

            {/* 툴팁 */}
            {hoveredData && (
              <div
                className="absolute -top-8 bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-lg transform -translate-x-1/2 transition-all pointer-events-none z-10 whitespace-nowrap"
                style={{ left: hoveredData.x }}
              >
                {hoveredData.date}: {hoveredData.count}문제
              </div>
            )}
          </div>
          {/* X축 라벨 */}
          <div className="flex justify-between mt-2 text-[10px] text-gray-400">
            {weeklyStats.map((s, i) => <span key={i}>{s.day}</span>)}
          </div>
        </div>

      </div>
    </div>

  );
};

// ----------------------------------------------------------------------
// 🌟 사이드바 (오른쪽: 랭킹)
// ----------------------------------------------------------------------
const SidebarRight = () => {
  // 로컬 전용이므로 정적 리더보드 예시를 보여줍니다.
  const leaderboard = [
    { email: 'Pxxguin', total_xp: 15300 },
    { email: 'Habin0223', total_xp: 12400 },
    { email: 'Doyun22222', total_xp: 8900 },
    { email: 'Prim2', total_xp: 5200 },
    { email: 'Supreme', total_xp: 3100 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> 명예의 전당</h3>
        <div className="space-y-4">
          {leaderboard.map((user, idx) => {
            const { tier, styles, icon } = calculateTier(user.total_xp || 0);
            return (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-400' : 'bg-blue-500'}`}>
                    {idx + 1}
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 truncate w-24">
                      {user.email}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 ${styles}`}>
                      <span>{icon}</span> {tier}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{user.total_xp} XP</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-orange-500" /> 인기 키워드</h3>
        <div className="flex flex-wrap gap-2">
          {['#React', '#Javascript', '#AI', '#Python', '#CS', '#Network'].map(tag => (
            <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};


export default function QuizPlatform() {
  const [view, setView] = useState('home');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizzes] = useState(INITIAL_QUIZZES);


  const [userProfile, setUserProfile] = useState(null);

  const [leaderboard, setLeaderboard] = useState([]);
  const [solvedQuizIds, setSolvedQuizIds] = useState([]);
  const [solvedHistory, setSolvedHistory] = useState([]);



  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  // 뱃지 계산 (메모이제이션)
  const earnedBadges = useMemo(() => calculateBadges(userProfile, solvedHistory), [userProfile, solvedHistory]);

  // 🌙 [다크 모드] 로직 수정
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quizAppTheme');
      // 저장된 값이 없으면 시스템 설정을 따름
      if (saved === null) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return saved === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('quizAppTheme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('quizAppTheme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);


  // 🚀 [LocalStorage] 초기화
  useEffect(() => {
    const savedProfile = localStorage.getItem('quizApp_profile');
    const savedSolved = localStorage.getItem('quizApp_solvedHistory');

    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    } else {
      // 초기 프로필 생성
      const newProfile = { nickname: 'Guest', total_xp: 0, total_solved: 0, streak: 1, last_login_at: new Date().toISOString() };
      setUserProfile(newProfile);
      localStorage.setItem('quizApp_profile', JSON.stringify(newProfile));
    }

    if (savedSolved) {
      const history = JSON.parse(savedSolved);
      setSolvedHistory(history);
      setSolvedQuizIds(history.map(h => h.quiz_id));
    }
  }, []);

  const handleQuizComplete = (quizId, earnedPoints) => {
    // 0점이면 저장하지 않음
    if (earnedPoints === 0) return;
    if (solvedQuizIds.includes(quizId)) return;

    // 1. 프로필 업데이트
    const newXp = (userProfile?.total_xp || 0) + earnedPoints;
    const newTotal = (userProfile?.total_solved || 0) + 1;
    const newProfile = { ...userProfile, total_xp: newXp, total_solved: newTotal };

    setUserProfile(newProfile);
    localStorage.setItem('quizApp_profile', JSON.stringify(newProfile));

    // 2. 히스토리 업데이트
    const newHistoryItem = { quiz_id: quizId, solved_at: new Date().toISOString(), points_earned: earnedPoints };
    const newHistory = [...solvedHistory, newHistoryItem];

    setSolvedHistory(newHistory);
    setSolvedQuizIds(prev => [...prev, quizId]);
    localStorage.setItem('quizApp_solvedHistory', JSON.stringify(newHistory));
  };


  const handleLogoutConfirm = () => {
    // 로컬 스토리지에서는 로그아웃 개념이 없지만, 데이터 초기화를 원한다면 여기서 처리 가능
    // 현재는 그냥 모달 닫기
    setIsLogoutModalOpen(false);
  };


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

  const [currentCategory, setCurrentCategory] = useState('All');
  const handleViewSolved = () => { setCurrentCategory('Solved'); };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300">


      <BadgeModal
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
        earnedBadgeIds={earnedBadges}
      />

      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div onClick={goHome} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Brain className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">AI Atlas</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {view !== 'home' && (<button onClick={goHome} className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"><Home className="w-4 h-4" /><span className="hidden sm:inline">홈으로</span></button>)}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === 'home' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24">
                <SidebarLeft
                  userProfile={userProfile}
                  onViewSolved={handleViewSolved}
                  totalQuizzesCount={quizzes.length}
                  solvedHistory={solvedHistory}
                  earnedBadges={earnedBadges}
                  onOpenBadgeModal={() => setIsBadgeModalOpen(true)}
                />
              </div>
            </aside>
            <section className="lg:col-span-6">
              <HomeView quizzes={quizzes} onSelect={startSolve} solvedQuizIds={solvedQuizIds} selectedCategory={currentCategory} setSelectedCategory={setCurrentCategory} />
            </section>
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24"><SidebarRight /></div>
            </aside>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {view === 'solve' && selectedQuiz &&
              <SolverView
                quiz={selectedQuiz}
                onBack={goHome}
                onComplete={handleQuizComplete}
              />
            }
          </div>
        )}
      </main>
    </div>
  );
}

function HomeView({ quizzes, onSelect, solvedQuizIds = [], selectedCategory, setSelectedCategory }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideIntervalRef = useRef(null);

  // 🚀 [Pagination] 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const categories = useMemo(() => { const cats = quizzes.map(q => q.category || '기타'); return ['All', ...new Set(cats)]; }, [quizzes]);
  const recentQuizzes = useMemo(() => { return [...quizzes].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 5); }, [quizzes]);
  const carouselItems = useMemo(() => { if (recentQuizzes.length <= 2) return recentQuizzes; return [...recentQuizzes, ...recentQuizzes.slice(0, 2)]; }, [recentQuizzes]);
  useEffect(() => { if (isPaused || recentQuizzes.length <= 2) return; const startInterval = () => { slideIntervalRef.current = setInterval(() => { setCurrentSlide(prev => { const next = prev + 1; return next >= recentQuizzes.length ? 0 : next; }); }, 3000); }; startInterval(); return () => { if (slideIntervalRef.current) clearInterval(slideIntervalRef.current); }; }, [isPaused, recentQuizzes.length]);
  const filteredQuizzes = useMemo(() => { return quizzes.filter(q => { const matchCategory = selectedCategory === 'All' || (selectedCategory === 'Solved' ? solvedQuizIds.includes(q.id) : (q.category || '기타') === selectedCategory); const lowerTerm = searchTerm.toLowerCase(); const matchSearch = q.title.toLowerCase().includes(lowerTerm) || q.description.toLowerCase().includes(lowerTerm) || (q.category || '').toLowerCase().includes(lowerTerm); return matchCategory && matchSearch; }); }, [quizzes, selectedCategory, searchTerm, solvedQuizIds]);

  // 🚀 [Pagination] 필터 변경 시 페이지 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  // 🚀 [Pagination] 현재 페이지 데이터 계산
  const totalPages = Math.ceil(filteredQuizzes.length / ITEMS_PER_PAGE);
  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="animate-fade-in space-y-8">
      {!searchTerm && selectedCategory === 'All' && recentQuizzes.length > 0 && (
        <section onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-yellow-500" /><h2 className="text-xl font-bold text-gray-900 dark:text-white">따끈따끈한 최신 문제</h2></div>
            {recentQuizzes.length > 2 && (<div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">{isPaused ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}{isPaused ? '일시정지' : '자동재생'}</div>)}
          </div>
          <div className="overflow-hidden -mx-2 px-2 py-2"><div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * (window.innerWidth < 640 ? 100 : 50)}%)` }}>
            {carouselItems.map((quiz, idx) => {
              const theme = getCategoryTheme(quiz.category); return (
                <div key={`${quiz.id}-carousel-${idx}`} className="w-full sm:w-1/2 flex-shrink-0 px-2"><div onClick={() => onSelect(quiz)} className={`bg-gradient-to-br ${theme.gradient} rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all relative overflow-hidden h-full flex flex-col justify-between border border-transparent dark:border-white/10`}><div className="relative z-10"><span className="inline-block bg-white/20 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-lg mb-3 text-white">{quiz.category || 'New'}</span><h3 className="text-xl font-bold mb-2 line-clamp-1">{quiz.title}</h3><p className="text-white/90 text-sm line-clamp-2 mb-4">{quiz.description}</p></div><div className="relative z-10 flex items-center text-xs text-white/80 font-medium mt-2"><span>{quiz.createdAt} 등록</span><span className="mx-2">•</span><span>{quiz.author}</span></div><div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div></div></div>
              );
            })}</div></div></section>)}
      <section>
        <div className="flex items-center gap-2 mb-4"><Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" /><h2 className="text-xl font-bold text-gray-900 dark:text-white">퀴즈 탐색</h2></div>
        <div className="relative mb-6"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="제목, 카테고리, 내용을 검색해보세요..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all" /></div>
        <div className="flex flex-wrap gap-2 mb-6 items-center">{categories.map(cat => (<button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md transform scale-105' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{cat === 'All' ? '전체 보기' : cat}</button>))}
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>
          <button onClick={() => setSelectedCategory('Solved')} className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === 'Solved' ? 'bg-green-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900 hover:bg-green-50 dark:hover:bg-green-900/20'}`}><CheckCircle className="w-4 h-4" /> 내가 푼 문제</button>
        </div>
        {paginatedQuizzes.length === 0 ? (<div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700"><div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3"><Grid className="w-6 h-6 text-gray-400" /></div><p className="text-gray-500 dark:text-gray-400 font-medium">{searchTerm ? '검색 결과가 없습니다.' : '등록된 퀴즈가 없습니다.'}</p></div>) : (<div className="grid gap-4">{paginatedQuizzes.map((quiz, idx) => {
          const theme = getCategoryTheme(quiz.category);
          const isSolved = solvedQuizIds.includes(quiz.id);
          return (
            <div key={quiz.id || idx} onClick={() => onSelect(quiz)} className={`group bg-white dark:bg-gray-800 p-5 rounded-2xl border ${theme.hoverBorder} hover:shadow-md cursor-pointer transition-all flex items-center justify-between relative overflow-hidden ${isSolved ? 'border-green-200 dark:border-green-900/30 bg-green-50/30 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700'}`}>
              <div className="flex-1 min-w-0 pr-4 z-10">
                <div className="flex items-center gap-2 mb-1"><span className={`text-xs font-bold ${theme.badgeText} ${theme.badgeBg} px-2 py-0.5 rounded-md`}>{quiz.category || '기타'}</span><span className="flex items-center gap-1 text-xs font-bold text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-md"><Coins className="w-3 h-3" /> {quiz.points || 0} XP</span><span className="text-xs text-gray-400 dark:text-gray-500">•</span><span className="text-xs text-gray-400 dark:text-gray-500">{quiz.createdAt}</span></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{quiz.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{quiz.description}</p>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0 z-10 ${isSolved ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : `bg-gray-100 dark:bg-gray-700 ${theme.iconHover} group-hover:text-white text-gray-600 dark:text-gray-400`}`}>{isSolved ? <Check className="w-6 h-6" /> : <ChevronRight className="w-5 h-5" />}</div>
              {isSolved && (<div className="absolute -right-2 -bottom-4 opacity-10 pointer-events-none"><Award className="w-24 h-24 text-green-600" /></div>)}
            </div>
          );
        })}</div>)}

        {/* 🚀 [Pagination] 페이지네이션 컨트롤 */}
        {filteredQuizzes.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 shadow-sm"
            >
              <ChevronDown className="w-5 h-5 rotate-90" />
            </button>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 shadow-sm"
            >
              <ChevronDown className="w-5 h-5 -rotate-90" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

// ----------------------------------------------------------------------
// 🚀 [NEW] SolverView 업데이트 (애니메이션, 점수 조건)
// ----------------------------------------------------------------------
function SolverView({ quiz, onBack, onComplete }) {
  const shuffleQuestions = (questions) => { if (!questions || questions.length === 0) return []; const shuffled = [...questions]; for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; } return shuffled; };
  const [shuffledQuestions, setShuffledQuestions] = useState(() => shuffleQuestions(quiz.questions));
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  // 🚀 [NEW] 원형 그래프 애니메이션 상태
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (isFinished && onComplete) {
      // 🚀 [NEW] 0점 이상일 때만 저장 (틀린 문제는 다시 풀 수 있게)
      if (score > 0) {
        const earnedPoints = Math.round((score / quiz.questions.length) * (quiz.points || 0));
        onComplete(quiz.id, earnedPoints);
      }
      // 애니메이션 시작
      setTimeout(() => {
        setAnimationProgress((score / shuffledQuestions.length) * 100);
      }, 100);
    }
  }, [isFinished]);

  const question = shuffledQuestions[currentQIdx];
  const progress = ((currentQIdx + 1) / shuffledQuestions.length) * 100;
  const currentExplanation = question.shortExplanation || question.explanation;
  const handleSelect = (idx) => { if (isChecked) return; setSelectedOption(idx); };
  const handleSubmit = () => { if (selectedOption === null) return; setIsChecked(true); const newAnswers = [...userAnswers]; newAnswers[currentQIdx] = selectedOption; setUserAnswers(newAnswers); if (selectedOption === question.answer) setScore(s => s + 1); };
  const handleNext = () => { if (currentQIdx + 1 < shuffledQuestions.length) { setCurrentQIdx(c => c + 1); setSelectedOption(null); setIsChecked(false); } else { setIsFinished(true); } };
  const handleRetry = () => { setShuffledQuestions(shuffleQuestions(quiz.questions)); setCurrentQIdx(0); setScore(0); setSelectedOption(null); setIsChecked(false); setIsFinished(false); setUserAnswers([]); setShowAllQuestions(false); setAnimationProgress(0); window.scrollTo(0, 0); };

  if (isFinished) {
    // 🚀 [NEW] 점수가 0점이면 '실패' 처리
    const isFailed = score === 0;
    const percentage = Math.round((score / shuffledQuestions.length) * 100);
    const visibleQuestions = showAllQuestions ? shuffledQuestions : [shuffledQuestions[0]];

    // 원형 차트
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    // 애니메이션 상태 사용
    const strokeDashoffset = circumference - (animationProgress / 100) * circumference;

    const earnedPoints = Math.round((score / quiz.questions.length) * (quiz.points || 0));

    return (
      <div className="max-w-2xl mx-auto animate-fade-in pb-20 relative">
        {percentage >= 60 && <Confetti />}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-10 text-center relative">
          <div className={`h-48 relative flex items-center justify-center bg-gradient-to-br ${isFailed ? 'from-red-500 to-orange-600' : 'from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900'}`}>
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r={radius} className="stroke-white/20" strokeWidth="8" fill="transparent" />
                <circle
                  cx="64" cy="64" r={radius}
                  className="stroke-white transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ strokeDashoffset }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                {isFailed ? <XCircle className="w-8 h-8 mb-1" /> : <Trophy className="w-8 h-8 mb-1" />}
                {/* 🚀 [NEW] 카운트 업 애니메이션 */}
                <span className="text-2xl font-bold flex items-center gap-1">
                  <AnimatedCounter end={score} duration={1000} /> / {shuffledQuestions.length}
                </span>
              </div>
            </div>
          </div>
          <div className="pt-8 pb-8 px-6">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
              {isFailed ? '아쉽네요 😢' : (percentage === 100 ? '완벽합니다! 🎉' : '훌륭해요! 👍')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm font-medium">{quiz.title}</p>

            {isFailed ? (
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold text-sm">
                다시 도전해서 포인트를 획득하세요!
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold text-sm">
                <Coins className="w-4 h-4" /> +{earnedPoints} XP 획득!
              </div>
            )}
          </div>
        </div>
        <div className="mb-8"><h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 px-2"><BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" /> 문제 다시보기 & 상세 해설</h3><div className="space-y-8">{visibleQuestions.map((q, idx) => { const myAnswer = userAnswers[idx]; const isCorrect = myAnswer === q.answer; const reviewExplanation = q.detailedExplanation || q.explanation || '해설이 없습니다.'; return (<div key={q.id} className={`bg-white dark:bg-gray-800 rounded-2xl border-2 p-6 ${isCorrect ? 'border-gray-100 dark:border-gray-700' : 'border-red-100 dark:border-red-900/50'}`}><div className="mb-4"><div className="flex gap-3 mb-2"><span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isCorrect ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>Q{idx + 1}</span><h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-snug pt-0.5"><RenderContent content={q.text} /></h4></div>{q.image && <img src={q.image} alt="참고 이미지" className="block mt-4 max-w-full h-auto max-h-60 rounded-lg object-contain border border-gray-100 dark:border-gray-700 mx-auto" />}</div><div className="space-y-2 mb-5">{q.options.map((opt, optIdx) => { let style = "p-3 rounded-xl border text-sm font-medium flex justify-between items-center "; if (optIdx === q.answer) style += "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300"; else if (optIdx === myAnswer && !isCorrect) style += "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"; else style += "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500"; return (<div key={optIdx} className={style}><RenderContent content={opt} />{optIdx === q.answer && <Check className="w-4 h-4 text-green-600 dark:text-green-400" />}{optIdx === myAnswer && !isCorrect && <X className="w-4 h-4 text-red-600 dark:text-red-400" />}</div>); })}</div><details className="group bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden transition-all duration-300 border border-gray-100 dark:border-gray-700"><summary className="flex items-center justify-between p-4 cursor-pointer list-none select-none hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300"><Lightbulb className="w-5 h-5 text-yellow-500" /><span>해설 확인하기</span></div><ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-300 group-open:rotate-180" /></summary><div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-4 bg-white dark:bg-gray-800"><span className="font-bold text-gray-900 dark:text-white block mb-2">상세 해설</span><RenderContent content={reviewExplanation} /></div></details></div>); })}</div>
          {!showAllQuestions && shuffledQuestions.length > 1 && (<button onClick={() => setShowAllQuestions(true)} className="w-full mt-6 py-4 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl text-gray-500 dark:text-gray-400 font-bold hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2">나머지 {shuffledQuestions.length - 1}문제 전체 보기 <ChevronDown className="w-5 h-5" /></button>)}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sticky bottom-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"><button onClick={handleRetry} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 flex justify-center items-center gap-2 shadow-md transition-all"><RefreshCw className="w-5 h-5" /> 다시 풀기</button><button onClick={onBack} className="flex-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-center items-center gap-2 transition-all">다른 퀴즈 풀러가기</button></div>
      </div>
    );
  }
  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between"><button onClick={onBack} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-sm font-medium transition-colors flex items-center gap-1">&larr; 나가기</button><div className="flex items-center gap-3"><div className="w-24 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }}></div></div><span className="text-sm font-bold text-blue-600 dark:text-blue-400">{currentQIdx + 1} / {shuffledQuestions.length}</span></div></div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 mb-6">
        {question.context && (<div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-gray-700 dark:text-gray-300 text-sm font-medium border border-gray-100 dark:border-gray-700"><RenderContent content={question.context} /></div>)}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 leading-relaxed"><span className="mr-2 text-blue-600 dark:text-blue-400">Q.</span><RenderContent content={question.text} /></h2>
        {question.image && (<div className="mb-8 flex justify-center"><img src={question.image} alt="문제 이미지" className="max-w-full max-h-80 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 object-contain bg-white" /></div>)}
        <div className="space-y-3">{question.options.map((option, idx) => { let statusClass = "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"; if (selectedOption === idx) statusClass = "border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"; if (isChecked) { if (idx === question.answer) statusClass = "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400"; else if (idx === selectedOption) statusClass = "border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400"; else statusClass = "border-gray-100 dark:border-gray-700 text-gray-300 dark:text-gray-600 opacity-50"; } return (<button key={idx} onClick={() => handleSelect(idx)} disabled={isChecked} className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center ${statusClass}`}><RenderContent content={option} />{isChecked && idx === question.answer && <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />}{isChecked && idx === selectedOption && idx !== question.answer && <XCircle className="w-5 h-5 text-red-600 dark:text-red-500" />}</button>); })}</div>
      </div>
      {!isChecked ? (<button onClick={handleSubmit} disabled={selectedOption === null} className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${selectedOption === null ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200'}`}>정답 확인</button>) : (<div className="animate-fade-in-up">{currentExplanation && (<div className={`p-5 rounded-xl mb-6 flex gap-3 ${selectedOption === question.answer ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800'}`}><MessageCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${selectedOption === question.answer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} /><div><p className={`font-bold mb-1 ${selectedOption === question.answer ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>{selectedOption === question.answer ? '정답입니다!' : '오답입니다.'}</p><p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed"><RenderContent content={currentExplanation} /></p></div></div>)}<button onClick={handleNext} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-100 shadow-lg flex justify-center items-center gap-2">{currentQIdx + 1 < shuffledQuestions.length ? '다음 문제' : '결과 보기'} <ChevronRight className="w-5 h-5" /></button></div>)}
    </div>
  );
}