import { StatsCard } from '../components/dashboard/StatsCard';
import { LineChart } from '../components/charts/LineChart';
import { PieChart } from '../components/charts/PieChart';
import { DataTable } from '../components/dashboard/DataTable';
import {
  DollarSign,
  TrendingUp,
  Package,
  ShoppingCart,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalProducts: 0,
    totalSales: 0,
  });
  const [dailyData, setDailyData] = useState<{ date: string; revenue: number; profit: number }[]>([]);
  const [brandData, setBrandData] = useState<{ brand: string; value: number }[]>([]);
  const [topProducts, setTopProducts] = useState<{ product: string; sales: number; revenue: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await api.getDashboardData();
        
        // Set stats
        setStats({
          totalRevenue: data.stats.total_revenue,
          totalProfit: data.stats.total_profit,
          totalProducts: data.stats.total_products,
          totalSales: data.stats.total_sales,
        });

        // Set daily data for chart
        const dailyChartData = data.charts.daily_trend.map(item => ({
          date: item.date,
          revenue: parseFloat(item.total_amount.toFixed(2)),
          profit: parseFloat(item.total_profit.toFixed(2)),
        }));
        setDailyData(dailyChartData);

        // Set brand data for pie chart
        const brandChartData = data.charts.brand_performance.map(item => ({
          brand: item.brand,
          value: parseFloat(item.total_amount.toFixed(2)),
        }));
        setBrandData(brandChartData);

        // Set top products
        const topProductsData = data.charts.top_products.map(item => ({
          product: item.product_name,
          sales: item.quantity,
          revenue: `${item.total_amount.toFixed(0).toLocaleString()} DT`,
        }));
        setTopProducts(topProductsData);

        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's your business overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`${stats.totalRevenue.toLocaleString()} DT`}
          change={12.5}
          icon={DollarSign}
          trend="up"
        />
        <StatsCard
          title="Total Profit"
          value={`${stats.totalProfit.toLocaleString()} DT`}
          change={8.2}
          icon={TrendingUp}
          trend="up"
        />
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
        />
        <StatsCard
          title="Total Sales"
          value={stats.totalSales}
          change={15.3}
          icon={ShoppingCart}
          trend="up"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <LineChart
          title="Revenue & Profit Trend"
          data={dailyData}
          dataKeys={[
            { key: 'revenue', color: '#000000', name: 'Revenue' },
            { key: 'profit', color: '#666666', name: 'Profit' },
          ]}
          xAxisKey="date"
        />
        <PieChart
          title="Revenue by Brand"
          data={brandData}
          dataKey="value"
          nameKey="brand"
          colors={['#000000', '#333333', '#666666', '#999999']}
        />
      </div>

      {/* Top Products Table */}
      <DataTable
        title="Top Selling Products"
        columns={[
          { key: 'product', header: 'Product' },
          { key: 'sales', header: 'Sales' },
          { key: 'revenue', header: 'Revenue' },
        ]}
        data={topProducts}
      />
    </div>
  );
}