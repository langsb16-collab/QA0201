# RewardVoice - 리워드보이스

React + Vite 기반의 리워드 음성 인식 애플리케이션입니다.

## 🌐 배포 URL

- **프로덕션**: https://qa0202.pages.dev
- **브랜치 배포**: https://58bd9d40.qa0202.pages.dev
- **GitHub 저장소**: https://github.com/langsb16-collab/QA0201

## ✨ 주요 기능

- React 19.2.4 기반 모던 웹 애플리케이션
- Google Gemini AI 통합
- Recharts를 활용한 데이터 시각화
- Tailwind CSS 기반 반응형 디자인
- TypeScript 지원

## 📦 기술 스택

- **프레임워크**: React 19.2.4
- **빌드 도구**: Vite 6.2.0
- **언어**: TypeScript 5.8.2
- **AI**: Google Gemini AI (@google/genai)
- **차트**: Recharts 3.7.0
- **스타일링**: Tailwind CSS
- **배포**: Cloudflare Pages

## 🚀 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (포트 3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 📤 배포

### Cloudflare Pages 배포

```bash
# 프로덕션 배포
npm run deploy:prod

# 또는 수동 배포
npm run build
npx wrangler pages deploy dist --project-name qa0202
```

## 🔗 커스텀 도메인 연결 (feezone.store)

현재 프로젝트는 `qa0202.pages.dev`로 배포되었습니다. `feezone.store` 도메인을 연결하려면:

### Cloudflare Dashboard에서 수동 설정

1. **Cloudflare Dashboard 접속**
   - https://dash.cloudflare.com 로그인

2. **Pages 프로젝트 선택**
   - Workers & Pages > qa0202 선택

3. **커스텀 도메인 추가**
   - "Custom domains" 탭 클릭
   - "Set up a custom domain" 버튼 클릭
   - `feezone.store` 입력 후 Continue

4. **DNS 자동 설정**
   - Cloudflare가 자동으로 CNAME 레코드 생성
   - 또는 수동 추가:
     - Type: `CNAME`
     - Name: `@` (또는 `feezone.store`)
     - Target: `qa0202.pages.dev`
     - Proxy status: Proxied (🟠)

5. **www 서브도메인 추가 (선택사항)**
   - `www.feezone.store` 추가
   - CNAME: `www` → `qa0202.pages.dev`

6. **SSL/TLS 자동 발급**
   - 몇 분 내로 HTTPS 자동 활성화
   - Let's Encrypt 인증서 사용

## 📁 프로젝트 구조

```
webapp/
├── components/         # React 컴포넌트
├── screens/           # 화면 컴포넌트
├── services/          # API 서비스
├── App.tsx            # 메인 앱 컴포넌트
├── index.tsx          # 엔트리 포인트
├── index.html         # HTML 템플릿
├── constants.ts       # 상수 정의
├── types.ts           # TypeScript 타입
├── vite.config.ts     # Vite 설정
├── wrangler.jsonc     # Cloudflare 설정
└── package.json       # 프로젝트 설정
```

## 🔑 환경 변수

프로젝트에서 사용하는 환경 변수:

- `GEMINI_API_KEY`: Google Gemini API 키

로컬 개발 시 `.env` 파일에 추가:

```env
GEMINI_API_KEY=your_api_key_here
```

## ⚙️ Cloudflare 설정

`wrangler.jsonc`:
```jsonc
{
  "name": "qa0202",
  "compatibility_date": "2026-02-01",
  "pages_build_output_dir": "./dist",
  "compatibility_flags": ["nodejs_compat"]
}
```

## 🌟 특징

- **모던 React**: 최신 React 19 기능 활용
- **타입 안전성**: TypeScript로 완벽한 타입 체크
- **빠른 개발**: Vite의 HMR(Hot Module Replacement)
- **AI 통합**: Google Gemini AI 연동
- **반응형 디자인**: 모바일/태블릿/데스크톱 지원
- **글로벌 배포**: Cloudflare Pages로 전 세계 엣지 네트워크 활용

## 📊 데이터 시각화

Recharts 라이브러리를 사용하여 다양한 차트와 그래프를 제공합니다.

## 🔐 보안

- HTTPS 자동 적용
- 환경 변수로 민감한 정보 관리
- TypeScript로 타입 안전성 보장

## 📝 라이선스

이 프로젝트의 라이선스는 프로젝트 소유자에게 문의하세요.

## 🙋‍♂️ 지원

문제가 있거나 질문이 있으시면 GitHub Issues를 통해 문의해주세요.

---

**배포 상태**:
- ✅ Cloudflare Pages 배포 완료
- ⏳ 커스텀 도메인 연결 대기 (수동 설정 필요)
