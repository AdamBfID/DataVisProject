from fastapi import APIRouter
from app.services.sales_service import sales_service
from app.services.product_service import product_service
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/")
async def get_dashboard_data():
    """Get all dashboard data"""
    # Get summary statistics
    sales_summary = sales_service.get_sales_summary()
    product_stats = product_service.get_product_stats()
    today_sales = sales_service.get_today_sales()
    
    # Get charts data
    daily_data = analytics_service.get_daily_analytics(7)
    brand_data = analytics_service.get_brand_analytics()
    top_products = sales_service.get_top_selling_products(5)
    
    return {
        "success": True,
        "data": {
            "stats": {
                "total_revenue": sales_summary['total_revenue'],
                "total_profit": sales_summary['total_profit'],
                "total_products": product_stats['total_products'],
                "total_sales": sales_summary['total_sales'],
                "today_sales": today_sales['count'],
                "today_revenue": today_sales['revenue'],
                "today_profit": today_sales['profit']
            },
            "charts": {
                "daily_trend": daily_data,
                "brand_performance": brand_data,
                "top_products": top_products
            }
        }
    }