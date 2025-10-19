export interface Product {
  product_name: string;
  brand: string;
  series: string;
  cpu: string;
  gpu: string;
  ram: string;
  price: number;
  buying_price: number;
  profit_margin: number;
  tva_percentage: number;
  stock_quantity: number;
  price_with_tva: number;
}

export interface Sale {
  sale_date: string;
  product_name: string;
  brand: string;
  cpu: string;
  gpu: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  total_cost: number;
  total_profit: number;
  profit_margin: number;
  date: string;
  year: number;
  month: number;
  week: number;
  day_of_week: string;
  hour: number;
}

export interface DailyStats {
  date: string;
  total_amount: number;
  total_cost: number;
  total_profit: number;
  quantity: number;
  profit_margin: number;
}

export interface MonthlyStats {
  period: string;
  total_amount: number;
  total_profit: number;
  profit_margin: number;
  quantity: number;
}

export interface BrandStats {
  brand: string;
  total_amount: number;
  total_profit: number;
  quantity: number;
  profit_margin: number;
}