from fastapi import APIRouter, Query
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/daily")
async def get_daily_analytics(days: int = Query(30, ge=1, le=365)):
    """Get daily analytics"""
    data = analytics_service.get_daily_analytics(days)
    return {"success": True, "data": data, "count": len(data)}

@router.get("/monthly")
async def get_monthly_analytics():
    """Get monthly analytics"""
    data = analytics_service.get_monthly_analytics()
    return {"success": True, "data": data, "count": len(data)}

@router.get("/weekly")
async def get_weekly_analytics():
    """Get weekly analytics"""
    data = analytics_service.get_weekly_analytics()
    return {"success": True, "data": data}

@router.get("/hourly")
async def get_hourly_analytics():
    """Get hourly analytics"""
    data = analytics_service.get_hourly_analytics()
    return {"success": True, "data": data, "count": len(data)}

@router.get("/brands")
async def get_brand_analytics():
    """Get brand performance analytics"""
    data = analytics_service.get_brand_analytics()
    return {"success": True, "data": data, "count": len(data)}

@router.get("/gpu")
async def get_gpu_analytics():
    """Get GPU performance analytics"""
    data = analytics_service.get_gpu_analytics()
    return {"success": True, "data": data, "count": len(data)}

@router.get("/cpu")
async def get_cpu_analytics():
    """Get CPU performance analytics"""
    data = analytics_service.get_cpu_analytics()
    return {"success": True, "data": data, "count": len(data)}