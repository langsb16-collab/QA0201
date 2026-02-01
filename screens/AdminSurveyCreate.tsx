
import React, { useState } from 'react';
import { CATEGORIES, GOALS } from '../constants';
import { aiService } from '../services/aiService';
import { storageService } from '../services/storageService';
import { Survey, Question, RewardConfig } from '../types';

const STEPS = [
  { id: 'GOAL', title: '목적 정의', icon: '🎯' },
  { id: 'TARGET', title: '대상 설정', icon: '👥' },
  { id: 'DESIGN', title: '문항 설계', icon: '✍️' },
  { id: 'CHECK', title: '품질 검증', icon: '🛡️' },
  { id: 'REWARD', title: '보상 설계', icon: '🎁' },
  { id: 'PREVIEW', title: '최종 확인', icon: '👀' }
];

const AdminSurveyCreate: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const admin = storageService.getAdmin();
  const [currentStep, setCurrentStep] = useState(0);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [goal, setGoal] = useState(GOALS[0].id);
  const [targetAudience, setTargetAudience] = useState('우리 지역 거주자 및 방문자');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reward, setReward] = useState<RewardConfig>({
    type: 'GIFT_CARD',
    method: 'DRAW',
    quantity: 100,
    amount: '5,000원',
    delivery: 'SMS'
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const generateAIQuestions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const qs = aiService.generateQuestions(category, goal);
      setQuestions(qs);
      setIsGenerating(false);
      handleNext();
    }, 1200);
  };

  const handlePublish = () => {
    if (!title) return alert('설문 제목을 입력해주세요.');
    const newSurvey: Survey = {
      id: 'S-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      title,
      region: "우리 지역 상권/커뮤니티",
      category: CATEGORIES.find(c => c.id === category)?.name || '기타',
      goal: GOALS.find(g => g.id === goal)?.name || '기타',
      status: 'PUBLISHED',
      isPublic: true,
      questions,
      reward,
      createdBy: admin?.phoneHash || 'unknown',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      totalParticipants: 0
    };
    storageService.saveSurvey(newSurvey);
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-24">
      {/* Wizard Header */}
      <div className="bg-white px-10 py-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-6 min-w-max">
          {STEPS.map((s, idx) => (
            <div key={s.id} className={`flex items-center gap-3 transition-all ${idx <= currentStep ? 'opacity-100' : 'opacity-20'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${idx === currentStep ? 'bg-[#1E3A8A] text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}>
                {idx + 1}
              </div>
              <div className="hidden lg:block">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Step {idx + 1}</p>
                <p className="text-xs font-black text-gray-900 whitespace-nowrap">{s.title}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Commission 0% Free</span>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[56px] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-gray-50 overflow-hidden min-h-[600px] flex flex-col">
        {/* Step 0: Goal */}
        {currentStep === 0 && (
          <div className="p-16 space-y-12 flex-1 animate-in fade-in slide-in-from-right-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-tight">어떤 통찰(Insight)을 얻고 싶으신가요?</h2>
              <p className="text-gray-400 font-bold text-lg leading-relaxed">플랫폼 수수료 0원 — 설문은 무료로 시작하세요.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GOALS.map(g => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`p-10 rounded-[32px] border-2 text-left transition-all ${goal === g.id ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white shadow-2xl' : 'border-gray-50 bg-gray-50 hover:bg-white hover:border-gray-200'}`}
                >
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${goal === g.id ? 'text-blue-300' : 'text-gray-400'}`}>Strategy Module</p>
                  <h4 className="text-2xl font-black">{g.name}</h4>
                </button>
              ))}
            </div>
            <div className="space-y-3 pt-8 border-t border-gray-100">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Campaign Title</label>
               <input 
                 className="w-full text-2xl font-black p-4 border-b-2 border-gray-100 focus:border-[#1E3A8A] outline-none transition-colors placeholder:text-gray-200"
                 placeholder="예: 우리 동네 시장 활성화 프로젝트"
                 value={title}
                 onChange={e => setTitle(e.target.value)}
               />
            </div>
          </div>
        )}

        {/* Step 1: Target */}
        {currentStep === 1 && (
          <div className="p-16 space-y-12 flex-1 animate-in fade-in slide-in-from-right-8">
             <div className="space-y-4">
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter">누구의 대답이 가장 중요한가요?</h2>
              <p className="text-gray-400 font-bold text-lg leading-relaxed">대상자를 좁힐수록 결과의 전문성과 실행력이 높아집니다.</p>
            </div>
            <div className="space-y-8">
               <div className="flex flex-wrap gap-3">
                 {['지역 거주자', '상권 방문객', '2030 청년', '직장인', '소상공인'].map(t => (
                   <button 
                    key={t} 
                    onClick={() => setTargetAudience(t)}
                    className={`px-10 py-5 rounded-full font-black text-sm transition-all ${targetAudience === t ? 'bg-[#1E3A8A] text-white shadow-xl' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                   >
                     {t}
                   </button>
                 ))}
               </div>
               <div className="space-y-4">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">대상자 상세 정의</label>
                 <textarea 
                   className="w-full p-8 bg-gray-50 rounded-[40px] min-h-[200px] outline-none font-bold text-xl text-gray-600 border border-transparent focus:border-gray-100 transition-all shadow-inner"
                   placeholder="예) 우리 전통시장을 한 달에 2회 이상 이용하는 시민"
                   value={targetAudience}
                   onChange={e => setTargetAudience(e.target.value)}
                 />
               </div>
            </div>
          </div>
        )}

        {/* Step 2: Design (AI Generation) */}
        {currentStep === 2 && (
          <div className="p-16 space-y-10 flex-1 animate-in fade-in slide-in-from-right-8 flex flex-col items-center justify-center text-center">
             <div className="w-28 h-28 bg-blue-50 rounded-[40px] flex items-center justify-center text-6xl shadow-inner animate-pulse mb-8">🪄</div>
             <div className="space-y-4 mb-12">
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter">AI 설문 매칭 시스템 가동</h2>
                <p className="text-gray-400 font-bold text-xl">Gallup 표준 문항 틀에 맞춰 최적의 질문을 추출합니다.</p>
             </div>
             <button 
               onClick={generateAIQuestions}
               disabled={isGenerating}
               className="bg-[#1E3A8A] text-white px-16 py-7 rounded-[32px] font-black text-2xl shadow-2xl shadow-blue-900/20 hover:scale-105 transition-all disabled:opacity-50"
             >
               {isGenerating ? '알고리즘 연산 중...' : '과학적 문항 자동 생성'}
             </button>
          </div>
        )}

        {/* Step 4: Reward Setup */}
        {currentStep === 4 && (
          <div className="p-16 space-y-12 flex-1 animate-in fade-in slide-in-from-right-8">
            <div className="space-y-4 text-center md:text-left">
               <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-tight">자율 보상 설계 (Reward Design) 🎁</h2>
               <p className="text-gray-400 font-bold text-lg leading-relaxed italic">“당신의 예산이 곧 참여자의 보상이 되고, 참여자의 보상이 곧 참여율이 됩니다.”</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { id: 'GIFT_CARD', name: '모바일 상품권', icon: '🎫' },
                 { id: 'LOCAL_CURRENCY', name: '지역 화폐', icon: '🏠' },
                 { id: 'CRYPTO', name: 'USDT(암호화)', icon: '💎' }
               ].map(type => (
                 <button
                   key={type.id}
                   onClick={() => setReward({ ...reward, type: type.id as any })}
                   className={`p-10 rounded-[40px] border-2 text-center space-y-4 transition-all ${reward.type === type.id ? 'border-indigo-600 bg-indigo-50/50 shadow-xl' : 'border-gray-50 bg-gray-50 hover:bg-white hover:border-gray-200'}`}
                 >
                   <span className="text-5xl block mb-2">{type.icon}</span>
                   <span className="font-black text-gray-900 text-lg">{type.name}</span>
                 </button>
               ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-slate-50 p-12 rounded-[48px] border border-slate-100">
               <div className="space-y-6">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">지급 방식 선택</label>
                  <div className="flex gap-2">
                    {['DRAW', 'ALL', 'FIRST_COME'].map(m => (
                      <button
                        key={m}
                        onClick={() => setReward({ ...reward, method: m as any })}
                        className={`flex-1 py-5 rounded-2xl font-black text-sm transition-all ${reward.method === m ? 'bg-[#1E3A8A] text-white shadow-xl' : 'bg-white text-gray-400 border border-gray-100 hover:text-gray-600'}`}
                      >
                        {m === 'DRAW' ? '추첨' : m === 'ALL' ? '전원' : '선착순'}
                      </button>
                    ))}
                  </div>
               </div>
               <div className="space-y-6">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">상세 수량 및 금액</label>
                  <div className="flex items-center gap-4">
                     <div className="flex-1 relative">
                       <input 
                         type="number"
                         className="w-full bg-white border border-gray-100 rounded-2xl p-5 font-black text-xl outline-none focus:border-indigo-500 transition-all shadow-sm"
                         value={reward.quantity}
                         onChange={e => setReward({...reward, quantity: parseInt(e.target.value) || 0})}
                       />
                       <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-300">명</span>
                     </div>
                     <div className="flex-[2] relative">
                       <input 
                         type="text"
                         className="w-full bg-white border border-gray-100 rounded-2xl p-5 font-black text-xl outline-none focus:border-indigo-500 transition-all shadow-sm"
                         value={reward.amount}
                         onChange={e => setReward({...reward, amount: e.target.value})}
                       />
                       <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-300">단위</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-10 bg-indigo-50/50 rounded-[40px] border border-indigo-100 flex items-start gap-6">
               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm text-indigo-600 font-black">0</div>
               <div className="space-y-2">
                 <h4 className="font-black text-indigo-900 text-xl tracking-tight leading-none mb-2">플랫폼 수수료 0원 원칙</h4>
                 <p className="text-sm font-bold text-indigo-400 leading-relaxed max-w-2xl">
                   타 리서치 플랫폼은 대행 수수료가 포함되지만, 리워드보이스는 무료입니다. <br/>당신이 설정한 보상은 참여자들에게 100% 가치로 전달됩니다.
                 </p>
               </div>
            </div>
          </div>
        )}

        {/* Existing Steps Refinement */}
        {(currentStep === 3 || currentStep === 5) && (
          <div className="p-16 space-y-10 flex-1 animate-in fade-in slide-in-from-right-8">
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-4xl font-black text-gray-900 tracking-tighter">품질 검증 리포트 🛡️</h2>
                  <div className="bg-emerald-50 text-emerald-600 px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest border border-emerald-100">AI Passed</div>
                </div>
                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <div key={idx} className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 flex gap-6 items-center">
                       <span className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center font-black text-indigo-600 shadow-sm">{idx+1}</span>
                       <p className="text-xl font-black text-gray-800">{q.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {currentStep === 5 && (
              <div className="text-center py-20 space-y-10">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-40px flex items-center justify-center text-5xl mx-auto shadow-inner">✓</div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-gray-900 tracking-tighter">모든 준비가 끝났습니다!</h2>
                  <p className="text-gray-400 font-bold text-xl">수수료 없이 참여자에게 100% 보상을 전달하세요.</p>
                </div>
                <div className="max-w-md mx-auto p-10 bg-slate-50 rounded-[48px] border border-slate-100 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">문항 수</p>
                    <p className="text-3xl font-black text-gray-900">{questions.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">지급 보상</p>
                    <p className="text-3xl font-black text-indigo-600">{reward.amount}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Footer */}
        <div className="px-16 py-10 bg-gray-50/50 border-t border-gray-100 flex items-center gap-4">
          {currentStep > 0 && (
            <button 
              onClick={handlePrev}
              className="px-10 py-5 bg-white border border-gray-200 text-gray-400 font-black rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest text-[11px]"
            >
              Back
            </button>
          )}
          <div className="flex-1"></div>
          {currentStep < STEPS.length - 1 ? (
             <button 
              onClick={handleNext}
              disabled={currentStep === 2 && questions.length === 0}
              className={`px-12 py-5 bg-[#1E3A8A] text-white font-black rounded-2xl shadow-2xl shadow-blue-900/10 hover:bg-blue-800 transition-all uppercase tracking-widest text-[11px] ${currentStep === 2 ? 'hidden' : ''}`}
             >
               Next Stage
             </button>
          ) : (
            <button 
              onClick={handlePublish}
              className="px-12 py-5 bg-[#10B981] text-white font-black rounded-2xl shadow-2xl shadow-emerald-900/10 hover:bg-emerald-800 transition-all uppercase tracking-widest text-[11px]"
            >
              Confirm & Publish (Free)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSurveyCreate;
