# RewardVoice - 리워드보이스

React + Vite + Tailwind CSS 기반의 리워드 음성 인식 애플리케이션입니다.

## 🌐 배포 URL

- **프로덕션**: https://qa0202.pages.dev
- **최신 배포**: https://fe361ef0.qa0202.pages.dev
- **커스텀 도메인**: feezone.store (연결 완료)
- **GitHub 저장소**: https://github.com/langsb16-collab/QA0201

## ✅ 최근 수정 사항

### 🔧 Tailwind CSS 프로덕션 빌드 적용 (2026-02-01)

**문제**: Tailwind CDN 사용으로 인한 프로덕션 환경 CSS 미적용 (흰 화면)
- CDN 방식은 런타임 의존으로 Cloudflare Pages에서 불안정
- 콘솔 경고: "cdn.tailwindcss.com should not be used in production"

**해결**:
- ✅ Tailwind CSS v3.4.0 빌드 방식으로 전환
- ✅ PostCSS 설정 추가 (`postcss.config.js`)
- ✅ Tailwind 설정 파일 생성 (`tailwind.config.js`)
- ✅ CSS 진입점 생성 (`src/index.css`)
- ✅ 빌드 시 CSS 파일 생성 (37.11 kB)
- ✅ Cloudflare Pages 재배포 완료

**결과**:
- 빈 화면 문제 해결
- 프로덕션 환경에서 정상 작동
- 빌드된 CSS로 빠른 로딩 속도

## ✨ 주요 기능

- React 19.2.4 기반 모던 웹 애플리케이션
- Google Gemini AI 통합
- Recharts를 활용한 데이터 시각화
- Tailwind CSS 기반 반응형 디자인 (프로덕션 빌드)
- TypeScript 지원

## 📦 기술 스택

- **프레임워크**: React 19.2.4
- **빌드 도구**: Vite 6.2.0
- **언어**: TypeScript 5.8.2
- **스타일링**: Tailwind CSS 3.4.0 (빌드 방식)
- **PostCSS**: postcss, autoprefixer
- **AI**: Google Gemini AI (@google/genai)
- **차트**: Recharts 3.7.0
- **배포**: Cloudflare Pages (qa0202)

## 🚀 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (포트 3000)
npm run dev

# 프로덕션 빌드 (Tailwind CSS 컴파일 포함)
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
   ```

3. **자동 적용**:
   - Vite가 `index.tsx`에서 임포트된 CSS를 자동 처리
   - HTML에 `<link>` 태그 자동 삽입

### ⚠️ 중요: CDN 방식 사용 금지

```html
<!-- ❌ 사용하지 마세요 (프로덕션에서 작동하지 않음) -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- ✅ 빌드된 CSS 사용 (Vite가 자동 처리) -->
import './src/index.css' // index.tsx에서
```

## 🔗 커스텀 도메인 (feezone.store)

도메인 연결이 완료되었습니다!

### Cloudflare Dashboard 설정 확인

1. **Cloudflare Dashboard**: https://dash.cloudflare.com
2. **Pages 프로젝트**: Workers & Pages > qa0202
3. **Custom domains**: feezone.store 연결 완료
4. **DNS 레코드**:
   - Type: `CNAME`
   - Name: `@` 또는 `feezone.store`
   - Target: `qa0202.pages.dev`
   - Proxy: Enabled (🟠)

5. **SSL/TLS**: 자동 활성화됨

## 📁 프로젝트 구조

```
webapp/
├── src/
│   └── index.css          # Tailwind CSS 진입점
├── components/            # React 컴포넌트
├── screens/              # 화면 컴포넌트
├── services/             # API 서비스
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
- **프로덕션 빌드**: Tailwind CSS 빌드 방식으로 안정적인 스타일링
- **AI 통합**: Google Gemini AI 연동
- **반응형 디자인**: 모바일/태블릿/데스크톱 지원
- **글로벌 배포**: Cloudflare Pages로 전 세계 엣지 네트워크 활용

## 🐛 문제 해결

### 흰 화면 / CSS 미적용

**증상**: 배포 후 흰 화면만 표시되고 콘솔에 Tailwind CDN 경고

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

## 📊 데이터 시각화

Recharts 라이브러리를 사용하여 다양한 차트와 그래프를 제공합니다.

## 🔐 보안

- HTTPS 자동 적용
- 환경 변수로 민감한 정보 관리
- TypeScript로 타입 안전성 보장
- Cloudflare 보안 기능 활용

## 📝 라이선스

이 프로젝트의 라이선스는 프로젝트 소유자에게 문의하세요.

## 🙋‍♂️ 지원

문제가 있거나 질문이 있으시면 GitHub Issues를 통해 문의해주세요.

---

## 📈 배포 기록

### v1.1.0 (2026-02-01)
- ✅ Tailwind CDN → 빌드 방식 전환
- ✅ 프로덕션 환경 CSS 문제 해결
- ✅ PostCSS 설정 추가
- ✅ 빌드 크기 최적화

### v1.0.0 (2026-02-01)
- ✅ Cloudflare Pages 초기 배포
- ✅ qa0202 프로젝트 생성
- ✅ feezone.store 도메인 연결

---

**배포 상태**:
- ✅ Cloudflare Pages 배포 완료
- ✅ Tailwind CSS 프로덕션 빌드 적용
- ✅ 커스텀 도메인 연결 완료 (feezone.store)
- ✅ 모든 기능 정상 작동
