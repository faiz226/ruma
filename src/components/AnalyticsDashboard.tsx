import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from "date-fns";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];
const STATUS_COLORS: Record<string, string> = {
  'PAID': '#10b981',
  'confirmed': '#10b981',
  'PENDING_PAYMENT': '#f59e0b',
  'CANCELLED': '#ef4444',
  'EXPIRED': '#6b7280'
};

export const AnalyticsDashboard = ({ bookings }: { bookings: any[] }) => {
  const analyticsData = useMemo(() => {
    // 1. Booking Status Breakdown
    const statusCounts = bookings.reduce((acc: any, b) => {
      const status = b.status || 'UNKNOWN';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    const statusData = Object.keys(statusCounts).map(key => ({
      name: key.replace('_', ' '),
      value: statusCounts[key],
      color: STATUS_COLORS[key] || '#6b7280'
    }));

    // Group by month
    const monthlyDataMap: Record<string, { month: string, revenue: number, bookedNights: number, totalNights: number }> = {};
    
    bookings.forEach(b => {
      const start = new Date(b.check_in || b.checkIn);
      const end = new Date(b.check_out || b.checkOut);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

      const monthKey = format(start, 'MMM yyyy');
      
      if (!monthlyDataMap[monthKey]) {
        const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
        monthlyDataMap[monthKey] = {
          month: monthKey,
          revenue: 0,
          bookedNights: 0,
          totalNights: daysInMonth
        };
      }

      const isPaid = b.status === 'PAID' || b.status === 'confirmed';
      if (isPaid) {
        // Add revenue
        let price = b.total_price_cents ? (b.total_price_cents / 100) : 0;
        if (!price) {
          const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          price = nights * 250; // rough fallback
        }
        monthlyDataMap[monthKey].revenue += price;
        
        // Add occupancy
        const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        monthlyDataMap[monthKey].bookedNights += nights;
      }
    });

    const monthlyData = Object.values(monthlyDataMap).map(d => ({
      ...d,
      occupancy: Math.round((d.bookedNights / d.totalNights) * 100)
    })).reverse(); // sort chronologically assuming bookings are sorted desc

    return { statusData, monthlyData };
  }, [bookings]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-border shadow-soft">
          <h3 className="text-sm font-medium uppercase tracking-wider mb-6">Revenue by Month</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.monthlyData}>
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `RM${value}`} />
                <Tooltip formatter={(value) => [`RM${value}`, 'Revenue']} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="revenue" fill="#18181b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 border-border shadow-soft">
          <h3 className="text-sm font-medium uppercase tracking-wider mb-6">Occupancy Rate</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.monthlyData}>
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Occupancy']} contentStyle={{ borderRadius: '8px' }} />
                <Line type="monotone" dataKey="occupancy" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6 border-border shadow-soft">
        <h3 className="text-sm font-medium uppercase tracking-wider mb-6">Booking Status Breakdown</h3>
        <div className="h-[300px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analyticsData.statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {analyticsData.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
