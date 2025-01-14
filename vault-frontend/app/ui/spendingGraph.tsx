import { useEffect, useState } from 'react';
import { fetchYearlySpending } from '@/app/lib/data';
import { YearlySpending } from '@/app/lib/definitions';
import { formatDollarAmount, formatMonthName } from '@/app/lib/utils';
import { colors } from '@/app/lib/colors';
import { Bar } from 'react-chartjs-2';
import { Chart, LinearScale, CategoryScale, BarElement, BarController, Tooltip, ChartData, TooltipItem, ChartOptions } from 'chart.js';
Chart.register(LinearScale, CategoryScale, BarElement, BarController, Tooltip);
Chart.defaults.font.family = 'Outfit, sans-serif';

type SpendingGraphProps = {
  year: number;
  flag: number;
}

export default function SpendingGraph({ year, flag }: SpendingGraphProps) {
  const barOptions: ChartOptions<'bar'> = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          maxTicksLimit: 8,
          callback: function(value, _index, _ticks) {
            return formatDollarAmount(Number(value));
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
                return `${label}: ${formatDollarAmount(Number(value))}`;
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
  }, [year, flag]);

  return yearlySpending.length ? <Bar data={barData} options={barOptions} className="mt-4"/> : <p className="text-md font-normal text-off_gray mt-1">No yearly spending data available!</p>;
}