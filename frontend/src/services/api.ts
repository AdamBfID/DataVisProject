const API_BASE_URL = 'http://localhost:8000/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

class ApiService {
  private async fetchApi<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    const result: ApiResponse<T> = await response.json();
    return result.data;
  }

  // Dashboard endpoints
  async getDashboardData() {
    return this.fetchApi<{
      stats: {
        total_revenue: number;
        total_profit: number;
        total_products: number;
        total_sales: number;
        today_sales: number;
        today_revenue: number;
        today_profit: number;
      };
      charts: {
        daily_trend: Array<{
          date: string;
          total_amount: number;
          total_profit: number;
          quantity: number;
        }>;
        brand_performance: Array<{
          brand: string;
          total_amount: number;
          total_profit: number;
        }>;
        top_products: Array<{
          product_name: string;
          quantity: number;
          total_amount: number;
          total_profit: number;
        }>;
      };
    }>('/dashboard');
  }

  // Products endpoints
  async getProducts() {
    return this.fetchApi<any[]>('/products');
  }

  async searchProducts(query: string) {
    return this.fetchApi<any[]>(`/products/search?q=${encodeURIComponent(query)}`);
  }

  async getProductStats() {
    return this.fetchApi<{
      total_products: number;
      total_brands: number;
      total_stock_value: number;
      average_price: number;
      average_profit_margin: number;
      low_stock_count: number;
    }>('/products/stats');
  }

  async getLowStockProducts(threshold: number = 10) {
    return this.fetchApi<any[]>(`/products/low-stock?threshold=${threshold}`);
  }

  // Sales endpoints
  async getSales(limit?: number) {
    const url = limit ? `/sales?limit=${limit}` : '/sales';
    return this.fetchApi<any[]>(url);
  }

  async getRecentSales(days: number = 7) {
    return this.fetchApi<any[]>(`/sales/recent?days=${days}`);
  }

  async getSalesSummary() {
    return this.fetchApi<{
      total_sales: number;
      total_revenue: number;
      total_profit: number;
      total_cost: number;
      average_order_value: number;
      average_profit_margin: number;
    }>('/sales/summary');
  }

  async getTodaySales() {
    return this.fetchApi<{
      count: number;
      revenue: number;
      profit: number;
      avg_order_value: number;
    }>('/sales/today');
  }

  async getTopProducts(limit: number = 10) {
    return this.fetchApi<any[]>(`/sales/top-products?limit=${limit}`);
  }

  // Analytics endpoints
  async getDailyAnalytics(days: number = 30) {
    return this.fetchApi<any[]>(`/analytics/daily?days=${days}`);
  }

  async getMonthlyAnalytics() {
    return this.fetchApi<any[]>('/analytics/monthly');
  }

  async getWeeklyAnalytics() {
    return this.fetchApi<any[]>('/analytics/weekly');
  }

  async getHourlyAnalytics() {
    return this.fetchApi<any[]>('/analytics/hourly');
  }

  async getBrandAnalytics() {
    return this.fetchApi<any[]>('/analytics/brands');
  }

  async getGpuAnalytics() {
    return this.fetchApi<any[]>('/analytics/gpu');
  }

  async getCpuAnalytics() {
    return this.fetchApi<any[]>('/analytics/cpu');
  }
}

export const api = new ApiService();