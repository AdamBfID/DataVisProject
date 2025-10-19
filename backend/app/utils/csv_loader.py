import pandas as pd
import os
from typing import Optional

class CSVLoader:
    """Utility class for loading and managing CSV data"""
    
    def __init__(self, data_dir: str = None):
        if data_dir is None:
            # Default to data directory relative to this file
            self.data_dir = os.path.join(os.path.dirname(__file__), '../../data')
        else:
            self.data_dir = data_dir
    
    def load_products(self) -> pd.DataFrame:
        """Load products from CSV file"""
        file_path = os.path.join(self.data_dir, 'megapc_products_updated.csv')
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Products file not found: {file_path}")
        
        df = pd.read_csv(file_path)
        return df
    
    def load_sales(self) -> pd.DataFrame:
        """Load sales from CSV file"""
        file_path = os.path.join(self.data_dir, 'sales_data.csv')
        if not os.path.exists(file_path):
            print(f"Warning: Sales file not found: {file_path}")
            return pd.DataFrame()
        
        df = pd.read_csv(file_path)
        # Convert date columns
        if 'sale_date' in df.columns:
            df['sale_date'] = pd.to_datetime(df['sale_date'])
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
        
        return df
    
    def save_products(self, df: pd.DataFrame) -> bool:
        """Save products to CSV file"""
        try:
            file_path = os.path.join(self.data_dir, 'megapc_products_updated.csv')
            df.to_csv(file_path, index=False)
            return True
        except Exception as e:
            print(f"Error saving products: {e}")
            return False
    
    def save_sales(self, df: pd.DataFrame) -> bool:
        """Save sales to CSV file"""
        try:
            file_path = os.path.join(self.data_dir, 'sales_data.csv')
            df.to_csv(file_path, index=False)
            return True
        except Exception as e:
            print(f"Error saving sales: {e}")
            return False
    
    def validate_products_schema(self, df: pd.DataFrame) -> bool:
        """Validate products DataFrame schema"""
        required_columns = [
            'product_name', 'brand', 'price', 'buying_price', 
            'stock_quantity', 'profit_margin'
        ]
        return all(col in df.columns for col in required_columns)
    
    def validate_sales_schema(self, df: pd.DataFrame) -> bool:
        """Validate sales DataFrame schema"""
        required_columns = [
            'sale_date', 'product_name', 'quantity', 
            'total_amount', 'total_profit'
        ]
        return all(col in df.columns for col in required_columns)

# Create a global instance
csv_loader = CSVLoader()