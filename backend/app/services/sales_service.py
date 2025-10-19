import pandas as pd
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from app.db.database import db

class SalesService:
    @staticmethod
    def get_all_sales(limit: Optional[int] = None) -> List[Dict]:
        """Get all sales with optional limit"""
        df = db.get_sales()
        if df.empty:
            return []
        
        df = df.sort_values('sale_date', ascending=False)
        if limit:
            df = df.head(limit)
        return df.to_dict(orient='records')
    
    @staticmethod
    def get_recent_sales(days: int = 7) -> List[Dict]:
        """Get sales from the last N days"""
        df = db.get_sales()
        if df.empty:
            return []
        
        cutoff_date = datetime.now() - timedelta(days=days)
        recent = df[df['sale_date'] >= cutoff_date]
        return recent.sort_values('sale_date', ascending=False).to_dict(orient='records')
    
    @staticmethod
    def get_sales_by_date_range(start_date: str, end_date: str) -> List[Dict]:
        """Get sales within a date range"""
        df = db.get_sales()
        if df.empty:
            return []
        
        start = pd.to_datetime(start_date)
        end = pd.to_datetime(end_date)
        filtered = df[(df['sale_date'] >= start) & (df['sale_date'] <= end)]
        return filtered.to_dict(orient='records')
    
    @staticmethod
    def get_sales_summary() -> Dict:
        """Get overall sales summary"""
        df = db.get_sales()
        if df.empty:
            return {
                'total_sales': 0,
                'total_revenue': 0,
                'total_profit': 0,
                'total_cost': 0,
                'average_order_value': 0,
                'average_profit_margin': 0
            }
        
        return {
            'total_sales': int(df['quantity'].sum()),
            'total_revenue': float(df['total_amount'].sum()),
            'total_profit': float(df['total_profit'].sum()),
            'total_cost': float(df['total_cost'].sum()),
            'average_order_value': float(df['total_amount'].mean()),
            'average_profit_margin': float(df['profit_margin'].mean())
        }
    
    @staticmethod
    def get_today_sales() -> Dict:
        """Get today's sales statistics"""
        df = db.get_sales()
        if df.empty:
            return {'count': 0, 'revenue': 0, 'profit': 0}
        
        today = datetime.now().date()
        today_sales = df[df['date'] == pd.to_datetime(today)]
        
        return {
            'count': len(today_sales),
            'revenue': float(today_sales['total_amount'].sum()),
            'profit': float(today_sales['total_profit'].sum()),
            'avg_order_value': float(today_sales['total_amount'].mean()) if len(today_sales) > 0 else 0
        }
    
    @staticmethod
    def get_top_selling_products(limit: int = 10) -> List[Dict]:
        """Get top selling products"""
        df = db.get_sales()
        if df.empty:
            return []
        
        top_products = df.groupby('product_name').agg({
            'quantity': 'sum',
            'total_amount': 'sum',
            'total_profit': 'sum'
        }).sort_values('total_amount', ascending=False).head(limit)
        
        return top_products.reset_index().to_dict(orient='records')

sales_service = SalesService()