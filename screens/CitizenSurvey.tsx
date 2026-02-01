
import React, { useState, useEffect } from 'react';
import { AGE_GROUPS, GENDERS, TIME_BUCKETS, APP_SLOGAN } from '../constants';
import { storageService } from '../services/storageService';
import { SurveyResponse, Survey, Question } from '../types';

const CitizenSurvey: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null);
  const [step, setStep] = useState(0); 
  const [userInfo, setUserInfo] = useState({ age: '', gender: '' });
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [rewardAddress, setRewardAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  useEffect(() => {
    const s = storageService.getActiveSurvey();
    if (s) {
      setActiveSurvey(s);
      if (storageService.hasParticipated(s.id)) {
        setAlreadyVoted(true);
        storageService.recordBlockedAttempt(s.id);
      }
    }
  }, []);

  const getFilteredQuestions = () => {
    if (!activeSurvey) return [];
    return activeSurvey.questions.filter(q => {
      if (!q.branchingRule) return true;
      const dependValue = answers[q.branchingRule.dependsOn];
      return dependValue === q.branchingRule.equals;
    });
  };

  const currentQuestions = getFilteredQuestions();
  const totalQuestions = currentQuestions.length;
  
  const handleNext = () => {
    if (step <= totalQuestions) setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!activeSurvey) return;
    setIsSubmitting(true);
    const timeBucket = TIME_BUCKETS[Math.floor(Math.random() * TIME_BUCKETS.length)];
    const response: SurveyResponse = {
      id: Math.random().toString(36).substr(2, 9),
      surveyId: activeSurvey.id,
      timestamp: Date.now(),
      answers,
      rewardAddress: activeSurvey.reward?.type === 'CRYPTO' ? rewardAddress : undefined,
      metadata: { 
        ageGroup: userInfo.age, 
        gender: userInfo.gender, 
        timeBucket,
        fingerprint: storageService.getFingerprint()
      }
    };
    storageService.saveResponse(response);
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete();
    }, 1500);
  };

  if (alreadyVoted) return <div className="text-center py-48 animate-in zoom-in-95 duration-700">
    <div className="text-7xl mb-10">🚫</div>
    <h2 className="text-4xl font-black text-gray-900 tracking-tighter">이미 참여하셨습니다.</h2>
    <p className="text-gray-400 font-bold mt-4">데이터 무결성을 위해 중복 참여는 제한됩니다.</p>
  </div>;
  
  if (!activeSurvey) return <div className="text-center py-48 animate-pulse">
    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Loading Active Campaign</p>
  </div>;

  // Step 0: Intro & Reward
  if (step === 0) {
    const reward = activeSurvey.reward;
    return (
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
        <div className="bg-white p-12 md:p-16 rounded-[64px] shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-slate-50 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-3 bg-indigo-600"></div>
          <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">참여에는 반드시 가치가 따릅니다</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 tracking-tighter leading-[1.1]">{activeSurvey.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-left space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  이 설문은 참여자에게 <br/>
                  <span className="text-indigo-600">보상이 제공됩니다.</span>
                </h3>
                <p className="text-sm font-bold text-slate-400 leading-relaxed">
                  당신의 시간과 의견은 가치 있는 행동입니다. <br/>
                  의견을 남기면 정당한 보상이 따라오는 설문 플랫폼, 리워드보이스입니다.
                </p>
              </div>
              <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-black">✓</div>
                  <p className="text-xs font-bold text-slate-500">설문 완료 후 보상 대상이 됩니다</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-black">✓</div>
                  <p className="text-xs font-bold text-slate-500">{reward?.method === 'DRAW' ? '공정한 추첨을 통해 지급됩니다' : '유효 응답자 전원에게 지급됩니다'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-black">!</div>
                  <p className="text-xs font-bold text-slate-500">중복 참여 및 불성실 응답은 제외됩니다</p>
                </div>
              </div>
            </div>

            {reward && reward.type !== 'NONE' && (
               <div className="bg-slate-900 p-10 rounded-[48px] shadow-2xl space-y-8 relative overflow-hidden group/card text-left">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                  <div className="flex items-center justify-between relative z-10 mb-4">
                     <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-3xl shadow-inner border border-white/5">
                       {reward.type === 'CRYPTO' ? '💎' : '🎁'}
                     </div>
                     <div className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">Value Reward</div>
                  </div>
                  <div className="relative z-10 space-y-2">
                     <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Expected Benefit</p>
                     <p className="text-3xl font-black text-white tracking-tight leading-none">{reward.amount} {reward.type === 'GIFT_CARD' ? '상품권' : reward.type === 'CRYPTO' ? 'USDT' : '지역화폐'}</p>
                     <p className="text-sm font-bold text-slate-400">
                        {reward.method === 'DRAW' ? `유효 응답자 중 추첨 ${reward.quantity}명` : '정성 참여자 전원 지급'}
                     </p>
                  </div>
               </div>
            )}
          </div>
        </div>

        {/* Comparison Table Section (Participant Version) */}
        <div className="bg-white p-12 md:p-16 rounded-[64px] shadow-sm border border-slate-50 space-y-10">
          <div className="text-center space-y-3">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">당신의 의견은 그냥 지나가지 않습니다</h3>
            <p className="text-slate-400 font-bold text-lg leading-relaxed">포인트 설문은 많습니다. 하지만 가치를 돌려주는 설문은 다릅니다.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100">
                <tr>
                  <th className="py-6 font-black text-slate-300 text-[11px] uppercase tracking-widest w-1/4">비교 항목</th>
                  <th className="py-6 font-black text-slate-400 text-xs px-6">일반 설문 플랫폼</th>
                  <th className="py-6 font-black text-indigo-600 text-sm bg-indigo-50/50 px-8 rounded-t-[40px]">리워드보이스 (RewardVoice)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { item: '보상 가치', old: '체감 낮은 소액 포인트', new: '1,000~5,000원급 실질 가치' },
                  { item: '보상 활용', old: '복잡한 포인트 교환 과정', new: '즉시 사용 가능한 상품권/가상자산' },
                  { item: '신뢰도', old: '지급 일정 불투명', new: '투명한 추첨 및 지급 현황 공개' },
                  { item: '참여 보람', old: '단순 반복 작업 느낌', new: '지역과 상생하는 가치 있는 행동' }
                ].map((row, i) => (
                  <tr key={i} className="group">
                    <td className="py-6 font-black text-slate-500 text-xs">{row.item}</td>
                    <td className="py-6 font-medium text-slate-400 px-6">{row.old}</td>
                    <td className="py-6 font-black text-indigo-900 bg-indigo-50/30 px-8">{row.new}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-8 bg-slate-900 rounded-[40px] text-center border border-white/5 shadow-2xl shadow-indigo-100">
            <p className="text-white font-black text-xl tracking-tight italic leading-relaxed">“당신의 목소리에는 정당한 보상이 따라야 합니다.”</p>
          </div>
        </div>

        <div className="bg-white p-12 md:p-16 rounded-[64px] shadow-sm border border-slate-50 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">연령대</label>
              <select className="w-full p-8 bg-slate-50 rounded-[32px] font-black outline-none border border-transparent focus:border-indigo-600 transition-all text-xl" value={userInfo.age} onChange={e => setUserInfo({...userInfo, age: e.target.value})}>
                <option value="">나이를 선택하세요</option>
                {AGE_GROUPS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">성별</label>
              <select className="w-full p-8 bg-slate-50 rounded-[32px] font-black outline-none border border-transparent focus:border-indigo-600 transition-all text-xl" value={userInfo.gender} onChange={e => setUserInfo({...userInfo, gender: e.target.value})}>
                <option value="">성별을 선택하세요</option>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <button
            disabled={!userInfo.age || !userInfo.gender}
            onClick={handleNext}
            className="w-full bg-indigo-600 text-white py-10 rounded-[44px] font-black text-3xl shadow-2xl shadow-indigo-600/30 active:scale-[0.98] transition-all disabled:opacity-20 hover:bg-indigo-700"
          >지금 바로 참여하고 보상 받기</button>
        </div>
      </div>
    );
  }

  // Question Step
  if (step <= totalQuestions) {
    const currentQ = currentQuestions[step - 1];
    return (
      <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-500 pb-24">
        <div className="bg-white p-8 rounded-[36px] flex justify-between items-center px-12 border border-gray-100 shadow-sm">
           <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Campaign Progress</p>
              <span className="font-black text-slate-900 text-2xl tracking-tighter">{step} / {totalQuestions}</span>
           </div>
           <div className="w-64 h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
              <div className="h-full bg-indigo-600 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(79,70,229,0.4)]" style={{width: `${(step/totalQuestions)*100}%`}}></div>
           </div>
        </div>

        <div className="bg-white p-16 md:p-24 rounded-[72px] shadow-2xl border border-gray-50 min-h-[600px] flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/30 rounded-full -mr-24 -mt-24"></div>
           <div className="space-y-8 relative z-10">
              <div className="w-24 h-2.5 bg-indigo-600 rounded-full"></div>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">{currentQ.text}</h3>
           </div>

           <div className="flex-1 py-12 space-y-5 relative z-10">
              {currentQ.type === 'SINGLE_CHOICE' && currentQ.options?.map(opt => (
                <button
                  key={opt}
                  onClick={() => { setAnswers({...answers, [currentQ.id]: opt}); setTimeout(handleNext, 450); }}
                  className={`w-full text-left p-10 rounded-[40px] border-2 font-black text-2xl transition-all ${answers[currentQ.id] === opt ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xl scale-[1.03]' : 'bg-slate-50 text-slate-400 border-slate-50 hover:border-indigo-100 hover:bg-white'}`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-colors ${answers[currentQ.id] === opt ? 'border-white bg-white/20' : 'border-slate-200 bg-white'}`}>
                      {answers[currentQ.id] === opt && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                    </div>
                    {opt}
                  </div>
                </button>
              ))}
              {currentQ.type === 'TEXT' && (
                <textarea 
                  className="w-full p-12 bg-slate-50 rounded-[56px] min-h-[300px] font-bold text-2xl outline-none shadow-inner border-2 border-transparent focus:border-indigo-100 focus:bg-white transition-all placeholder:text-slate-200"
                  placeholder="당신의 소중한 의견을 들려주세요 (성의 있는 답변일수록 당첨 확률이 높아집니다)"
                  value={answers[currentQ.id] || ''}
                  onChange={e => setAnswers({...answers, [currentQ.id]: e.target.value})}
                />
              )}
           </div>

           <div className="flex gap-4 pt-10 relative z-10">
             <button onClick={handlePrev} className="px-14 py-8 bg-white border-2 border-slate-100 text-slate-400 font-black rounded-[36px] hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Previous</button>
             <button onClick={handleNext} disabled={!answers[currentQ.id]} className="flex-1 bg-slate-900 text-white py-8 rounded-[36px] font-black text-xl disabled:opacity-20 transition-all shadow-2xl shadow-black/10 hover:bg-black">Next Question</button>
           </div>
        </div>
      </div>
    );
  }

  // Wallet Address Step
  if (step === totalQuestions + 1 && activeSurvey.reward?.type === 'CRYPTO') {
     return (
       <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 pb-20">
          <div className="bg-white p-16 md:p-24 rounded-[72px] shadow-2xl border border-gray-50 text-center space-y-12">
             <div className="w-32 h-32 bg-indigo-50 text-indigo-600 rounded-[48px] flex items-center justify-center text-7xl mx-auto shadow-inner border border-white group hover:rotate-12 transition-transform">💎</div>
             <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">USDT 리워드 신청</h2>
                <p className="text-slate-400 font-bold text-xl leading-relaxed px-6">정성스러운 참여에 감사드립니다. <br/>보상 지급을 위한 {activeSurvey.reward.cryptoInfo?.network || 'TRC20'} 지갑 주소를 입력해주세요.</p>
             </div>
             <div className="space-y-3 text-left">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-6">Wallet Address (TRC20/USDT)</label>
                <input 
                  className="w-full p-10 bg-slate-50 rounded-[44px] text-center font-mono font-black text-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none transition-all shadow-inner"
                  placeholder="지갑 주소를 붙여넣으세요"
                  value={rewardAddress}
                  onChange={e => setRewardAddress(e.target.value)}
                />
             </div>
             <button
               disabled={!rewardAddress}
               onClick={handleSubmit}
               className="w-full bg-indigo-600 text-white py-10 rounded-[44px] font-black text-2xl shadow-2xl shadow-indigo-600/30 disabled:opacity-20 transition-all active:scale-[0.98] hover:bg-indigo-700"
             >{isSubmitting ? 'Finalizing Submission...' : '설문 제출 및 보상 신청'}</button>
          </div>
       </div>
     );
  }

  // Final Completion Summary
  return (
    <div className="max-w-2xl mx-auto text-center py-40 animate-in zoom-in-95 duration-800">
      <div className="w-36 h-36 bg-emerald-50 text-emerald-600 rounded-[56px] flex items-center justify-center text-7xl mx-auto mb-12 shadow-inner group hover:scale-110 transition-transform">🎉</div>
      <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-8 leading-tight">소중한 의견이 <br/>지역 사회에 전달되었습니다!</h2>
      <p className="text-slate-400 font-bold text-2xl mb-12 leading-relaxed">작성하신 데이터는 공정한 추첨 시스템을 거쳐 <br/>투명하게 보상 지급 대상이 됩니다.</p>
      <div className="p-10 bg-indigo-50 rounded-[48px] border border-indigo-100 mb-12">
        <p className="text-indigo-900 font-black text-xl">“참여에는 반드시 가치가 따릅니다”</p>
      </div>
      <button 
        onClick={handleSubmit} 
        disabled={isSubmitting}
        className="bg-indigo-600 text-white px-24 py-10 rounded-[48px] font-black text-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all shadow-indigo-600/30"
      >{isSubmitting ? 'Processing...' : '최종 완료 🎁'}</button>
    </div>
  );
};

export default CitizenSurvey;
