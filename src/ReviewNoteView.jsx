import React, { useState, useMemo } from 'react';
import {
    BookOpen, RefreshCw, ChevronRight, AlertCircle, CheckCircle,
    ArrowLeft, Brain, Star
} from 'lucide-react';

export default function ReviewNoteView({ userProfile, wrongAnswers, quizzes, onRetry }) {
    // wrongAnswers: { quizId: [questionId, ...], ... }

    const wrongQuizzes = useMemo(() => {
        if (!wrongAnswers) return [];

        return Object.keys(wrongAnswers)
            .map(quizId => {
                const quiz = quizzes.find(q => q.id === quizId);
                if (!quiz) return null;

                const wrongIds = wrongAnswers[quizId] || [];
                if (wrongIds.length === 0) return null;

                return {
                    ...quiz,
                    wrongCount: wrongIds.length,
                    wrongIds: wrongIds
                };
            })
            .filter(Boolean);
    }, [wrongAnswers, quizzes]);

    if (wrongQuizzes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    오답 노트가 비어있습니다!
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    완벽합니다! 틀린 문제가 없거나, 모든 오답을 해결하셨군요.
                    <br />새로운 퀴즈에 도전해보세요!
                </p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-8 h-8 text-red-500" />
                    오답 노트
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    틀린 문제를 다시 풀고 약점을 보완하세요.
                </p>
            </div>

            <div className="grid gap-4">
                {wrongQuizzes.map(quiz => (
                    <div
                        key={quiz.id}
                        className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300">
                                    {quiz.category}
                                </span>
                                <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 dark:bg-red-900/20 text-xs font-bold text-red-600 dark:text-red-400">
                                    <AlertCircle className="w-3 h-3" /> {quiz.wrongCount}문제 틀림
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                {quiz.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                {quiz.description}
                            </p>
                        </div>

                        <button
                            onClick={() => onRetry(quiz.id, quiz.wrongIds)}
                            className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            다시 풀기
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
