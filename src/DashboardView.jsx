import React, { useMemo } from 'react';
import {
  BarChart3, Calendar, CheckCircle, TrendingUp, Award,
  Clock, Target, Zap, BookOpen, Trophy, Star, ArrowRight
} from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';

// ----------------------------------------------------------------------
// 📊 StatCard Component
// ----------------------------------------------------------------------
const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color.bg} ${color.text}`}>
        <Icon className="w-6 h-6" />
      </div>
      {subtext && <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{subtext}</span>}
    </div>
    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
    <div className="text-2xl font-black text-gray-900 dark:text-white">{value}</div>
  </div>
);

// ----------------------------------------------------------------------
// 🕸️ AbilityRadar Component (Radar Chart)
// ----------------------------------------------------------------------
const AbilityRadar = ({ solvedHistory, quizzes }) => {
  const data = useMemo(() => {
    const categories = {};

    // 1. 모든 카테고리 초기화
    quizzes.forEach(q => {
      const cat = q.category || '기타';
      if (!categories[cat]) categories[cat] = { total: 0, solved: 0, points: 0 };
      categories[cat].total += 1;
    });

    // 2. 푼 문제 카운트
    solvedHistory.forEach(h => {
      const quiz = quizzes.find(q => q.id === h.quiz_id);
      if (quiz) {
        const cat = quiz.category || '기타';
        if (categories[cat]) {
          categories[cat].solved += 1;
          categories[cat].points += (h.points_earned || 0);
        }
      }
    });

    // 3. 데이터 포맷팅 (Top 5 카테고리)
    return Object.keys(categories)
      .map(cat => ({
        subject: cat === '논문 리뷰' ? '논문' : cat,
        A: Math.round((categories[cat].solved / Math.max(categories[cat].total, 1)) * 100), // 정답률
        fullMark: 100
      }))
      .sort((a, b) => b.A - a.A)
      .slice(0, 6);
  }, [solvedHistory, quizzes]);

  return (
    <div className="h-[300px] w-full flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="성취도"
            dataKey="A"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="#3b82f6"
            fillOpacity={0.2}
          />
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
          />
        </RadarChart>
      </ResponsiveContainer>
      {data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <p className="text-gray-500 font-medium">데이터가 부족합니다</p>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// 📅 StreakCalendar Component (GitHub Style)
// ----------------------------------------------------------------------
const StreakCalendar = ({ solvedHistory }) => {
  // 최근 140일 (약 20주) 데이터 생성
  const calendarData = useMemo(() => {
    const days = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 140);

    const historyMap = {};
    solvedHistory.forEach(h => {
      const date = h.solved_at.split('T')[0];
      historyMap[date] = (historyMap[date] || 0) + 1;
    });

    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const count = historyMap[dateStr] || 0;
      let level = 0;
      if (count > 0) level = 1;
      if (count > 2) level = 2;
      if (count > 5) level = 3;
      if (count > 8) level = 4;

      days.push({ date: dateStr, count, level });
    }
    return days;
  }, [solvedHistory]);

  const getColor = (level) => {
    switch (level) {
      case 0: return 'bg-gray-100 dark:bg-gray-700';
      case 1: return 'bg-green-200 dark:bg-green-900';
      case 2: return 'bg-green-300 dark:bg-green-700';
      case 3: return 'bg-green-400 dark:bg-green-600';
      case 4: return 'bg-green-500 dark:bg-green-500';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
      {calendarData.map((day, idx) => (
        <div
          key={idx}
          title={`${day.date}: ${day.count}문제 해결`}
          className={`w-3 h-3 rounded-sm ${getColor(day.level)} transition-all hover:scale-125 hover:ring-2 ring-offset-1 ring-green-400 cursor-pointer`}
        ></div>
      ))}
    </div>
  );
};

// ----------------------------------------------------------------------
// 🕒 RecentActivity Component
// ----------------------------------------------------------------------
const RecentActivity = ({ solvedHistory, quizzes }) => {
  const recentItems = [...solvedHistory].reverse().slice(0, 5);

  return (
    <div className="space-y-4">
      {recentItems.map((item, idx) => {
        const quiz = quizzes.find(q => q.id === item.quiz_id);
        if (!quiz) return null;

        return (
          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs flex-shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{quiz.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(item.solved_at).toLocaleDateString()} • +{item.points_earned} XP
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
        );
      })}
      {recentItems.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          아직 활동 기록이 없습니다.
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// 🎓 CertificatesSection Component
// ----------------------------------------------------------------------
const CertificatesSection = ({ quizzes, solvedHistory, onViewCertificate }) => {
  const certificates = useMemo(() => {
    const categories = {};

    // 카테고리별 총 문제 수 계산
    quizzes.forEach(q => {
      const cat = q.category || '기타';
      if (!categories[cat]) categories[cat] = { total: 0, solved: 0, lastSolvedAt: null };
      categories[cat].total += 1;
    });

    // solvedHistory는 시간 순서대로 쌓이므로, 최신 날짜를 가져오기 위해 순회
    const solvedSet = new Set(); // { quizId }

    solvedHistory.forEach(h => {
      const quiz = quizzes.find(q => q.id === h.quiz_id);
      if (quiz) {
        const cat = quiz.category || '기타';
        if (categories[cat]) {
          // 해당 퀴즈를 처음 푼 기록만 카운트 (또는 가장 최근 기록으로 날짜 갱신)
          // 여기서는 간단하게: solvedHistory에 있는 모든 유니크 퀴즈를 카운트
          if (!solvedSet.has(h.quiz_id)) {
            solvedSet.add(h.quiz_id);
            categories[cat].solved += 1;

            // 마지막 해결 날짜 갱신
            if (!categories[cat].lastSolvedAt || new Date(h.solved_at) > new Date(categories[cat].lastSolvedAt)) {
              categories[cat].lastSolvedAt = h.solved_at;
            }
          }
        }
      }
    });

    // 완료된 카테고리 필터링
    return Object.keys(categories)
      .filter(cat => categories[cat].total > 0 && categories[cat].solved === categories[cat].total)
      .map(cat => ({
        category: cat,
        date: categories[cat].lastSolvedAt ? categories[cat].lastSolvedAt.split('T')[0] : new Date().toISOString().split('T')[0]
      }));
  }, [quizzes, solvedHistory]);

  if (certificates.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm mb-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-yellow-500" />
        내 수료증
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certificates.map((cert, idx) => (
          <div
            key={idx}
            onClick={() => onViewCertificate(cert)}
            className="flex items-center gap-4 p-4 rounded-xl border border-yellow-200 dark:border-yellow-900/30 bg-yellow-50 dark:bg-yellow-900/10 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">{cert.category} 마스터</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{cert.date} 취득</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// ----------------------------------------------------------------------
// 🚀 Main Dashboard View
// ----------------------------------------------------------------------
export default function DashboardView({ userProfile, solvedHistory, quizzes, onViewCertificate }) {
  // 통계 계산
  const totalSolved = userProfile?.total_solved || 0;
  const totalXP = userProfile?.total_xp || 0;
  const currentStreak = userProfile?.streak || 0;

  // 정답률 계산 (전체)
  // solvedHistory에 points_earned가 있으므로, 만점 여부로 정답률 추산 가능
  // 또는 단순히 푼 문제 수 대비 획득 점수 비율로 계산
  const totalPossiblePoints = solvedHistory.reduce((acc, h) => {
    const quiz = quizzes.find(q => q.id === h.quiz_id);
    return acc + (quiz ? quiz.points : 0);
  }, 0);
  const totalEarnedPoints = solvedHistory.reduce((acc, h) => acc + (h.points_earned || 0), 0);
  const accuracy = totalPossiblePoints > 0 ? Math.round((totalEarnedPoints / totalPossiblePoints) * 100) : 0;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            종합 분석 대시보드
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">나의 학습 현황을 한눈에 확인하세요.</p>
        </div>
      </div>

      {/* 1. 핵심 지표 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="총 해결 문제"
          value={`${totalSolved} 개`}
          icon={CheckCircle}
          color={{ bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' }}
        />
        <StatCard
          title="총 획득 XP"
          value={`${totalXP.toLocaleString()} XP`}
          icon={Zap}
          color={{ bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' }}
        />
        <StatCard
          title="현재 연속 학습"
          value={`${currentStreak} 일`}
          icon={TrendingUp}
          color={{ bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' }}
          subtext="Keep going!"
        />
        <StatCard
          title="평균 정답률"
          value={`${accuracy}% `}
          icon={Target}
          color={{ bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' }}
        />
      </div>

      {/* 🚀 [NEW] Certificates Section */}
      <CertificatesSection
        quizzes={quizzes}
        solvedHistory={solvedHistory}
        onViewCertificate={onViewCertificate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. 능력치 레이더 차트 */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Radar className="w-5 h-5 text-blue-500" />
            학습 능력치 분석
          </h3>
          <AbilityRadar solvedHistory={solvedHistory} quizzes={quizzes} />
        </div>

        {/* 3. 최근 활동 로그 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            최근 학습 기록
          </h3>
          <RecentActivity solvedHistory={solvedHistory} quizzes={quizzes} />
        </div>
      </div>

      {/* 4. 스트릭 캘린더 (GitHub Style) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-500" />
          학습 잔디 심기
        </h3>
        <StreakCalendar solvedHistory={solvedHistory} />
      </div>
    </div>
  );
}
