# Stock Web Frontend

Material-UI와 Vite를 사용한 주식 분석 시스템 프론트엔드입니다.

## 주요 기능

- **섹터별 기업 정보**: 섹터를 선택하여 해당 섹터의 기업 목록과 재무 정보를 조회
- **재무 차트**: 기업별 재무 데이터를 시각화한 차트 제공
- **반응형 디자인**: 다양한 화면 크기에 최적화된 UI
- **HTTPS 지원**: 보안 연결을 통한 안전한 데이터 전송

## 기술 스택

- **React 18**: 최신 React 기능 활용
- **Vite**: 빠른 개발 서버와 빌드 도구
- **Material-UI (MUI)**: Google Material Design 기반 UI 컴포넌트
- **Recharts**: 차트 라이브러리
- **Axios**: HTTP 클라이언트
- **React Router**: 클라이언트 사이드 라우팅

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. HTTPS 인증서 생성 및 개발 서버 실행
```bash
# 인증서 생성 후 개발 서버 시작
npm run setup

# 또는 단계별 실행
npm run generate-certs  # 인증서 생성
npm run dev            # 개발 서버 시작
```

### 3. 브라우저 접속
- **HTTPS**: `https://localhost:3000`
- **HTTP**: `http://localhost:3000` (인증서가 없는 경우)

### 4. 프로덕션 빌드
```bash
npm run build
```

## API 연동

백엔드 FastAPI 서버와 연동됩니다:
- **섹터 목록**: `POST /sector-list`
- **섹터별 회사 목록**: `POST /sector-company-list`

API 서버 설정은 `src/config.json`에서 변경할 수 있습니다.

## 주요 개선사항

### Ant Design → Material-UI 마이그레이션
- **일관된 디자인**: Google Material Design 가이드라인 준수
- **더 나은 접근성**: ARIA 속성과 키보드 네비게이션 지원
- **현대적인 UI**: 깔끔하고 직관적인 사용자 인터페이스

### 코드 개선
- **함수형 컴포넌트**: React Hooks를 사용한 현대적인 React 패턴
- **타입 안전성**: PropTypes 대신 더 나은 타입 체크
- **성능 최적화**: 불필요한 리렌더링 방지
- **에러 처리**: 사용자 친화적인 에러 메시지

### 차트 개선
- **Recharts**: 더 가벼우고 사용하기 쉬운 차트 라이브러리
- **반응형 차트**: 화면 크기에 따라 자동 조정
- **인터랙티브**: 툴팁과 호버 효과 제공

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   └── FinanceChart.js  # 재무 차트 컴포넌트
├── containers/          # 페이지 컴포넌트
│   ├── SectorView.js    # 섹터별 기업 정보 페이지
│   └── QuantView.js     # 퀀트 분석 페이지
├── App.js              # 메인 앱 컴포넌트
├── config.json         # API 설정
└── index.js           # 앱 진입점
```

## 개발 가이드

### 새로운 컴포넌트 추가
1. `src/components/` 또는 `src/containers/`에 파일 생성
2. Material-UI 컴포넌트 사용
3. 일관된 스타일링을 위해 `sx` prop 활용

### API 연동
1. `src/config.json`에서 API 엔드포인트 설정
2. `axios`를 사용하여 HTTP 요청
3. 적절한 에러 처리 구현

### 스타일링
- Material-UI의 `sx` prop 사용 권장
- 테마 시스템 활용
- 반응형 디자인 고려