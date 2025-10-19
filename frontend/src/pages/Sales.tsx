import { DataTable } from '../components/dashboard/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Calendar, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../services/api';

type Sale = {
  sale_date: string;
  product_name: string;
  quantity: number;
  total_amount: number;
  total_profit: number;
};

export function Sales() {
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [todayStats, setTodayStats] = useState({
    count: 0,
    revenue: 0,
    profit: 0,
    avg_order_value: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const [sales, today] = await Promise.all([
          api.getRecentSales(7),
          api.getTodaySales(),
        ]);
        
        setRecentSales(sales);
        setTodayStats(today);
      } catch (error) {
        console.error('Failed to fetch sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales</h1>
          <p className="text-gray-500">Track and analyze all sales transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Filter by Date
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.count}</div>
            <p className="text-xs text-gray-500">transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.revenue.toLocaleString()} DT</div>
            <p className="text-xs text-gray-500">total revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.profit.toLocaleString()} DT</div>
            <p className="text-xs text-gray-500">net profit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg. Sale Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.avg_order_value.toLocaleString()} DT</div>
            <p className="text-xs text-gray-500">per transaction</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <DataTable
            title="Recent Transactions"
            columns={[
              { 
                key: 'sale_date', 
                header: 'Date',
                render: (value) => new Date(value).toLocaleString()
              },
              { key: 'product_name', header: 'Product' },
              { key: 'quantity', header: 'Qty' },
              {
                key: 'total_amount',
                header: 'Revenue',
                render: (value) => `${value.toLocaleString()} DT`,
              },
              {
                key: 'total_profit',
                header: 'Profit',
                render: (value) => `${value.toLocaleString()} DT`,
              },
            ]}
            data={recentSales}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}