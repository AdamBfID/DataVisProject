import pandas as pd
from typing import List, Dict, Optional
from app.db.database import db

class ProductService:
    @staticmethod
    def get_all_products() -> List[Dict]:
        """Get all products"""
        df = db.get_products()
        return df.to_dict(orient='records')
    
    @staticmethod
    def get_product_by_name(name: str) -> Optional[Dict]:
        """Get a specific product by name"""
        df = db.get_products()
        product = df[df['product_name'].str.contains(name, case=False, na=False)]
        if product.empty:
            return None
        return product.iloc[0].to_dict()
    
    @staticmethod
    def search_products(query: str) -> List[Dict]:
        """Search products by name, brand, or specs"""
        df = db.get_products()
        mask = (
            df['product_name'].str.contains(query, case=False, na=False) |
            df['brand'].str.contains(query, case=False, na=False) |
            df['cpu'].str.contains(query, case=False, na=False) |
            df['gpu'].str.contains(query, case=False, na=False)
        )
        results = df[mask]
        return results.to_dict(orient='records')
    
    @staticmethod
    def get_brands() -> List[str]:
        """Get all unique brands"""
        df = db.get_products()
        return df['brand'].unique().tolist()
    
    @staticmethod
    def get_products_by_brand(brand: str) -> List[Dict]:
        """Get products by brand"""
        df = db.get_products()
        products = df[df['brand'].str.lower() == brand.lower()]
        return products.to_dict(orient='records')
    
    @staticmethod
    def get_low_stock_products(threshold: int = 10) -> List[Dict]:
        """Get products with low stock"""
        df = db.get_products()
        low_stock = df[df['stock_quantity'] <= threshold]
        return low_stock.to_dict(orient='records')
    
    @staticmethod
    def get_product_stats() -> Dict:
        """Get product statistics"""
        df = db.get_products()
        return {
            'total_products': len(df),
            'total_brands': df['brand'].nunique(),
            'total_stock_value': float(df['price'].sum()),
            'average_price': float(df['price'].mean()),
            'average_profit_margin': float(df['profit_margin'].mean()),
            'low_stock_count': len(df[df['stock_quantity'] <= 10])
        }

product_service = ProductService()