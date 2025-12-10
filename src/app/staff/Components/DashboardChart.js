import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

export default function DashboardChart({ chartData }) {
  // Extract month names for the xAxis
  const months = Object.keys(chartData);

  // Ensure there is data to process
  if (!months.length) {
    console.error("API Data is empty or invalid!");
    return null;
  }

  // Define labels for the series
  const seriesLabels = ["Total Candidate Applications", "Total Interview Assigned"];

  // Define colors for each series
  const seriesColors = ["#4caf50", "#2196f3"]; // Green, Blue

  // Extract series data
  const series = Object.values(chartData)[0].map((_, index) => ({
    data: Object.values(chartData).map((values) => values[index]),
    label: seriesLabels[index],
    color: seriesColors[index],
  }));

  // Calculate the maximum value from the data to set the y-axis max
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