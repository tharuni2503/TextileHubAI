import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function PieChart({ dashboard }) {
  const data = {
    labels: [
      "Pending",
      "Accepted",
      "Packed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ],

    datasets: [
      {
        data: [
          dashboard.pendingOrders || 0,
          dashboard.acceptedOrders || 0,
          dashboard.packedOrders || 0,
          dashboard.shippedOrders || 0,
          dashboard.deliveredOrders || 0,
          dashboard.cancelledOrders || 0,
        ],

        backgroundColor: [
          "#F59E0B",
          "#10B981",
          "#8B5CF6",
          "#3B82F6",
          "#22C55E",
          "#EF4444",
        ],

        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return <Pie data={data} options={options} />;
}