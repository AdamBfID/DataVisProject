import pandas as pd
from typing import List, Dict
from app.db.database import db

class AnalyticsService:
    @staticmethod
    def get_daily_analytics(days: int = 30) -> List[Dict]:
        """Get daily sales analytics"""
        df = db.get_sales()
        if df.empty:
            return []
        
        daily = df.groupby('date').agg({
            'total_amount': 'sum',
            'total_cost': 'sum',
            'total_profit': 'sum',
            'quantity': 'sum'
        }).reset_index()
        
        daily['profit_margin'] = (daily['total_profit'] / daily['total_cost'] * 100)
        daily['date'] = daily['date'].astype(str)
        
        return daily.tail(days).to_dict(orient='records')
    
    @staticmethod
    def get_monthly_analytics() -> List[Dict]:
        """Get monthly sales analytics"""
        df = db.get_sales()
        if df.empty:
            return []
        
        monthly = df.groupby(['year', 'month']).agg({
            'total_amount': 'sum',
            'total_cost': 'sum',
            'total_profit': 'sum',
            'quantity': 'sum'
        }).reset_index()
        
        monthly['period'] = monthly['year'].astype(str) + '-' + monthly['month'].astype(str).str.zfill(2)
        monthly['profit_margin'] = (monthly['total_profit'] / monthly['total_cost'] * 100)
        
        return monthly.to_dict(orient='records')
    
    @staticmethod
    def get_weekly_analytics() -> List[Dict]:
        """Get weekly sales analytics"""
        df = db.get_sales()
        if df.empty:
            return []
        
        weekly = df.groupby('day_of_week').agg({
            'total_amount': 'sum',
            'total_profit': 'sum',
            'quantity': 'sum'
        }).reindex(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
        
        return weekly.reset_index().rename(columns={'day_of_week': 'day'}).to_dict(orient='records')
    
    @staticmethod
    def get_hourly_analytics() -> List[Dict]:
        """Get hourly sales analytics"""
        df = db.get_sales()
        if df.empty:
            return []
        
        hourly = df.groupby('hour').agg({
            'total_amount': 'sum',
            'total_profit': 'sum',
            'quantity': 'sum'
        }).reset_index()
        
        hourly['hour'] = hourly['hour'].astype(str) + 'h'
        return hourly.to_dict(orient='records')
    
    @staticmethod
    def get_brand_analytics() -> List[Dict]:
        """Get brand performance analytics"""
        df = db.get_sales()
        if df.empty:
            return []
        
        brand_analysis = df.groupby('brand').agg({
            'total_amount': 'sum',
            'total_profit': 'sum',
            'quantity': 'sum',
            'profit_margin': 'mean'
        }).sort_values('total_profit', ascending=False)
        
        return brand_analysis.reset_index().to_dict(orient='records')
    
    @staticmethod
    def get_gpu_analytics() -> List[Dict]:
        """Get GPU performance analytics"""
        df = db.get_sales()
        if df.empty:
            return []
        
        gpu_analysis = df.groupby('gpu').agg({
            'total_amount': 'sum',
            'total_profit': 'sum',
            'quantity': 'sum',
            'profit_margin': 'mean'
        }).sort_values('total_profit', ascending=False)
        
        return gpu_analysis.reset_index().to_dict(orient='records')
    
    @staticmethod
    def get_cpu_analytics() -> List[Dict]:
        """Get CPU performance analytics"""
        df = db.get_sales()
        if df.empty:
            return []
        
        cpu_analysis = df.groupby('cpu').agg({
            'total_amount': 'sum',
            'total_profit': 'sum',
            'quantity': 'sum',
            'profit_margin': 'mean'
        }).sort_values('total_profit', ascending=False)
        
        return cpu_analysis.reset_index().to_dict(orient='records')

analytics_service = AnalyticsService()