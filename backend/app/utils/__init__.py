# File: /home/adambtw/Projects/Stockpc /backend/main.py

from fastapi import FastAPI
from fastapi.responses import JSONResponse
import pandas as pd

app = FastAPI()

# Load the CSV data into a DataFrame
df = pd.read_csv('/home/adambtw/Projects/Stockpc /megapc_products_updated.csv')

@app.get("/products")
def get_products():
    products = df.to_dict(orient='records')
    return JSONResponse(content=products)

@app.get("/products/{product_name}")
def get_product(product_name: str):
    product = df[df['product_name'].str.contains(product_name, case=False)]
    if not product.empty:
        return JSONResponse(content=product.to_dict(orient='records'))
    return JSONResponse(content={"error": "Product not found"}, status_code=404)

@app.get("/products/brands")
def get_brands():
    brands = df['brand'].unique().tolist()
    return JSONResponse(content=brands)

@app.get("/products/stock")
def get_stock():
    stock_data = df[['product_name', 'stock_quantity']].to_dict(orient='records')
    return JSONResponse(content=stock_data)