import { useEffect, useState } from 'react';
import { fetchYearlySpending } from '@/app/lib/data';
import { YearlySpending } from '@/app/lib/definitions';
import { formatMonthName } from '@/app/lib/utils';
import { colors } from '@/app/lib/colors';
import { Bar } from 'react-chartjs-2';
import { Chart, LinearScale, CategoryScale, BarElement, BarController, Tooltip, ChartData, TooltipItem, ChartOptions } from 'chart.js';
Chart.register(LinearScale, CategoryScale, BarElement, BarController, Tooltip);
Chart.defaults.font.family = 'Outfit, sans-serif';

type SpendingGraphProps = {
  year: number;
}

export default function SpendingGraph({ year }: SpendingGraphProps) {
  const barOptions: ChartOptions<'bar'> = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          maxTicksLimit: 8,
          callback: function(value, index, ticks) {
            return '$' + value;
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
            label: function (context: TooltipItem<'bar'>) {
                const label = context.dataset.label || '';
                const value = context.raw;
                return `${label}: $${value}`;
            }
        }
      }
    }
  };

  const [yearlySpending, setYearlySpending] = useState<YearlySpending[]>([]);
  const [barData, setBarData] = useState<ChartData<'bar'>>({labels: [], datasets: []});

  useEffect(() => {
    const fetchGraphData = async () => {
      const fetchedYearlySpending = await fetchYearlySpending(year);
      if (fetchedYearlySpending) {
        setYearlySpending(fetchedYearlySpending);

        let newLabels = [];
        let newData = [];

        for (let i = 0; i < fetchedYearlySpending.length; i++) {
          const curr = fetchedYearlySpending[i];
          newLabels.push(formatMonthName(curr.month));
          newData.push(curr.total);
        }

        const newBarData = {
          labels: newLabels,
          datasets: [{
            label: 'Total Spent',
            data: newData,
            backgroundColor: colors['accent']
          }]
        };

        setBarData(newBarData);
      } else {
        setYearlySpending([]);
      }
    }

    fetchGraphData();
  }, [year]);

  return yearlySpending.length ? <Bar data={barData} options={barOptions} /> : <p className="text-sm font-normal text-off_gray">No yearly spending data available!</p>;
}