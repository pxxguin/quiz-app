import React, { useMemo } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  Tooltip
} from 'recharts';
import {
  Trophy, Target, Flame, Calendar, Clock, ArrowUp, ArrowRight,
  Brain, Activity, Star, Zap
} from 'lucide-react';

// ----------------------------------------------------------------------
// 📊 Stats Summary Card
// ----------------------------------------------------------------------
const StatCard = ({ title, value, subValue, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${color.bg} ${color.text}`}>
        <Icon className="w-6 h-6" />
      </div>
      {subValue && (
        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
          <ArrowUp className="w-3 h-3" /> {subValue}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-black text-gray-900 dark:text-white">{value}</div>
    </div>
  </div>
);

// ----------------------------------------------------------------------
// 🕸️ Radar Chart (Ability Analysis)
// ----------------------------------------------------------------------
const AbilityRadar = ({ solvedHistory, quizzes }) => {
  const data = useMemo(() => {
    const categories = {};

    // 1. 카테고리별 퀴즈 수집
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

  if (data.length < 3) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
        <Brain className="w-12 h-12 mb-2 opacity-50" />
        <p>데이터가 부족합니다.</p>
        <p className="text-xs">3개 이상의 카테고리 문제를 풀어보세요!</p>
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="성취도"
            dataKey="A"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="#3b82f6"
            fillOpacity={0.3}
          />
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ----------------------------------------------------------------------
// 📅 Streak Calendar (GitHub Style)
// ----------------------------------------------------------------------
const StreakCalendar = ({ solvedHistory }) => {
  // 최근 365일 (또는 6개월) 데이터 생성
  const weeks = useMemo(() => {
    const today = new Date();
    const data = [];
    // 20주 전부터 표시
    for (let i = 19; i >= 0; i--) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        const d = new Date(today);
        d.setDate(today.getDate() - (i * 7 + (6 - j)));
        const dateStr = d.toISOString().split('T')[0];

        // 해당 날짜의 푼 문제 수
        const count = solvedHistory.filter(h => h.solved_at?.startsWith(dateStr)).length;

        let level = 0;
        if (count > 0) level = 1;
        if (count > 2) level = 2;
        if (count > 4) level = 3;
        if (count > 6) level = 4;

        week.push({ date: dateStr, count, level });
      }
      data.push(week);
    }
    return data;
  }, [solvedHistory]);

  const getLevelColor = (level) => {
    switch (level) {
      case 0: return 'bg-gray-100 dark:bg-gray-800';
      case 1: return 'bg-green-200 dark:bg-green-900/40';
      case 2: return 'bg-green-300 dark:bg-green-800/60';
      case 3: return 'bg-green-400 dark:bg-green-700/80';
      case 4: return 'bg-green-500 dark:bg-green-600';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="flex gap-1 overflow-x-auto pb-2">
      {weeks.map((week, wIdx) => (
        <div key={wIdx} className="flex flex-col gap-1">
          {week.map((day, dIdx) => (
            <div
              key={day.date}
              title={`${day.date}: ${day.count} 문제 해결`}
              className={`w-3 h-3 rounded-sm ${getLevelColor(day.level)} transition-colors hover:ring-1 ring-gray-400`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// ----------------------------------------------------------------------
// 🚀 Main Dashboard Component
// ----------------------------------------------------------------------
export default function DashboardView({ userProfile, solvedHistory, quizzes }) {
  // 통계 계산
  const totalSolved = userProfile?.total_solved || 0;
  const totalXP = userProfile?.total_xp || 0;
  const currentStreak = userProfile?.streak || 0;

  // 정답률 (단순화: 푼 문제 수 / 시도한 문제 수인데, 현재 시도 기록이 없으므로 전체 퀴즈 대비 진행률로 대체하거나 100%로 가정)
  // 여기서는 '전체 퀴즈 중 해결 비율'로 표시
  const completionRate = Math.round((totalSolved / Math.max(quizzes.length, 1)) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Activity className="w-8 h-8 text-blue-600" />
          종합 분석 대시보드
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          나의 학습 데이터를 시각적으로 분석합니다.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="총 획득 XP"
          value={totalXP.toLocaleString()}
          icon={Zap}
          color={{ bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' }}
        />
        <StatCard
          title="해결한 문제"
          value={`${totalSolved}개`}
          subValue={`상위 ${completionRate}%`}
          icon={Trophy}
          color={{ bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' }}
        />
        <StatCard
          title="현재 연속 학습"
          value={`${currentStreak}일`}
          icon={Flame}
          color={{ bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' }}
        />
        <StatCard
          title="학습 완료율"
          value={`${completionRate}%`}
          icon={Target}
          color={{ bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Chart Section */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            학습 성취도 분석
          </h3>
          <AbilityRadar solvedHistory={solvedHistory} quizzes={quizzes} />
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              각 카테고리별 문제 해결 비율을 보여줍니다.
            </p>
          </div>
        </div>

        {/* Streak & Recent Activity Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Streak Calendar */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500" />
                학습 잔디 (Recent 20 Weeks)
              </h3>
              <span className="text-xs font-medium text-gray-400">
                Less <span className="inline-block w-2 h-2 bg-gray-200 rounded-sm mx-1"></span>
                <span className="inline-block w-2 h-2 bg-green-500 rounded-sm mx-1"></span> More
              </span>
            </div>
            <StreakCalendar solvedHistory={solvedHistory} />
          </div>

          {/* Recent Activity List */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              최근 활동
            </h3>
            <div className="space-y-3">
              {solvedHistory.slice().reverse().slice(0, 5).map((history, idx) => {
                const quiz = quizzes.find(q => q.id === history.quiz_id);
                return (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Star className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                          {quiz ? quiz.title : '삭제된 퀴즈'}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(history.solved_at).toLocaleDateString()} • {history.points_earned} XP 획득
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                );
              })}
              {solvedHistory.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  아직 활동 기록이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
