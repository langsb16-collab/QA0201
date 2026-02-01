# RewardVoice - 리워드보이스

React + Vite + Tailwind CSS 기반의 리워드 음성 인식 애플리케이션입니다.

## 🌐 배포 URL

- **프로덕션**: https://qa0202.pages.dev
- **최신 배포**: https://5943993d.qa0202.pages.dev
- **커스텀 도메인**: https://feezone.store (연결 완료)
- **GitHub 저장소**: https://github.com/langsb16-collab/QA0201

## ✅ 최근 수정 사항

### 🚀 무한 로딩 문제 해결 (2026-02-01)

**문제**: BusinessDashboard와 PublicResults에서 무한 로딩 스피너
- Google Gemini API 호출 시 Promise가 resolve/reject 되지 않거나 지연
- setLoading(false)에 도달하지 못해 무한 로딩 발생

**해결**: ✅ 완료
- Google Gemini API 호출 제거 (외부 API 의존성 제거)
- localStorage 기반 로컬 더미 데이터로 즉시 응답
- 번들 크기 감소: 917.83 kB → 656.92 kB (28% 감소)
- 모든 기능이 즉시 로드되어 사용자 경험 개선

**효과**:
- ⚡ 즉시 로딩: 네트워크 지연 없음
- 📦 번들 최적화: Google Genai 라이브러리 제거로 크기 감소
- 🔒 완전한 오프라인 작동: 외부 API 없이 100% localStorage 기반

### 🔧 Import Map 충돌 해결 (2026-02-01)

**문제**: Vite 빌드와 import map 충돌로 인한 React 앱 렌더링 실패

**해결**: ✅ 완료
- index.html에서 import map 제거
- Vite의 번들링 방식만 사용
- React, Recharts 모두 빌드에 포함
- 정상적인 React 앱 렌더링 확인

### 🎨 Tailwind CSS 프로덕션 빌드 적용 (2026-02-01)

**문제**: Tailwind CDN 사용으로 인한 프로덕션 환경 CSS 미적용

**해결**: ✅ 완료
- Tailwind CSS v3.4.0 빌드 방식으로 전환
- 프로덕션 환경에서 안정적인 CSS 적용

## ✨ 주요 기능

- React 19.2.4 기반 모던 웹 애플리케이션
- **100% localStorage 기반**: 서버 없이 완전한 오프라인 작동
- **즉시 로딩**: 외부 API 의존성 제거로 즉각적인 응답
- Recharts를 활용한 데이터 시각화
- Tailwind CSS 기반 반응형 디자인 (프로덕션 빌드)
- TypeScript 지원
- 로컬 더미 데이터를 활용한 분석 기능

## 📦 기술 스택

- **프레임워크**: React 19.2.4
- **빌드 도구**: Vite 6.2.0
- **언어**: TypeScript 5.8.2
- **스타일링**: Tailwind CSS 3.4.0 (빌드 방식)
- **PostCSS**: postcss, autoprefixer
- **차트**: Recharts 3.7.0
- **배포**: Cloudflare Pages (qa0202)
- **데이터 저장**: 100% localStorage (서버 없음)

## 🚀 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (포트 3000)
npm run dev

# 프로덕션 빌드 (Tailwind CSS 컴파일 + React 번들링)
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

## 🎨 Tailwind CSS 설정

### 빌드 프로세스

프로젝트는 Tailwind CSS를 빌드 타임에 컴파일합니다:

1. **설정 파일**:
   - `tailwind.config.js`: Tailwind 설정
   - `postcss.config.js`: PostCSS 플러그인 설정
   - `src/index.css`: Tailwind 디렉티브 진입점

2. **빌드 출력**:
   ```
   dist/assets/index-[hash].css  (약 37 kB, gzip: 6.68 kB)
   dist/assets/index-[hash].js   (약 657 kB, gzip: 196 kB)
   ```

3. **자동 적용**:
   - Vite가 모든 의존성을 번들링
   - HTML에 `<script>` 및 `<link>` 태그 자동 삽입

## 🔗 커스텀 도메인 (feezone.store)

도메인 연결이 완료되었습니다!

### 접속 URL
- **메인 도메인**: https://feezone.store
- **Cloudflare Pages**: https://qa0202.pages.dev

### Cloudflare Dashboard 설정
1. **Dashboard**: https://dash.cloudflare.com
2. **Pages 프로젝트**: Workers & Pages > qa0202
3. **Custom domains**: feezone.store 연결 완료 ✅
4. **SSL/TLS**: 자동 활성화 완료 ✅

## 📁 프로젝트 구조

```
webapp/
├── src/
│   └── index.css          # Tailwind CSS 진입점
├── components/            # React 컴포넌트
│   └── Layout.tsx
├── screens/              # 화면 컴포넌트
│   ├── AdminDashboard.tsx
│   ├── AdminLogin.tsx
│   ├── AdminSurveyCreate.tsx
│   ├── BusinessDashboard.tsx
│   ├── CitizenSurvey.tsx
│   └── PublicResults.tsx
├── services/             # API 서비스
│   ├── storageService.ts
│   └── blockchainService.ts
├── App.tsx               # 메인 앱 컴포넌트
├── index.tsx             # 엔트리 포인트
├── index.html            # HTML 템플릿
├── constants.ts          # 상수 정의
├── types.ts              # TypeScript 타입
├── vite.config.ts        # Vite 설정
├── tailwind.config.js    # Tailwind CSS 설정
├── postcss.config.js     # PostCSS 설정
├── wrangler.jsonc        # Cloudflare 설정
└── package.json          # 프로젝트 설정
```

## 🔑 환경 변수

이 프로젝트는 **서버 없이 100% localStorage**로 작동하므로 환경 변수가 필요하지 않습니다.

모든 데이터는 브라우저의 localStorage에 저장되며, 외부 API를 호출하지 않습니다.

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
- **프로덕션 빌드**: 최적화된 번들링으로 안정적인 배포
- **반응형 디자인**: Tailwind CSS로 모바일/태블릿/데스크톱 지원
- **글로벌 배포**: Cloudflare Pages로 전 세계 엣지 네트워크 활용
- **완전한 오프라인**: 서버 없이 localStorage만으로 100% 작동
- **즉시 로딩**: 외부 API 의존성 제거로 즉각적인 응답

## 🐛 문제 해결

### React 앱이 렌더링되지 않음 / 빈 화면

**증상**: 배포 후 빈 화면만 표시되고 React 컴포넌트가 로드되지 않음

**원인**: Import map과 Vite 빌드 시스템 충돌
- Import map은 브라우저가 런타임에 모듈을 로드
- Vite는 빌드 시 모든 모듈을 번들링
- 두 방식이 충돌하여 React가 실행되지 않음

**해결**: ✅ 이미 적용됨 - Import map 제거, Vite 번들링만 사용

### Tailwind CSS 미적용

**증상**: 스타일이 적용되지 않고 흰 화면 표시

**원인**: Tailwind CDN은 프로덕션 환경에서 불안정

**해결**: ✅ 이미 적용됨 - Tailwind CSS 빌드 방식 사용

### 빌드 오류

```bash
# PostCSS 오류 시
npm install -D tailwindcss@^3.4.0 postcss autoprefixer

# 캐시 삭제 후 재빌드
rm -rf node_modules dist
npm install
npm run build
```

## 📊 애플리케이션 기능

### 사용자 유형
1. **시민 참여자**: 설문에 응답하고 보상 받기
2. **일반인 의뢰자**: 개인 프로젝트 설문 생성
3. **소상공인**: 시장 조사 및 매출 분석
4. **지자체**: 정책 수립 및 시민 여론 조사

### 핵심 기능
- 설문 생성 및 관리
- 보상 시스템 (모바일 상품권, 지역 상품권, USDT)
- 자동 추첨 시스템 (Fisher-Yates 알고리즘)
- 데이터 시각화 (Recharts)
- 블록체인 트랜잭션 검증
- localStorage 기반 데이터 저장

## 🔐 보안

- HTTPS 자동 적용
- 환경 변수로 민감한 정보 관리
- TypeScript로 타입 안전성 보장
- Cloudflare 보안 기능 활용
- IP 중복 참여 제한
- 불성실 응답 자동 제외

## 📝 라이선스

이 프로젝트의 라이선스는 프로젝트 소유자에게 문의하세요.

## 🙋‍♂️ 지원

문제가 있거나 질문이 있으시면 GitHub Issues를 통해 문의해주세요.

---

## 📈 배포 기록

### v1.3.0 (2026-02-01)
- ✅ 무한 로딩 문제 해결 (Google Gemini API 제거)
- ✅ localStorage 기반 즉시 로딩 구현
- ✅ 번들 크기 최적화: 917.83 kB → 656.92 kB (28% 감소)
- ✅ 외부 API 의존성 완전 제거

### v1.2.0 (2026-02-01)
- ✅ Import map 제거 (Vite 빌드 충돌 해결)
- ✅ React 앱 정상 렌더링 확인
- ✅ 모든 의존성 번들링 완료

### v1.1.0 (2026-02-01)
- ✅ Tailwind CDN → 빌드 방식 전환
- ✅ 프로덕션 환경 CSS 문제 해결
- ✅ PostCSS 설정 추가

### v1.0.0 (2026-02-01)
- ✅ Cloudflare Pages 초기 배포
- ✅ qa0202 프로젝트 생성
- ✅ feezone.store 도메인 연결

---

**배포 상태**:
- ✅ Cloudflare Pages 배포 완료
- ✅ Tailwind CSS 프로덕션 빌드 적용
- ✅ Import map 충돌 해결
- ✅ React 앱 정상 작동
- ✅ 커스텀 도메인 연결 완료 (feezone.store)
- ✅ 무한 로딩 문제 해결 완료
- ✅ 100% localStorage 기반 작동
- ✅ 모든 기능 즉시 로딩
