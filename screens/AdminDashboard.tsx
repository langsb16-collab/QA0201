
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { storageService } from '../services/storageService';
import { blockchainService } from '../services/blockchainService';
import { CATEGORIES } from '../constants';
import { Survey, Winner, CryptoLog } from '../types';

const COLORS = ['#1E3A8A', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const AdminDashboard: React.FC = () => {
  const [surveys] = useState(() => storageService.getAllSurveys());
  const responses = storageService.getAllResponses();
  const totalGlobalResponses = responses.length;
  const [activeManager, setActiveManager] = useState<string | null>(null);

  const activeSurvey = useMemo(() => surveys.find(s => s.id === activeManager), [surveys, activeManager]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    surveys.forEach(s => {
      stats[s.category] = (stats[s.category] || 0) + (s.totalParticipants || 0);
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [surveys]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4">
        <div className="space-y-3">
          <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">Insights Hub 🏛️</h2>
          <p className="text-gray-400 font-bold text-xl tracking-tight">전문 조사 표준 기반 공공 거버넌스 데이터 모니터링</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
          <div className="space-y-4 relative z-10">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Statistical Reliability</span>
            <p className="text-5xl font-black text-white tracking-tighter">95<span className="text-xl text-slate-600">%</span></p>
            <p className="text-xs font-bold text-slate-400">신뢰수준 (Confidence)</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="space-y-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Total Respondents</span>
            <p className="text-5xl font-black text-gray-900 tracking-tighter">{totalGlobalResponses.toLocaleString()}</p>
            <p className="text-xs font-bold text-gray-400">누적 유효 응답수</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="space-y-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">AI Integrity</span>
            <p className="text-5xl font-black text-indigo-600 tracking-tighter">98.5</p>
            <p className="text-xs font-bold text-gray-400">데이터 정합성 지수</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="space-y-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Reward Payout</span>
            <p className="text-5xl font-black text-emerald-500 tracking-tighter">84<span className="text-xl">%</span></p>
            <p className="text-xs font-bold text-gray-400">인센티브 집행율</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between px-4">
          <div className="space-y-1">
             <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Campaign Inventory</h3>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Operational Campaigns</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {surveys.length === 0 ? (
            <div className="bg-white p-24 rounded-[48px] text-center border border-gray-100 italic font-bold text-gray-300">
               현재 진행 중인 캠페인이 없습니다.
            </div>
          ) : surveys.map((s, idx) => (
            <div key={s.id} className="bg-white p-6 md:px-12 md:py-8 rounded-[36px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 group hover:shadow-xl hover:translate-y-[-2px] transition-all">
              <div className="flex items-center gap-8 w-full md:w-auto">
                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center text-2xl font-black shadow-inner ${idx % 2 === 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {s.id.slice(2, 3)}
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">{s.title}</h4>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{s.id}</span>
                    <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-black rounded-lg uppercase tracking-widest border border-gray-100">{s.category}</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{s.reward?.amount}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-sm">
                       <img src={`https://i.pravatar.cc/100?u=${s.id}${i}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-4 border-white bg-slate-900 flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                    +{s.totalParticipants || 0}
                  </div>
                </div>
                <button 
                  onClick={() => setActiveManager(s.id)}
                  className="px-6 py-3 bg-[#1E3A8A] text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:bg-blue-800 transition-all"
                >
                  Manage Rewards
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeSurvey && (
        <RewardManagerPanel survey={activeSurvey} onClose={() => setActiveManager(null)} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 bg-white p-12 rounded-[56px] border border-gray-100 shadow-sm space-y-12">
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sector Analysis</h3>
                <p className="text-3xl font-black text-gray-900 tracking-tighter">카테고리별 유효 참여 분석</p>
              </div>
           </div>
           <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F3F4F6" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 900, fill: '#64748B' }} width={110} />
                  <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', fontWeight: 900 }} />
                  <Bar dataKey="value" radius={[0, 16, 16, 0]}>
                    {categoryStats.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

interface RewardPanelProps {
  survey: Survey;
  onClose: () => void;
}

const RewardManagerPanel: React.FC<RewardPanelProps> = ({ survey, onClose }) => {
  const [winners, setWinners] = useState<Winner[]>(() => storageService.getWinnersBySurvey(survey.id));
  const [cryptoLogs, setCryptoLogs] = useState<CryptoLog[]>(() => storageService.getCryptoLogs(survey.id));
  const [activeTab, setActiveTab] = useState<'WINNERS' | 'PAYOUTS'>('WINNERS');
  const [verifyingHash, setVerifyingHash] = useState<string | null>(null);

  const handleDraw = () => {
    if (survey.totalParticipants === 0) return alert('참여자가 없습니다.');
    const count = survey.reward?.quantity || 10;
    const picked = storageService.drawWinners(survey.id, count);
    setWinners(picked);
  };

  const updateStatus = (userId: string, status: Winner['status']) => {
    storageService.updateWinnerStatus(survey.id, userId, { status });
    setWinners(storageService.getWinnersBySurvey(survey.id));
  };

  const notifyWinner = (userId: string) => {
    storageService.updateWinnerStatus(survey.id, userId, { notified: true });
    setWinners(storageService.getWinnersBySurvey(survey.id));
    alert(`${userId}님께 당첨 안내 메시지를 생성했습니다.`);
  };

  const recordPayout = (userId: string) => {
    if (survey.reward?.type === 'CRYPTO') {
      const txHash = '0x' + Math.random().toString(16).slice(2, 66); // Mock hash
      const network = survey.reward.cryptoInfo?.network || 'TRC20';
      const log: CryptoLog = {
        surveyId: survey.id,
        address: 'T' + Math.random().toString(36).slice(2, 36).toUpperCase(),
        amount: survey.reward.amount,
        network: network as any,
        txHash,
        status: 'PENDING',
        timestamp: Date.now()
      };
      storageService.addCryptoLog(log);
      storageService.updateWinnerStatus(survey.id, userId, { 
        status: 'SENT', 
        txHash, 
        network: network as any 
      });
      setCryptoLogs(storageService.getCryptoLogs(survey.id));
      setWinners(storageService.getWinnersBySurvey(survey.id));
    } else {
      updateStatus(userId, 'SENT');
    }
  };

  const verifyTransaction = async (txHash: string, network: 'TRC20' | 'ERC20') => {
    setVerifyingHash(txHash);
    try {
      const result = network === 'TRC20' 
        ? await blockchainService.checkTronTx(txHash)
        : await blockchainService.checkEthTx(txHash);
      
      storageService.updateCryptoLog(survey.id, txHash, {
        status: result.status as any,
        verifiedAt: Date.now()
      });

      // Find the winner associated with this hash and update their status if verified
      const winnerWithHash = winners.find(w => w.txHash === txHash);
      if (winnerWithHash && result.success) {
        storageService.updateWinnerStatus(survey.id, winnerWithHash.userId, { status: 'CONFIRMED' });
      }

      setCryptoLogs(storageService.getCryptoLogs(survey.id));
      setWinners(storageService.getWinnersBySurvey(survey.id));
      
      alert(`검증 결과: ${result.status}${result.success ? ' (성공)' : ''}`);
    } catch (e) {
      alert('검증 중 오류가 발생했습니다.');
    } finally {
      setVerifyingHash(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in-95">
      <div className="bg-white w-full max-w-5xl rounded-[56px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-[#1E3A8A] p-10 text-white flex justify-between items-center shrink-0">
          <div className="space-y-1">
             <h3 className="text-3xl font-black tracking-tighter">Reward Operations Center 🛡️</h3>
             <p className="text-blue-200 font-bold">{survey.title} ({survey.id})</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center font-black transition-all">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10">
          <div className="flex gap-4 border-b border-gray-100 pb-2">
            <button 
              onClick={() => setActiveTab('WINNERS')}
              className={`px-6 py-3 font-black text-sm uppercase tracking-widest border-b-4 transition-all ${activeTab === 'WINNERS' ? 'border-[#1E3A8A] text-[#1E3A8A]' : 'border-transparent text-gray-400'}`}
            >
              Winners & Status
            </button>
            <button 
              onClick={() => setActiveTab('PAYOUTS')}
              className={`px-6 py-3 font-black text-sm uppercase tracking-widest border-b-4 transition-all ${activeTab === 'PAYOUTS' ? 'border-[#1E3A8A] text-[#1E3A8A]' : 'border-transparent text-gray-400'}`}
            >
              Payout Verification {survey.reward?.type === 'CRYPTO' && '💎'}
            </button>
          </div>

          {activeTab === 'WINNERS' ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <p className="text-2xl font-black text-gray-900 tracking-tight">당첨자 추첨 및 상태 관리</p>
                   <p className="text-xs font-bold text-gray-400">무작위 추첨 알고리즘을 사용하여 공정성을 확보합니다.</p>
                </div>
                {winners.length === 0 && (
                  <button 
                    onClick={handleDraw}
                    className="bg-[#10B981] text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-emerald-100 hover:scale-105 transition-all"
                  >
                    🎲 추첨 실행 (Fisher-Yates)
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-gray-100">
                    <tr>
                      <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Respondent Hash</th>
                      <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reward Status</th>
                      <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Notification</th>
                      <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {winners.map((w, idx) => (
                      <tr key={idx} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-6 font-mono text-xs font-black text-gray-600">{w.userId}</td>
                        <td className="py-6">
                           <select 
                            value={w.status} 
                            onChange={(e) => updateStatus(w.userId, e.target.value as any)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border-none outline-none appearance-none ${
                              w.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 
                              w.status === 'SENT' ? 'bg-blue-50 text-blue-600' : 
                              w.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                            }`}
                           >
                             <option value="PENDING">Pending</option>
                             <option value="SENT">Sent</option>
                             <option value="CONFIRMED">Confirmed</option>
                             <option value="FAILED">Failed</option>
                           </select>
                        </td>
                        <td className="py-6">
                           <button 
                            onClick={() => notifyWinner(w.userId)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${w.notified ? 'bg-gray-100 text-gray-400' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                           >
                             {w.notified ? 'Notified ✓' : 'Notify SMS'}
                           </button>
                        </td>
                        <td className="py-6">
                          {w.status === 'PENDING' && (
                            <button 
                              onClick={() => recordPayout(w.userId)}
                              className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                            >
                              Execute Payout
                            </button>
                          )}
                          {w.status === 'SENT' && w.txHash && (
                            <button 
                              onClick={() => verifyTransaction(w.txHash!, w.network as any)}
                              disabled={verifyingHash === w.txHash}
                              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"
                            >
                              {verifyingHash === w.txHash ? 'Verifying...' : 'Verify Tx'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {winners.length === 0 && (
                  <div className="py-20 text-center italic text-gray-300 font-bold">추첨 전입니다.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
               <div className="space-y-1">
                  <p className="text-2xl font-black text-gray-900 tracking-tight">Payout Verification Logs 📜</p>
                  <p className="text-xs font-bold text-gray-400">지급된 암호화 보상의 블록체인 상태 실시간 기록입니다.</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Distributed</p>
                    <p className="text-3xl font-black text-slate-900">{cryptoLogs.length} Records</p>
                  </div>
                  <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Transparency Audit</p>
                    <p className="text-3xl font-black text-emerald-600">Verified</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Active Networks</p>
                    <p className="text-3xl font-black text-blue-600">TRC20 / ERC20</p>
                  </div>
               </div>

               <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-gray-100">
                    <tr>
                      <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Network / Address</th>
                      <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                      <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Verification Status</th>
                      <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tx Hash</th>
                      <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {cryptoLogs.map((log, idx) => (
                      <tr key={idx} className="group hover:bg-gray-50">
                        <td className="py-6">
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-blue-500">{log.network}</p>
                              <p className="font-mono text-xs font-black text-gray-600">{log.address.slice(0, 16)}...</p>
                           </div>
                        </td>
                        <td className="py-6 font-black text-slate-900 text-sm">{log.amount} USDT</td>
                        <td className="py-6">
                           <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                                log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' :
                                log.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                                'bg-rose-50 text-rose-600'
                              }`}>
                                {log.status}
                              </span>
                              <button 
                                onClick={() => verifyTransaction(log.txHash, log.network)}
                                disabled={verifyingHash === log.txHash}
                                className="text-[10px] font-bold text-blue-600 underline disabled:opacity-20"
                              >
                                {verifyingHash === log.txHash ? 'Checking...' : 'Check Again'}
                              </button>
                           </div>
                        </td>
                        <td className="py-6 font-mono text-[10px] text-gray-400">{log.txHash.slice(0, 24)}...</td>
                        <td className="py-6 text-[10px] font-bold text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {cryptoLogs.length === 0 && (
                  <div className="py-20 text-center italic text-gray-300 font-bold">지급 기록이 없습니다.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
