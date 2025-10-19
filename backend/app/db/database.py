import pandas as pd
from typing import Optional
import os

class Database:
    def __init__(self):
        self.base_path = os.path.join(os.path.dirname(__file__), '../../data')
        self.products_df: Optional[pd.DataFrame] = None
        self.sales_df: Optional[pd.DataFrame] = None
        self.load_data()
    
    def load_data(self):
        """Load CSV files into DataFrames"""
        try:
            products_path = os.path.join(self.base_path, 'megapc_products_updated.csv')
            sales_path = os.path.join(self.base_path, 'sales_data.csv')
            
            self.products_df = pd.read_csv(products_path)
            
            # Try to load sales data if it exists
            if os.path.exists(sales_path):
                self.sales_df = pd.read_csv(sales_path)
                # Convert date columns to datetime
                self.sales_df['sale_date'] = pd.to_datetime(self.sales_df['sale_date'])
                self.sales_df['date'] = pd.to_datetime(self.sales_df['date'])
            else:
                print("Warning: sales_data.csv not found. Sales endpoints will return empty data.")
                self.sales_df = pd.DataFrame()
                
        except Exception as e:
            print(f"Error loading data: {e}")
            raise
    
    def get_products(self) -> pd.DataFrame:
        return self.products_df.copy()
    
    def get_sales(self) -> pd.DataFrame:
        return self.sales_df.copy() if not self.sales_df.empty else pd.DataFrame()
    
    def reload_data(self):
        """Reload data from CSV files"""
        self.load_data()

# Global database instance
db = Database()