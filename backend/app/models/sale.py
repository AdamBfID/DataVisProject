from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Sale(BaseModel):
    sale_date: str
    product_name: str
    brand: str
    series: str
    cpu: str
    gpu: str
    ram: str
    quantity: int
    buying_price: float
    unit_price: float
    unit_profit: float
    tva_percentage: float
    unit_price_with_tva: float
    total_amount: float
    total_cost: float
    total_profit: float
    profit_margin: float
    date: str
    year: int
    month: int
    week: int
    day_of_week: str
    hour: int

class SalesSummary(BaseModel):
    total_sales: int
    total_revenue: float
    total_profit: float
    average_order_value: float