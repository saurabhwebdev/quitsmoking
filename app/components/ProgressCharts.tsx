'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type Props = {
  cravingLogs: CravingLog[];
  daysSince: number;
};

export default function ProgressCharts({ cravingLogs, daysSince }: Props) {
  const [chartData, setChartData] = useState<{
    labels: string[];
    cravingsByDay: number[];
    managedCravings: number[];
  }>({
    labels: [],
    cravingsByDay: [],
    managedCravings: []
  });

  useEffect(() => {
    const processData = () => {
      // Create a map to store cravings by day
      const cravingMap = new Map<string, { total: number; managed: number }>();
      
      // Get the start date
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysSince);
      
      // Initialize all days with zero
      for (let i = 0; i <= daysSince; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        cravingMap.set(dateStr, { total: 0, managed: 0 });
      }

      // Process craving logs
      cravingLogs.forEach(log => {
        const dateStr = new Date(log.timestamp).toISOString().split('T')[0];
        const current = cravingMap.get(dateStr) || { total: 0, managed: 0 };
        current.total += 1;
        if (log.managed) {
          current.managed += 1;
        }
        cravingMap.set(dateStr, current);
      });

      // Convert map to arrays
      const sortedDates = Array.from(cravingMap.keys()).sort();
      const cravingsByDay = sortedDates.map(date => cravingMap.get(date)?.total || 0);
      const managedCravings = sortedDates.map(date => cravingMap.get(date)?.managed || 0);

      // Format dates for labels
      const labels = sortedDates.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });

      setChartData({
        labels,
        cravingsByDay,
        managedCravings
      });
    };

    processData();
  }, [cravingLogs, daysSince]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Total Cravings',
        data: chartData.cravingsByDay,
        borderColor: 'rgba(79, 70, 229, 0.2)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Managed',
        data: chartData.managedCravings,
        borderColor: 'rgba(34, 197, 94, 0.4)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const successRate = chartData.cravingsByDay.reduce((a, b) => a + b, 0) > 0
    ? Math.round((chartData.managedCravings.reduce((a, b) => a + b, 0) / 
        chartData.cravingsByDay.reduce((a, b) => a + b, 0)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Craving Patterns</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary/20 rounded" />
              <span className="text-sm">Total Cravings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success/40 rounded" />
              <span className="text-sm">Managed</span>
            </div>
          </div>
        </div>
        <div className="h-64">
          <Line data={data} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-success/5 to-transparent">
          <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
          <div className="relative pt-2">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-success bg-success/10">
                  {successRate}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-neutral-200 dark:bg-neutral-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${successRate}%` }}
                transition={{ duration: 1 }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-success"
              />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-primary/5 to-transparent">
          <h3 className="text-lg font-semibold mb-2">Total Cravings</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-primary">
              {chartData.cravingsByDay.reduce((a, b) => a + b, 0)}
            </span>
            <span className="ml-2 text-sm text-neutral-500">
              Over {daysSince} days
            </span>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-accent/5 to-transparent">
          <h3 className="text-lg font-semibold mb-2">Strongest Day</h3>
          <div className="text-2xl font-bold text-success">
            Day {chartData.cravingsByDay.indexOf(Math.max(...chartData.cravingsByDay)) + 1}
          </div>
          <p className="text-sm text-neutral-500">
            Most cravings managed
          </p>
        </div>
      </div>
    </div>
  );
} 