import { useEffect, useState } from "react";
import { ResidenceBill } from "@/app/lib/definitions";
import {
  formatDollarAmount,
  formatMonthName,
  getMonthFromDate,
  getNumberOfMonthsAgo,
} from "@/app/lib/utils";
import { colors } from "@/app/lib/colors";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  LinearScale,
  CategoryScale,
  BarElement,
  BarController,
  Tooltip,
  ChartData,
  TooltipItem,
  ChartOptions,
} from "chart.js";
Chart.register(LinearScale, CategoryScale, BarElement, BarController, Tooltip);
Chart.defaults.font.family = "Outfit, sans-serif";

type ResidenceGraphProps = {
  monthlyPaymentType: 'Rent' | 'Mortgage',
  lastNumberOfMonths: number;
  residenceBills: ResidenceBill[];
};

export default function ResidenceGraph({ monthlyPaymentType,lastNumberOfMonths, residenceBills }: ResidenceGraphProps) {
  const barOptions: ChartOptions<"bar"> = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          maxTicksLimit: 8,
          callback: function (value) {
            return formatDollarAmount(Number(value));
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"bar">) {
            const label = context.dataset.label || "";
            const value = context.raw;
            return `${label}: ${formatDollarAmount(Number(value))}`;
          },
        },
      },
    },
  };

  const [barData, setBarData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const calculateGraphData = () => {
      const monthlyData: {
        [key: string]: { rentOrMortgage: number; utilities: number };
      } = {};

      // Initialize data for the last X months
      for (let i = 0; i < lastNumberOfMonths; i++) {
        const month = getNumberOfMonthsAgo(i);
        monthlyData[month] = { rentOrMortgage: 0, utilities: 0 };
      }

      // Process bills to populate monthly data
      residenceBills.forEach((bill) => {
        const billMonth = getMonthFromDate(bill.due_date);
        if (billMonth in monthlyData) {
          if (bill.category === 'Rent' || bill.category === 'Mortgage') {
            monthlyData[billMonth].rentOrMortgage += bill.total;
          } else if (
            ["Water", "Electricity", "Internet", "Trash", "Gas"].includes(
              bill.category
            )
          ) {
            monthlyData[billMonth].utilities += bill.total;
          }
        }
      });

      // Prepare data for the chart
      const labels = Object.keys(monthlyData).sort().map((month) => formatMonthName(Number(month)));
      const rentOrMortgageData = Object.values(monthlyData).map((data) => data.rentOrMortgage);
      const utilitiesData = Object.values(monthlyData).map((data) => data.utilities);

      setBarData({
        labels,
        datasets: [
          {
            label: monthlyPaymentType,
            data: rentOrMortgageData,
            backgroundColor: colors['accent'],
          },
          {
            label: 'Utilities',
            data: utilitiesData,
            backgroundColor: colors['primary'],
          },
        ],
      });
    };

    calculateGraphData();
  }, [lastNumberOfMonths, residenceBills]);

  return barData.labels ? (
    <Bar data={barData} options={barOptions} className="mt-4" />
  ) : ( <p className="text-md font-normal text-off_gray mt-1">No data available for the selected interval!</p> );
}
