"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type OverviewProps = {
  displayData: Record<string, number>;
};

export function Overview({ displayData }: OverviewProps) {
  const data = Object.keys(displayData).map((area) => ({
    name: area,
    total: displayData[area],
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}