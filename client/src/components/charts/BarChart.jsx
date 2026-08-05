import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function BarChart({ dashboard }) {
  const data = {
    labels: [
      "Products",
      "Orders",
      "Pending",
      "Delivered",
      "Cancelled",
    ],

    datasets: [
      {
        label: "Supplier Analytics",

        data: [
          dashboard.totalProducts || 0,
          dashboard.totalOrders || 0,
          dashboard.pendingOrders || 0,
          dashboard.deliveredOrders || 0,
          dashboard.cancelledOrders || 0,
        ],

        backgroundColor: [
          "#6366F1",
          "#22C55E",
          "#F59E0B",
          "#3B82F6",
          "#EF4444",
        ],

        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}