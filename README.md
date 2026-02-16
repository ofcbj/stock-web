# Stock Web API

FastAPI로 구현된 주식 데이터 API 서버입니다.

## 설치 및 실행

### 1. 의존성 설치
```bash
pip install -r requirements.txt
```

### 2. 서버 실행
```bash
python run.py
```

또는

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. API 문서 확인
서버 실행 후 브라우저에서 다음 URL로 접속:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API 엔드포인트

### 1. 섹터 목록 조회
- **URL**: `POST /sector-list`
- **요청**: 빈 객체 `{}`
- **응답**: 
```json
{
  "status": "success",
  "sectorList": ["섹터1", "섹터2", ...]
}
```

### 2. 섹터별 회사 목록 및 재무 정보 조회
- **URL**: `POST /sector-company-list`
- **요청**:
```json
{
  "sector": "섹터명"
}
```
- **응답**:
```json
{
  "status": "success",
  "companyList": ["회사1", "회사2", ...],
  "financeList": "[{\"code\":\"123\",\"revenue\":1000},...]"
}
```

## 데이터베이스

SQLite 데이터베이스 파일은 `../data/stock.db` 경로에 있어야 합니다.

## 주요 개선사항

1. **간단한 구조**: Django의 복잡한 설정 없이 FastAPI의 간단한 구조 사용
2. **타입 안전성**: Pydantic 모델을 사용한 요청/응답 검증
3. **자동 문서화**: Swagger UI와 ReDoc을 통한 자동 API 문서 생성
4. **에러 처리**: 적절한 HTTP 상태 코드와 에러 메시지
5. **CORS 지원**: 웹 프론트엔드에서의 접근 허용
6. **연결 관리**: 매 요청마다 새로운 DB 연결을 생성하여 안정성 향상

