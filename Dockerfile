# 1단계: 프론트엔드 빌드
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# 2단계: 백엔드 + 프론트엔드 정적파일
FROM python:3.11-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .
COPY data/ ./data/

# 프론트엔드 빌드 결과물 복사
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Cloud Run은 PORT 환경변수를 주입함
ENV PORT=8080
EXPOSE 8080

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]