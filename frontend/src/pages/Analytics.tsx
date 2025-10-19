import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { AreaChart } from '../components/charts/AreaChart';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

type MonthlyDatum = { period: string; total_amount: number; total_profit: number; profit_margin: number };
type HourlyDatum = { hour: string; quantity: number };
type WeeklyDatum = { day: string; quantity: number; total_profit: number };

export function Analytics() {
  const [monthlyData, setMonthlyData] = useState<MonthlyDatum[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyDatum[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyDatum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const [monthly, hourly, weekly] = await Promise.all([
          api.getMonthlyAnalytics(),
          api.getHourlyAnalytics(),
          api.getWeeklyAnalytics(),
        ]);

        setMonthlyData(monthly);
        setHourlyData(hourly);
        setWeeklyData(weekly);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-500">Detailed sales and profit analytics</p>
      </div>

      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-4">
          <div className="grid gap-4">
            <AreaChart
              title="Monthly Revenue & Profit"
              data={monthlyData}
              dataKeys={[
                { key: 'total_amount', color: '#000000', name: 'Revenue' },
                { key: 'total_profit', color: '#666666', name: 'Profit' },
              ]}
              xAxisKey="period"
            />
            <LineChart
              title="Profit Margin Trend"
              data={monthlyData}
              dataKeys={[
                { key: 'profit_margin', color: '#000000', name: 'Margin %' },
              ]}
              xAxisKey="period"
            />
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <BarChart
            title="Weekly Sales & Profit"
            data={weeklyData}
            dataKeys={[
              { key: 'quantity', color: '#000000', name: 'Sales' },
              { key: 'total_profit', color: '#666666', name: 'Profit' },
            ]}
            xAxisKey="day"
          />
        </TabsContent>

        <TabsContent value="hourly" className="space-y-4">
          <BarChart
            title="Sales by Hour"
            data={hourlyData}
            dataKeys={[
              { key: 'quantity', color: '#000000', name: 'Sales' },
            ]}
            xAxisKey="hour"
          />
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Best Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weeklyData.reduce((max, item) => item.quantity > max.quantity ? item : max, weeklyData[0])?.day || 'N/A'}
            </div>
            <p className="text-xs text-gray-500">highest sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hourlyData.reduce((max, item) => item.quantity > max.quantity ? item : max, hourlyData[0])?.hour || 'N/A'}
            </div>
            <p className="text-xs text-gray-500">busiest time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avg. Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monthlyData.length > 0 
                ? (monthlyData.reduce((sum, item) => sum + item.profit_margin, 0) / monthlyData.length).toFixed(2)
                : 0}%
            </div>
            <p className="text-xs text-gray-500">across all products</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}