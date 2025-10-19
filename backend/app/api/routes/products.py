from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.services.product_service import product_service

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/")
async def get_products():
    """Get all products"""
    products = product_service.get_all_products()
    return {"success": True, "data": products, "count": len(products)}

@router.get("/search")
async def search_products(q: str = Query(..., min_length=1)):
    """Search products"""
    results = product_service.search_products(q)
    return {"success": True, "data": results, "count": len(results)}

@router.get("/brands")
async def get_brands():
    """Get all brands"""
    brands = product_service.get_brands()
    return {"success": True, "data": brands}

@router.get("/brands/{brand}")
async def get_products_by_brand(brand: str):
    """Get products by brand"""
    products = product_service.get_products_by_brand(brand)
    return {"success": True, "data": products, "count": len(products)}

@router.get("/low-stock")
async def get_low_stock(threshold: int = Query(10, ge=0)):
    """Get low stock products"""
    products = product_service.get_low_stock_products(threshold)
    return {"success": True, "data": products, "count": len(products)}

@router.get("/stats")
async def get_product_stats():
    """Get product statistics"""
    stats = product_service.get_product_stats()
    return {"success": True, "data": stats}

@router.get("/{product_name}")
async def get_product(product_name: str):
    """Get a specific product"""
    product = product_service.get_product_by_name(product_name)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"success": True, "data": product}