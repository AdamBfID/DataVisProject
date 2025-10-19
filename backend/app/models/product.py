from pydantic import BaseModel
from typing import Optional

class Product(BaseModel):
    product_name: str
    brand: str
    series: str
    model: str
    screen_size: float
    screen_resolution: str
    screen_type: str
    cpu: str
    gpu: str
    ram: str
    storage: str
    os: str
    price: float
    image_url: str
    product_url: str
    tva_percentage: float
    stock_quantity: int
    buying_price: float
    price_with_tva: float
    profit_margin: float

class ProductSummary(BaseModel):
    product_name: str
    brand: str
    price: float
    stock_quantity: int
    profit_margin: float