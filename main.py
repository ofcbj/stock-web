import os
from typing import List

import sqlite3
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="Stock API", version="1.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic 모델들
class SectorCompanyRequest(BaseModel):
    sector: str

class SectorResponse(BaseModel):
    status: str
    sectorList: List[str]

class SectorCompanyResponse(BaseModel):
    status: str
    companyList: List[str]
    financeList: str

# 데이터베이스 연결 관리
def get_db_connection():
    """데이터베이스 연결을 반환합니다."""
    db_path = os.path.join(os.path.dirname(__file__), 'data', 'stock.db')
    return sqlite3.connect(db_path)

def get_dataframe(query: str, limit_rows: bool = False):
    """SQL 쿼리를 실행하고 DataFrame을 반환합니다."""
    conn = get_db_connection()
    try:
        df = pd.read_sql(query, conn)
        if limit_rows and len(df) > 10:
            df = df.iloc[0:10]
        return df
    except Exception as e:
        print(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        conn.close()

@app.get("/sector-list", response_model=SectorResponse)
async def sector_list():
    """섹터 목록을 반환합니다."""
    try:
        query = """
        SELECT
            DISTINCT sectorBig
        FROM
            company
        ORDER BY sectorBig
        """
        df = get_dataframe(query)

        return SectorResponse(
            status="success",
            sectorList=df['sectorBig'].tolist()
        )
    except Exception as e:
        print(f"Error in sector_list: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch sector list")

@app.post("/sector-company-list", response_model=SectorCompanyResponse)
async def sector_company_list(request: SectorCompanyRequest):
    """특정 섹터의 회사 목록과 재무 정보를 반환합니다."""
    try:
        # 회사 목록 조회
        company_query = f"""
        SELECT
            DISTINCT name
        FROM
            company
        WHERE
            sectorBig='{request.sector}'
        ORDER BY name
        """
        company_df = get_dataframe(company_query)

        # 재무 정보 조회
        finance_query = f"""
        SELECT
            f.*
        FROM
            finance f
        INNER JOIN company c ON f.code=c.code
        WHERE
            c.sectorBig='{request.sector}'
        ORDER BY c.name
        """
        finance_df = get_dataframe(finance_query)

        return SectorCompanyResponse(
            status="success",
            companyList=company_df['name'].tolist(),
            financeList=finance_df.to_json(orient='records')
        )
    except Exception as e:
        print(f"Error in sector_company_list: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch sector company data")

# 프론트엔드 빌드 파일 서빙
frontend_dir = os.path.join(os.path.dirname(__file__), 'frontend', 'dist')
if os.path.exists(frontend_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dir, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        return FileResponse(os.path.join(frontend_dir, "index.html"))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
