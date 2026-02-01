
import React, { useState, useEffect } from 'react';
import { UserType } from './types';
import Layout from './components/Layout';
import CitizenSurvey from './screens/CitizenSurvey';
import BusinessDashboard from './screens/BusinessDashboard';
import AdminDashboard from './screens/AdminDashboard';
import AdminLogin from './screens/AdminLogin';
import AdminSurveyCreate from './screens/AdminSurveyCreate';
import PublicResults from './screens/PublicResults';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [userType, setUserType] = useState<UserType>('CITIZEN');
  const [isSurveyDone, setIsSurveyDone] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminView, setAdminView] = useState<'DASHBOARD' | 'CREATE'>('DASHBOARD');

  useEffect(() => {
    const admin = storageService.getAdmin();
    setIsAdminLoggedIn(!!admin);
  }, [userType]);

  const renderContent = () => {
    switch (userType) {
      case 'CITIZEN':
        return isSurveyDone ? (
          <div className="max-w-md mx-auto text-center space-y-10 pt-10">
            <div className="text-8xl animate-bounce">🎁</div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-gray-900">참여 완료!</h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                데이터가 우리 동네 사장님들과 정책 결정에<br/>큰 힘이 됩니다.
              </p>
            </div>
            <div className="bg-teal-50 p-6 rounded-[32px] border border-teal-100">
              <p className="text-sm font-bold text-teal-700">추첨 경품 안내</p>
              <p className="text-xs text-teal-600 mt-1">지역 상품권 1만원 권 (개별 SMS 안내)</p>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setUserType('PUBLIC_RESULT')}
                className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100"
              >
                전체 결과 보러가기
              </button>
              <button 
                onClick={() => setIsSurveyDone(false)}
                className="w-full py-5 bg-white border border-gray-100 text-gray-400 font-black rounded-2xl"
              >
                홈으로 돌아가기
              </button>
            </div>
          </div>
        ) : (
          <CitizenSurvey onComplete={() => setIsSurveyDone(true)} />
        );
      
      case 'CITIZEN_REQUESTER':
      case 'BUSINESS':
      case 'ADMIN':
        if (!isAdminLoggedIn) {
          return <AdminLogin onComplete={() => setIsAdminLoggedIn(true)} />;
        }
        return adminView === 'DASHBOARD' 
          ? (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button 
                  onClick={() => setAdminView('CREATE')}
                  className="bg-[#10B981] text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-emerald-100"
                >
                  + 새 설문 캠페인 생성
                </button>
              </div>
              {/* For Citizen Requesters, we show the AdminDashboard stats for now, or we can customize it */}
              {userType === 'BUSINESS' ? <BusinessDashboard /> : <AdminDashboard />}
            </div>
          )
          : <AdminSurveyCreate onComplete={() => setAdminView('DASHBOARD')} />;
      
      case 'PUBLIC_RESULT':
        return <PublicResults onBack={() => setUserType('CITIZEN')} />;

      default:
        return null;
    }
  };

  return (
    <Layout userType={userType === 'PUBLIC_RESULT' ? 'CITIZEN' : userType} onSwitchUser={(type) => { setUserType(type); setAdminView('DASHBOARD'); }}>
      {renderContent()}
    </Layout>
  );
};

export default App;
