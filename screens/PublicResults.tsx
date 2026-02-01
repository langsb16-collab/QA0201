
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { AnalysisResult, Survey } from '../types';

const COLORS = ['#1E3A8A', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const PublicResults: React.FC<{ surveyId?: string; onBack: () => void }> = ({ surveyId, onBack }) => {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const targetId = surveyId || storageService.getActiveSurvey()?.id;
      if (targetId) {
        const s = storageService.getSurveyById(targetId);
        setSurvey(s);
        const responses = storageService.getResponsesBySurvey(targetId);
        try {
          const result = await aiService.analyzeResponses(responses);
          setAnalysis(result);
        } catch (error) {
          console.error('AI analysis failed:', error);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [surveyId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 animate-pulse">
      <div className="w-12 h-12 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="text-xs font-black text-blue-400 uppercase tracking-[0.3em]">Loading Transparency Data</p>
    </div>
  );

  if (!survey || !analysis) return (
    <div className="text-center py-40">
      <h2 className="text-2xl font-black">공개된 결과가 없습니다.</h2>
      <button onClick={onBack} className="mt-8 text-blue-600 font-bold underline">돌아가기</button>
    </div>
  );

  const ageData = Object.entries(analysis.stats.ageGroups).map(([name, value]) => ({ name, value }));
  const genderData = Object.entries(analysis.stats.genders).map(([name, value]) => ({ name, value }));

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 mb-2">
          Public Transparency Page
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">
          "{survey.title}" <br/>설문 결과 공개
        </h2>
        <p className="text-slate-400 font-bold text-lg">우리 동네의 목소리가 투명하게 공유됩니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: '참여 시민', val: analysis.stats.fairness.totalResponses, icon: '👥' },
          { label: '중복 차단', val: analysis.stats.fairness.blockedAttempts, icon: '🚫' },
          { label: '데이터 신뢰도', val: `${analysis.stats.fairness.integrityScore}%`, icon: '🛡️' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[36px] border border-gray-100 text-center shadow-sm">
             <span className="text-2xl mb-2 block">{item.icon}</span>
             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">{item.label}</p>
             <p className="text-2xl font-black text-gray-900 tracking-tighter">{item.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm space-y-8">
          <h3 className="font-black text-xl tracking-tight">연령대별 참여 분포</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: '#94A3B8' }} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="value" fill="#1E3A8A" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm space-y-8">
          <h3 className="font-black text-xl tracking-tight">성별 참여 비율</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                  {genderData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-12 rounded-[56px] shadow-2xl space-y-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 bg-white/10 rounded-[24px] flex items-center justify-center text-3xl">💡</div>
          <h3 className="text-3xl font-black tracking-tight">AI 데이터 인사이트</h3>
        </div>
        <div className="space-y-6 relative z-10">
          {analysis.insights.map((ins, i) => (
            <div key={i} className="flex gap-4">
               <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></div>
               <p className="text-lg font-bold text-slate-300 leading-relaxed">{ins}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-8">
        <button 
          onClick={onBack}
          className="px-12 py-5 bg-white border-2 border-slate-100 text-slate-400 font-black rounded-[32px] hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
};

export default PublicResults;
