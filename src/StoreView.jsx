import React, { useState } from 'react';
import {
    ShoppingBag, Check, Lock, Coins, Palette, User,
    Bot, Ghost, Smile, Zap, Crown, Flame, Star, Heart,
    Shield, Skull, Sun, Moon, Cloud, Umbrella
} from 'lucide-react';

// ----------------------------------------------------------------------
// 🛍️ [Data] 상점 아이템 목록
// ----------------------------------------------------------------------

const BASE_URL = import.meta.env.BASE_URL;

export const STORE_ITEMS = [
    // --- 아바타 (이미지/GIF) ---
    // --- 아바타 (이미지/GIF) ---
    { id: 'avatar_gif_3', type: 'avatar', name: '파티 타임', cost: 0, imageSrc: `${BASE_URL}avatars/third_avatar.gif` },
    { id: 'avatar_gif_1', type: 'avatar', name: '댄싱 머신', cost: 1500, imageSrc: `${BASE_URL}avatars/first_avatar.gif` },
    { id: 'avatar_gif_2', type: 'avatar', name: '쿨한 등장', cost: 2500, imageSrc: `${BASE_URL}avatars/second_avatar.gif` },
    { id: 'avatar_gif_4', type: 'avatar', name: '슈퍼 스타', cost: 4500, imageSrc: `${BASE_URL}avatars/fourth_avatar.gif` },

    // --- 테마 (색상) ---
    { id: 'theme_blue', type: 'theme', name: '오션 블루', cost: 0, color: 'blue' },
    { id: 'theme_red', type: 'theme', name: '패션 레드', cost: 500, color: 'red' },
    { id: 'theme_green', type: 'theme', name: '포레스트 그린', cost: 500, color: 'green' },
    { id: 'theme_purple', type: 'theme', name: '로얄 퍼플', cost: 1000, color: 'purple' },
    { id: 'theme_orange', type: 'theme', name: '선셋 오렌지', cost: 1000, color: 'orange' },
];

const ICON_MAP = {
    Bot, Ghost, Smile, Zap, Crown, Flame, Star, Heart, Shield, Skull, Sun, Moon, Cloud, Umbrella
};

// ----------------------------------------------------------------------
// 🏪 [Component] StoreView
// ----------------------------------------------------------------------
export default function StoreView({ userProfile, onBuy, onEquip }) {
    const [activeTab, setActiveTab] = useState('avatar'); // 'avatar' | 'theme'

    const unlockedItems = userProfile?.unlocked_items || [];
    const currentXP = userProfile?.total_xp || 0;
    const equippedAvatar = userProfile?.equipped_avatar || 'avatar_gif_3';
    const equippedTheme = userProfile?.equipped_theme || 'theme_blue';

    const filteredItems = STORE_ITEMS.filter(item => item.type === activeTab);

    return (
        <div className="max-w-4xl mx-auto animate-fade-in pb-20">
            {/* 헤더 */}
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <ShoppingBag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    XP 상점
                </h2>
                <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm">
                    <Coins className="w-5 h-5" />
                    {currentXP.toLocaleString()} XP
                </div>
            </div>

            {/* 탭 메뉴 */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('avatar')}
                    className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'avatar' ? 'bg-white dark:bg-gray-800 shadow-md text-blue-600 dark:text-blue-400 ring-2 ring-blue-500' : 'bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                    <User className="w-5 h-5" /> 아바타
                </button>
                <button
                    onClick={() => setActiveTab('theme')}
                    className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'theme' ? 'bg-white dark:bg-gray-800 shadow-md text-purple-600 dark:text-purple-400 ring-2 ring-purple-500' : 'bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                    <Palette className="w-5 h-5" /> 테마
                </button>
            </div>

            {/* 아이템 그리드 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map(item => {
                    const isOwned = unlockedItems.includes(item.id) || item.cost === 0;
                    const isEquipped = item.type === 'avatar' ? equippedAvatar === item.id : equippedTheme === item.id;
                    const canBuy = currentXP >= item.cost;
                    const IconComponent = ICON_MAP[item.icon] || Bot;

                    return (
                        <div key={item.id} className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 flex flex-col items-center relative transition-all ${isEquipped ? 'border-blue-500 shadow-lg scale-105 z-10' : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>

                            {isEquipped && (
                                <div className="absolute top-3 right-3 text-blue-500">
                                    <Check className="w-5 h-5" />
                                </div>
                            )}

                            <div className="mb-4">
                                {item.type === 'avatar' ? (
                                    <div className={`w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 overflow-hidden ${isEquipped ? 'ring-4 ring-blue-100 dark:ring-blue-900' : ''}`}>
                                        {/* 🚀 [Updated] 이미지 자산 지원 */}
                                        {item.imageSrc ? (
                                            <img src={item.imageSrc} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <IconComponent className="w-8 h-8" />
                                        )}
                                    </div>
                                ) : (
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-inner bg-gradient-to-br from-${item.color}-400 to-${item.color}-600`}>
                                        <div className="w-6 h-6 bg-white rounded-full opacity-30"></div>
                                    </div>
                                )}
                            </div>

                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-medium">
                                {item.cost === 0 ? '기본 제공' : `${item.cost.toLocaleString()} XP`}
                            </p>

                            {isOwned ? (
                                <button
                                    onClick={() => onEquip(item)}
                                    disabled={isEquipped}
                                    className={`w-full py-2 rounded-xl font-bold text-sm transition-colors ${isEquipped ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-default' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50'}`}
                                >
                                    {isEquipped ? '장착 중' : '장착하기'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => onBuy(item)}
                                    disabled={!canBuy}
                                    className={`w-full py-2 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-1 ${canBuy ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                                >
                                    {canBuy ? (
                                        <>
                                            <Coins className="w-3 h-3" /> 구매하기
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-3 h-3" /> 잠김
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
