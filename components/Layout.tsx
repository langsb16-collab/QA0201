
import React from 'react';
import { UserType } from '../types';
import { APP_NAME, APP_SLOGAN, CATEGORIES } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  userType: UserType;
  onSwitchUser: (type: UserType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userType, onSwitchUser }) => {
  const navItems = [
    { type: 'CITIZEN' as UserType, label: '참여자', icon: '🏠' },
    { type: 'CITIZEN_REQUESTER' as UserType, label: '일반인 의뢰', icon: '📣' },
    { type: 'BUSINESS' as UserType, label: '소상공인', icon: '📈' },
    { type: 'ADMIN' as UserType, label: '지자체', icon: '🏛️' },
  ];

  const categoryIcons: Record<string, string> = {
    politics: '🏛️',
    economy: '💰',
    society: '👥',
    culture: '🎭',
    food: '🍽️',
    market: '🛒'
  };

  const publicThemes = CATEGORIES.filter(c => ['politics', 'economy', 'society', 'culture'].includes(c.id));

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col md:flex-row font-sans text-[#111827]">
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-200 h-screen sticky top-0 p-8 shadow-sm overflow-y-auto">
        <div className="flex items-center gap-3 mb-12 px-2 shrink-0">
          <div className="w-10 h-10 bg-[#1E3A8A] rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-900/10 shrink-0">
            R
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[16px] font-black tracking-tighter leading-tight truncate whitespace-nowrap overflow-hidden">리워드보이스 (RewardVoice)</span>
            <span className="text-[9px] font-bold text-gray-400 mt-1 truncate">설문 참여자의 목소리에 보상이 따른다</span>
          </div>
        </div>

        <nav className="flex-1 space-y-8">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 px-2">Navigation</p>
            {navItems.map((item) => (
              <button
                key={item.type}
                onClick={() => onSwitchUser(item.type)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                  userType === item.type
                    ? 'bg-[#1E3A8A] text-white shadow-xl shadow-blue-900/10 translate-x-1'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#1E3A8A]'
                }`}
              >
                <span className={`text-xl transition-transform duration-300 ${userType === item.type ? 'scale-110' : 'group-hover:scale-110 opacity-70'}`}>
                  {item.icon}
                </span>
                <span className="font-bold text-[15px] tracking-tight">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 px-2">Public Themes</p>
            {publicThemes.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSwitchUser('CITIZEN')}
                className="w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-300 group text-gray-400 hover:bg-gray-50 hover:text-gray-900"
              >
                <span className="text-lg opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all">
                  {categoryIcons[cat.id] || '📍'}
                </span>
                <span className="font-bold text-[13px] tracking-tight">{cat.name}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-100 shrink-0">
          <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Trust Verification Active</p>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-xs font-bold text-blue-900 leading-tight tracking-tight">“설문하고, 보상받자.”</span>
              <span className="text-xs font-bold text-blue-900 leading-tight tracking-tight">“당신의 의견, 그냥 지나가지 않습니다.”</span>
              <span className="text-xs font-bold text-blue-900 leading-tight tracking-tight">“참여에는 반드시 리턴이 있습니다.”</span>
            </div>
          </div>
        </div>
      </aside>

      <header className="md:hidden bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 bg-[#1E3A8A] rounded-lg flex items-center justify-center text-white font-black text-sm shrink-0">R</div>
          <span className="font-black text-[15px] tracking-tight truncate">리워드보이스</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-xl">🔔</div>
      </header>

      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-6 py-8 md:py-12 mb-24 md:mb-0 animate-in fade-in duration-500">
          {children}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-white shadow-2xl shadow-black/10 rounded-3xl z-50 flex items-center justify-around px-2 border border-gray-100">
        {navItems.map((item) => (
          <button
            key={item.type}
            onClick={() => onSwitchUser(item.type)}
            className={`flex flex-col items-center justify-center w-16 h-12 rounded-2xl transition-all duration-300 ${
              userType === item.type ? 'bg-[#1E3A8A] text-white shadow-lg' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[9px] font-black mt-0.5">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
