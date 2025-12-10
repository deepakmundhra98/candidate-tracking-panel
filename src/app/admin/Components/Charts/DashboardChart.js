import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

// const chartData = {
//   "January": [0, 0, 0],
//   "February": [0, 12, 0],
//   "March": [0, 0, 0],
//   "April": [0, 0, 0],
//   "May": [2, 0, 0],
//   "June": [0, 0, 0],
//   "July": [0, 0, 0],
//   "August": [0, 0, 0],
//   "September": [0, 0, 0],
//   "October": [0, 0, 0],
//   "November": [4, 2, 1],
//   "December": [4, 1, 7]
// };
export default function DashboardChart({ chartData }) {
  // Extract month names for the xAxis
  const months = Object.keys(chartData);

  // Ensure there is data to process
  if (!months.length) {
    // console.error("API Data is empty or invalid!");
    return null;
  }

  // Define labels for the series
  const seriesLabels = ["Total Candidate Applications", "Total Job Posts", "Total Selected Candidates"];

  // Define colors for each series
  const seriesColors = ["#4caf50", "#2196f3", "#ff5722"]; // Green, Blue, Red

  // Extract series data
  const series = Object.values(chartData)[0].map((_, index) => ({
    data: Object.values(chartData).map((values) => values[index]),
    label: seriesLabels[index],
    color: seriesColors[index],
  }));

  // Debugging logs
  // console.log("Months (xAxis):", months);
  // console.log("Series Data:", series);
  const maxValue = Math.max(...Object.values(chartData).flat()) || 10; // Ensure at least 10

  return (
    <BarChart
      series={series}
      height={290}
      xAxis={[{ data: months, scaleType: "band" }]}
      yAxis={[{ min: 0, max: Math.max(maxValue, 10) }]} // Start from 0 and set max to at least 10

      margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
      legend={{
        display: true,
        position: 'bottom', // Position can be 'top', 'bottom', 'left', or 'right'
      }}
    />
  );
}




