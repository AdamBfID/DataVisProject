from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime
from app.services.sales_service import sales_service

router = APIRouter(prefix="/sales", tags=["sales"])

@router.get("/")
async def get_sales(limit: Optional[int] = Query(None, ge=1)):
    """Get all sales"""
    sales = sales_service.get_all_sales(limit)
    return {"success": True, "data": sales, "count": len(sales)}

@router.get("/recent")
async def get_recent_sales(days: int = Query(7, ge=1)):
    """Get recent sales"""
    sales = sales_service.get_recent_sales(days)
    return {"success": True, "data": sales, "count": len(sales)}

@router.get("/date-range")
async def get_sales_by_date_range(
    start_date: str = Query(..., description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date (YYYY-MM-DD)")
):
    """Get sales within date range"""
    try:
        sales = sales_service.get_sales_by_date_range(start_date, end_date)
        return {"success": True, "data": sales, "count": len(sales)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {str(e)}")

@router.get("/summary")
async def get_sales_summary():
    """Get sales summary"""
    summary = sales_service.get_sales_summary()
    return {"success": True, "data": summary}

@router.get("/today")
async def get_today_sales():
    """Get today's sales"""
    today_data = sales_service.get_today_sales()
    return {"success": True, "data": today_data}

@router.get("/top-products")
async def get_top_products(limit: int = Query(10, ge=1, le=50)):
    """Get top selling products"""
    products = sales_service.get_top_selling_products(limit)
    return {"success": True, "data": products, "count": len(products)}