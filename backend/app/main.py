from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import products, sales, analytics, dashboard

app = FastAPI(
    title="SA pcstore Admin API",
    description="API for SA pcstore inventory and sales management",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(dashboard.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(sales.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "MegaPC Admin API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}