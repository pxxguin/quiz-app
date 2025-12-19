import React, { useRef, useState } from 'react';
import { Award, Download, ArrowLeft, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function CertificateView({ userProfile, category, date, onBack }) {
    const certificateRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!certificateRef.current) return;

        try {
            setIsDownloading(true);

            // 1. 캡처 옵션 설정 (고해상도)
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2, // 2배 해상도로 캡처
                backgroundColor: '#ffffff', // 흰색 배경 강제
                logging: false,
                useCORS: true
            });

            // 2. 이미지 데이터 생성
            const image = canvas.toDataURL('image/png');

            // 3. 다운로드 링크 생성 및 클릭
            const link = document.createElement('a');
            link.href = image;
            link.download = `Certificate-${category}-${userProfile?.nickname || 'User'}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Certificate download failed:', error);
            alert('수료증 저장 중 오류가 발생했습니다.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="animate-fade-in min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 relative">
            <button
                onClick={onBack}
                className="absolute top-8 left-8 text-white/70 hover:text-white flex items-center gap-2 transition-colors print:hidden"
            >
                <ArrowLeft className="w-6 h-6" /> 돌아가기
            </button>

            <div className="mb-8 text-center print:hidden">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 mb-2">
                    축하합니다! 🎉
                </h1>
                <p className="text-gray-400">
                    '{category}' 카테고리를 마스터하셨습니다.
                </p>
            </div>

            {/* Certificate Card - Google Cloud Style */}
            <div
                ref={certificateRef}
                className="bg-white text-gray-900 w-full max-w-5xl aspect-[1.414/1] shadow-2xl relative flex flex-col items-center p-8 overflow-hidden print:shadow-none print:w-full print:h-full print:max-w-none print:rounded-none"
            >
                {/* Blue Border */}
                <div className="absolute inset-4 border-[6px] border-[#4285F4] pointer-events-none"></div>

                {/* Top Logo */}
                <div className="mt-2 mb-2 z-10">
                    <div className="flex flex-col items-center">
                        <span className="font-script text-7xl md:text-8xl text-[#4285F4]">AI Atlas</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center w-full z-10 text-center space-y-3">
                    <p className="text-lg md:text-xl text-gray-600">
                        This acknowledges that
                    </p>

                    <h2 className="text-5xl md:text-7xl font-bold text-gray-900 font-serif tracking-tight">
                        {userProfile?.nickname || 'Guest User'}
                    </h2>

                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        has successfully completed all the requirements to be recognized as a
                    </p>

                    <div className="space-y-1">
                        <p className="text-xs md:text-sm font-bold text-gray-500 tracking-[0.2em] uppercase">
                            AI ATLAS CERTIFIED
                        </p>
                        <h3 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
                            {category} Master
                        </h3>
                    </div>
                </div>

                {/* Footer Section (Grid Layout) */}
                <div className="w-full grid grid-cols-3 items-end z-10 mt-4">
                    {/* Left: Details */}
                    <div className="text-left text-xs md:text-sm text-gray-500 space-y-0.5 pl-4">
                        <p><span className="font-semibold">Issue Date:</span> {date}</p>
                        <p><span className="font-semibold">Expiration:</span> Permanent</p>
                        <p><span className="font-semibold">ID:</span> {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                    </div>

                    {/* Center: Signature */}
                    <div className="flex flex-col items-center justify-end pb-1">
                        <div className="font-script text-5xl md:text-6xl text-gray-800 mb-1 transform -rotate-6">
                            Hongseo
                        </div>
                        <div className="h-px w-48 bg-gray-800 mb-1"></div>
                        <p className="text-base font-bold text-gray-800">
                            Hongseo
                        </p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                            CEO, AI Atlas
                        </p>
                    </div>

                    {/* Right: Badge */}
                    <div className="flex justify-end pr-4">
                        <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
                            {/* Badge SVG */}
                            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-white relative overflow-hidden border-4 border-[#FBBC04] shadow-lg">
                                <div className="absolute inset-0 bg-[#4285F4] opacity-10"></div>
                                <div className="text-center z-10 transform scale-90">
                                    <div className="text-[8px] uppercase tracking-widest mb-1 text-[#FBBC04]">AI Atlas</div>
                                    <ShieldCheck className="w-10 h-10 mx-auto mb-1 text-white" />
                                    <div className="text-[8px] font-bold uppercase text-white">Certified</div>
                                </div>
                                {/* Ring Text */}
                                <svg className="absolute w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                                    <path
                                        id="curve"
                                        d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                                        fill="transparent"
                                    />
                                    <text className="text-[11px] uppercase font-bold fill-white tracking-[0.18em]">
                                        <textPath xlinkHref="#curve">
                                            • Professional • Master •
                                        </textPath>
                                    </text>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none opacity-50"></div>
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#4285F4] rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#EA4335] rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
            </div>

            <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="mt-8 px-8 py-4 bg-[#4285F4] hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-full font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed print:hidden"
            >
                {isDownloading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        이미지 생성 중...
                    </>
                ) : (
                    <>
                        <Download className="w-5 h-5" />
                        이미지로 저장하기
                    </>
                )}
            </button>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
                .font-script { font-family: 'Dancing Script', cursive; }
                .animate-spin-slow { animation: spin 20s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .print\\:rounded-none { border-radius: 0 !important; }
        }
      `}</style>
        </div>
    );
}
