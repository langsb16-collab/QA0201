
import React, { useState } from 'react';
import { storageService } from '../services/storageService';

const AdminLogin: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'BUSINESS' | 'GOV' | 'CITIZEN'>('BUSINESS');
  const [agree, setAgree] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleRegister = async () => {
    if (phone.length < 10) return alert('올바른 번호를 입력해주세요.');
    const phoneHash = btoa(phone).slice(0, 10);
    storageService.saveAdmin({ phoneHash, role, createdAt: Date.now() });
    onComplete();
  };

  if (!showLogin) {
    return (
      <div className="max-w-6xl mx-auto space-y-32 py-12 animate-in fade-in duration-1000">
        {/* 🟦 ① HERO SECTION */}
        <section className="text-center space-y-8 max-w-4xl mx-auto px-4">
          <div className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 mb-4 animate-bounce">
            Partner Invitation
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight">
            비싼 설문 비용, <br/><span className="text-indigo-600">이제 지출하지 마세요</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold text-slate-400">
            플랫폼 수수료 0원. <br className="md:hidden"/>
            보상은 의뢰자가 직접 설정하는 새로운 설문 방식
          </p>
          <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setShowLogin(true)}
              className="w-full md:w-auto bg-indigo-600 text-white px-12 py-6 rounded-[32px] font-black text-2xl shadow-2xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              무료로 설문 만들기
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('reward-logic');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full md:w-auto bg-white text-slate-400 border-2 border-slate-100 px-12 py-6 rounded-[32px] font-black text-2xl hover:bg-slate-50 transition-all"
            >
              참여자 보상 설정 보기
            </button>
          </div>
        </section>

        {/* 🟩 ② PROBLEM SECTION */}
        <section className="bg-white p-16 md:p-24 rounded-[72px] shadow-sm border border-slate-50 space-y-16">
          <div className="text-center space-y-4">
             <h2 className="text-4xl font-black text-slate-900 tracking-tighter">기존 설문은 왜 참여율이 낮을까요?</h2>
             <p className="text-slate-400 font-bold text-lg">참여자도 의뢰자도 만족하지 못하는 기존의 한계</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 p-10 bg-slate-50 rounded-[48px] border border-slate-100 text-center">
              <div className="text-5xl mb-4">🌫️</div>
              <h3 className="text-xl font-black text-slate-900">공짜 설문 → 성의 없는 응답</h3>
              <p className="text-sm font-bold text-slate-400 leading-relaxed">보상이 없는 설문은 참여자의 집중력을 떨어뜨려 부정확한 데이터를 양산합니다.</p>
            </div>
            <div className="space-y-4 p-10 bg-slate-50 rounded-[48px] border border-slate-100 text-center">
              <div className="text-5xl mb-4">📉</div>
              <h3 className="text-xl font-black text-slate-900">포인트 적립 → 참여 동기 부족</h3>
              <p className="text-sm font-bold text-slate-400 leading-relaxed">수천 원을 모아야 사용 가능한 적립 방식은 실질적인 보상 체감이 매우 낮습니다.</p>
            </div>
            <div className="space-y-4 p-10 bg-slate-50 rounded-[48px] border border-slate-100 text-center">
              <div className="text-5xl mb-4">💸</div>
              <h3 className="text-xl font-black text-slate-900">높은 의뢰 비용 → 접근 불가</h3>
              <p className="text-sm font-bold text-slate-400 leading-relaxed">과도한 수수료로 인해 소상공인과 개인 프로젝트는 데이터 접근조차 어렵습니다.</p>
            </div>
          </div>
        </section>

        {/* 🟨 ③ SOLUTION SECTION */}
        <section id="reward-logic" className="space-y-16">
          <div className="text-center space-y-4">
             <h2 className="text-4xl font-black text-slate-900 tracking-tighter">보상이 있는 설문은 다릅니다</h2>
             <p className="text-slate-400 font-bold text-lg">예산이 곧 참여율이 되는 자율 설계 시스템</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div className="space-y-10">
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shrink-0 font-black text-xl shadow-lg">0</div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">설문 등록 수수료 0원</h4>
                    <p className="text-slate-400 font-bold leading-relaxed">의뢰 비용에 포함된 불필요한 수수료를 없앴습니다. 설문 등록은 언제나 무료입니다.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shrink-0 font-black text-xl shadow-lg">🎁</div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">보상은 의뢰자가 직접 설정</h4>
                    <p className="text-slate-400 font-bold leading-relaxed">모바일 상품권, 지역사랑상품권, 지역 특산품, USDT까지. 당신의 예산에 맞춰 결정하세요.</p>
                  </div>
                </div>
                <div className="p-10 bg-indigo-50 rounded-[48px] border border-indigo-100 flex items-center gap-4">
                  <p className="text-indigo-900 font-black text-xl italic leading-relaxed">“예산은 전부 참여자 보상으로만 사용하세요. <br className="hidden md:block"/>그것이 가장 강력한 참여 동기가 됩니다.”</p>
                </div>
             </div>
             <div className="bg-slate-900 p-12 rounded-[72px] shadow-2xl space-y-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="space-y-2 relative z-10">
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Available Rewards</p>
                   <h3 className="text-3xl font-black text-white tracking-tight">지원 가능한 보상 예시</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                   {[
                     { name: '모바일 상품권', icon: '🎫', desc: '전국 어디서나 편리하게' },
                     { name: '지역사랑상품권', icon: '🏠', desc: '우리 동네 상생 가치' },
                     { name: '지역 특산품', icon: '🍯', desc: '우리 지역만의 특별함' },
                     { name: 'USDT 암호화 보상', icon: '💎', desc: '국경 없는 디지털 보상' }
                   ].map(r => (
                     <div key={r.name} className="p-6 bg-white/5 border border-white/10 rounded-[32px] flex items-center gap-4 hover:bg-white/10 transition-colors">
                        <span className="text-3xl">{r.icon}</span>
                        <div>
                          <p className="text-sm font-black text-white">{r.name}</p>
                          <p className="text-[10px] font-bold text-slate-500">{r.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </section>

        {/* 🟧 ④ COMPARISON SECTION */}
        <section className="bg-white p-12 md:p-20 rounded-[72px] shadow-sm border border-slate-50 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">설문 플랫폼 패러다임의 변화</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="border-b border-slate-100">
                <tr>
                  <th className="py-8 font-black text-slate-300 text-[10px] uppercase tracking-widest w-1/4">비교 항목</th>
                  <th className="py-8 font-black text-slate-400 text-xs px-6">일반 설문 플랫폼</th>
                  <th className="py-8 font-black text-indigo-600 text-sm bg-indigo-50/50 px-8 rounded-t-[40px]">리워드보이스 (RewardVoice)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { item: '수수료 구조', old: '의뢰 비용의 30~50% 대행료', new: '플랫폼 수수료 0원' },
                  { item: '보상 가치', old: '미비한 포인트 적립', new: '의뢰자가 설계한 실질 보상' },
                  { item: '참여 동기', old: '단순 소액 노동형 참여', new: '명확한 보상 기반 가치 참여' },
                  { item: '데이터 품질', old: '무성의한 응답 비율 높음', new: '보상 기대에 따른 성실 응답' },
                  { item: '의뢰 문턱', old: '높은 비용으로 대기업 위주', new: '소상공인·개인도 무료 시작' }
                ].map((row, i) => (
                  <tr key={i} className="group">
                    <td className="py-7 font-black text-slate-500 text-xs">{row.item}</td>
                    <td className="py-7 font-medium text-slate-400 px-6">{row.old}</td>
                    <td className="py-7 font-black text-indigo-900 bg-indigo-50/30 px-8">{row.new}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 🟪 ⑤ TRUST & RELIABILITY SECTION */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
             <h2 className="text-4xl font-black text-slate-900 tracking-tighter">보상이 있어도, 공정성은 기본입니다</h2>
             <p className="text-slate-400 font-bold text-lg">참여자도 의뢰자도 모두 신뢰할 수 있는 데이터 보호 시스템</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { title: 'IP 중복 참여 제한', desc: '동일인 중복 응답 시스템 차단', icon: '🚫' },
               { title: '불성실 응답 자동 제외', desc: '성의 없는 답변은 추첨 제외', icon: '🧹' },
               { title: '자동 추첨 시스템', desc: '알고리즘 기반의 투명한 선정', icon: '🎰' },
               { title: '지급 현황 관리', desc: '보상 전달 여부 실시간 확인', icon: '📋' }
             ].map(item => (
               <div key={item.title} className="bg-white p-10 rounded-[48px] border border-slate-50 shadow-sm text-center space-y-4 group hover:shadow-xl transition-all">
                  <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h4 className="text-lg font-black text-slate-900 leading-tight">{item.title}</h4>
                  <p className="text-xs font-bold text-slate-400 leading-relaxed">{item.desc}</p>
               </div>
             ))}
          </div>
        </section>

        {/* 🟥 ⑥ TARGET SECTION */}
        <section className="bg-slate-900 p-16 md:p-24 rounded-[80px] text-white text-center space-y-16 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent"></div>
           <div className="space-y-4 relative z-10">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">누구나 설문을 열 수 있습니다</h2>
              <p className="text-slate-400 font-bold text-lg">비용 부담 없이 당신의 프로젝트를 시작하세요</p>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
              {[
                { name: '소상공인', desc: '매출 분석 및 메뉴 개선', icon: '🏪' },
                { name: '지자체', desc: '시민 여론 및 정책 수립', icon: '🏛️' },
                { name: '단체·기관', desc: '행사 만족도 및 조직 진단', icon: '👥' },
                { name: '개인 프로젝트', desc: '아이디어 검증 및 데이터 수집', icon: '💡' }
              ].map(t => (
                <div key={t.name} className="space-y-4">
                   <div className="w-24 h-24 bg-white/5 rounded-[40px] mx-auto flex items-center justify-center text-4xl shadow-inner border border-white/10 hover:bg-white/10 transition-colors">{t.icon}</div>
                   <h4 className="text-xl font-black">{t.name}</h4>
                   <p className="text-xs font-bold text-slate-500">{t.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* 🟫 ⑦ FLOW SECTION */}
        <section className="space-y-16">
           <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">5분 만에 시작하는 보상형 설문</h2>
           </div>
           <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
              {[
                { step: '01', title: '설문 만들기', desc: 'AI가 핵심 문항을 제안' },
                { step: '02', title: '보상 설정하기', desc: '자유로운 종류와 예산 설계' },
                { step: '03', title: '참여자 모집', desc: '링크와 QR로 손쉬운 배포' },
                { step: '04', title: '공정 추첨', desc: '무결성 필터 거친 자동 선정' },
                { step: '05', title: '보상 지급', desc: '전달 완료까지 시스템 관리' }
              ].map((f, i) => (
                <React.Fragment key={f.step}>
                  <div className="bg-white p-10 rounded-[48px] border border-slate-50 shadow-sm text-center space-y-4 w-full md:w-56 shrink-0 relative">
                    <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">{f.step}</span>
                    <h4 className="text-lg font-black text-slate-900 leading-tight">{f.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400">{f.desc}</p>
                  </div>
                  {i < 4 && <div className="hidden md:block w-8 h-[2px] bg-slate-100"></div>}
                </React.Fragment>
              ))}
           </div>
        </section>

        {/* ⬛ ⑧ FINAL CTA SECTION */}
        <section className="bg-indigo-600 p-16 md:p-32 rounded-[80px] text-center space-y-12 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-indigo-400/20"></div>
           <div className="relative z-10 space-y-8">
             <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                설문은 무료로 시작하고, <br/>보상은 참여자에게 돌려주세요
             </h2>
             <p className="text-indigo-100 font-bold text-xl md:text-2xl">
                비용은 줄이고, 참여 가치는 높이는 새로운 상생 모델
             </p>
             <div className="pt-8">
               <button 
                onClick={() => {
                  setShowLogin(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white text-indigo-600 px-16 py-8 rounded-[40px] font-black text-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all shadow-white/10"
               >
                 지금 설문 개설하기
               </button>
             </div>
           </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-4">
            <button onClick={() => setShowLogin(false)} className="text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest">← Back to Overview</button>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">파트너 로그인</h2>
          <p className="text-slate-400 font-bold">수수료 0원, 자율 보상 설문을 시작하세요.</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-slate-50 space-y-10 mx-auto">
          <div className="space-y-8">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-2">Phone Number</label>
              <div className="relative border-b-2 border-slate-100 focus-within:border-indigo-600 transition-colors py-3">
                <input 
                  type="tel" 
                  placeholder="01012345678"
                  className="w-full bg-transparent p-2 outline-none text-xl font-bold placeholder:text-slate-200"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity text-xl">👤</div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-2">의뢰 성격</label>
              <div className="flex gap-2 bg-slate-50 p-1.5 rounded-[28px] border border-slate-100">
                <button 
                  onClick={() => setRole('CITIZEN')}
                  className={`flex-1 py-4 rounded-[22px] transition-all font-black text-xs ${role === 'CITIZEN' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  일반인 의뢰
                </button>
                <button 
                  onClick={() => setRole('BUSINESS')}
                  className={`flex-1 py-4 rounded-[22px] transition-all font-black text-xs ${role === 'BUSINESS' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  소상공인
                </button>
                <button 
                  onClick={() => setRole('GOV')}
                  className={`flex-1 py-4 rounded-[22px] transition-all font-black text-xs ${role === 'GOV' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  지자체
                </button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-slate-50/50 rounded-[32px] border border-slate-100/50 group hover:border-indigo-100 transition-colors">
              <div className="relative">
                <input 
                  type="checkbox" 
                  id="integrity-agree"
                  checked={agree} 
                  onChange={(e) => setAgree(e.target.checked)} 
                  className="peer appearance-none w-6 h-6 border-2 border-slate-200 rounded-lg checked:bg-indigo-600 checked:border-indigo-600 cursor-pointer transition-all"
                />
                <div className="absolute inset-0 flex items-center justify-center text-white text-xs opacity-0 peer-checked:opacity-100 pointer-events-none">✓</div>
              </div>
              <label htmlFor="integrity-agree" className="text-[11px] text-slate-500 leading-relaxed font-bold cursor-pointer select-none">
                본 기기 등록 및 책임 기반 설문 게시에 동의합니다.<br/>
                <span className="text-indigo-400">(보상 지급 투명성 및 데이터 무결성 준수)</span>
              </label>
            </div>
          </div>

          <div className="pt-4">
            <button
              disabled={!agree || phone.length < 10}
              onClick={handleRegister}
              className="w-full bg-indigo-600 text-white py-6 rounded-[32px] font-black text-xl shadow-2xl shadow-indigo-600/30 disabled:opacity-20 disabled:shadow-none hover:bg-indigo-700 active:scale-95 transition-all"
            >
              Start for Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
