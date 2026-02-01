
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { AnalysisResult } from '../types';

const COLORS = ['#1E3A8A', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

const BusinessDashboard: React.FC = () => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const activeSurvey = storageService.getActiveSurvey();
      if (activeSurvey) {
        const responses = storageService.getResponsesBySurvey(activeSurvey.id);
        if (responses.length > 0) {
          try {
            const result = await aiService.analyzeResponses(responses);
            setAnalysis(result);
          } catch (error) {
            console.error('AI analysis failed:', error);
            // Set null to show "no data" screen
          }
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 space-y-6">
      <div className="w-14 h-14 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-blue-400 font-black tracking-[0.3em] text-[10px] uppercase">AI Analyzing Market Signals...</p>
    </div>
  );

  if (!analysis) {
    return (
      <div className="bg-white p-16 md:p-24 rounded-[48px] text-center border border-gray-100 shadow-sm max-w-3xl mx-auto mt-10">
        <div className="text-7xl mb-10">📈</div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">데이터 수집 대기 중</h2>
        <p className="text-gray-400 font-bold max-w-md mx-auto leading-relaxed text-lg">
          실시간 응답 데이터를 분석하여 귀하의 매출 증대를 위한 핵심 전략을 도출합니다. 설문 참여를 독려하여 더 정확한 인사이트를 얻어보세요.
        </p>
      </div>
    );
  }

  const timeData = Object.entries(analysis.stats.timeBuckets).map(([name, value]) => ({ 
    name, 
    value: value as number 
  }));
  const ageData = Object.entries(analysis.stats.ageGroups).map(([name, value]) => ({ 
    name, 
    value: value as number 
  }));

  const sortedTimeData = [...timeData].sort((a, b) => (b.value as number) - (a.value as number));
  const topTimeLabel = sortedTimeData[0]?.name || '-';

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-gray-900 tracking-tighter">Market Analysis 📊</h2>
          <p className="text-gray-400 font-bold text-lg">AI 기반 상권 분석 및 소비자 행태 대시보드</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white border border-gray-200 px-6 py-3 rounded-2xl shadow-sm text-right">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Update Cycle</span>
            <p className="text-sm font-black text-[#1E3A8A]">Active (Real-time)</p>
          </div>
          <button className="bg-black text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-black/10">Download CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Statistics Panels */}
        <div className="lg:col-span-8 space-y-8">
          {/* Fairness Panel */}
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data Integrity</h3>
                <p className="text-xl font-black text-gray-900 tracking-tight">참여 공정성 현황</p>
              </div>
              <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">Verified</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: '총 응답', val: analysis.stats.fairness.totalResponses, icon: '📄' },
                { label: '고유 참여자', val: analysis.stats.fairness.uniqueUsers, icon: '👤' },
                { label: '차단된 중복', val: analysis.stats.fairness.blockedAttempts, icon: '🚫' },
                { label: '무결성 점수', val: `${analysis.stats.fairness.integrityScore}%`, icon: '🛡️' }
              ].map((item, i) => (
                <div key={i} className="p-5 bg-gray-50 rounded-[28px] border border-gray-100 flex flex-col items-center text-center space-y-1">
                  <span className="text-xl">{item.icon}</span>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-lg font-black text-gray-900">{item.val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Panel 1: Age Demographics */}
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Profiles</h3>
                  <p className="text-xl font-black text-gray-900 tracking-tight">연령대 분포</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1E3A8A] text-xl font-bold">👤</div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: '#9CA3AF' }} />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: '#F9FAFB' }}
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 900 }} 
                    />
                    <Bar dataKey="value" fill="#1E3A8A" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Panel 2: Peak Hours */}
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Flow Monitoring</h3>
                  <p className="text-xl font-black text-gray-900 tracking-tight">피크 방문 시간대</p>
                </div>
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#10B981] text-xl font-bold">🕒</div>
              </div>
              <div className="h-64 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={timeData}
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {timeData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 900 }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Main Hour</span>
                   <span className="text-xl font-black text-gray-900">{topTimeLabel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 3: Semantic Data */}
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                   <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Voice of Customer</h3>
                   <p className="text-xl font-black text-gray-900 tracking-tight">핵심 키워드 분석</p>
                </div>
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 text-sm font-black border border-gray-100">AI</div>
             </div>
             <div className="flex flex-wrap gap-3">
              {analysis.stats.prefKeywords.map((kw, idx) => (
                <div key={idx} className="px-6 py-4 bg-gray-50 border border-gray-100 rounded-[28px] group hover:bg-black hover:text-white transition-all cursor-default flex items-center gap-3">
                  <span className="text-[#1E3A8A] font-black text-lg group-hover:text-[#10B981]">#</span>
                  <span className="font-black text-sm tracking-tight">{kw.token}</span>
                  <div className="w-6 h-6 bg-white group-hover:bg-white/10 rounded-full flex items-center justify-center text-[10px] font-black shadow-inner">{kw.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendation Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner text-[#1E3A8A]">✨</div>
              <div className="space-y-1">
                <h3 className="font-black text-2xl tracking-tighter text-[#1E3A8A]">Insight Hub</h3>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">AI Strategy Center</p>
              </div>
            </div>
            
            <div className="space-y-8">
              {analysis.insights.map((insight, idx) => (
                <div key={idx} className="flex gap-5 group/item">
                  <div className="mt-2 w-2.5 h-2.5 rounded-full bg-[#1E3A8A] group-hover/item:scale-125 transition-transform shrink-0"></div>
                  <p className="text-sm font-bold text-gray-600 leading-[1.6]">{insight}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 space-y-6">
               <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Recommended Actions</h4>
               <div className="space-y-4">
                  {analysis.recommendations.map((rec, idx) => (
                    <div key={idx} className="recommend-card p-6 rounded-2xl group transition-all cursor-default">
                       <p className="text-sm font-black leading-[1.5] text-emerald-900">{rec}</p>
                    </div>
                  ))}
               </div>
               <button className="w-full py-5 bg-[#1E3A8A] text-white font-black rounded-3xl text-sm shadow-xl shadow-blue-900/10 hover:bg-blue-800 active:scale-95 transition-all mt-4 uppercase tracking-widest">
                 Execute Strategy
               </button>
            </div>
          </div>
          
          <div className="bg-blue-50 p-10 rounded-[40px] border border-blue-100 text-center space-y-6">
             <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-3xl mx-auto shadow-sm border border-blue-50">🏛️</div>
             <div className="space-y-2">
                <h4 className="text-xl font-black text-blue-900 tracking-tight">지자체 정책 바우처</h4>
                <p className="text-xs font-bold text-blue-400 leading-relaxed px-6">분석된 성과 지표를 바탕으로 지자체 지원 사업 추천이 가능합니다.</p>
             </div>
             <button className="text-[10px] font-black text-blue-600 underline uppercase tracking-widest">지원 대상 확인하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
