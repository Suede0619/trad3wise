"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function PriceChart({
  data,
  height = 280,
}: {
  data: { t: string; p: number }[];
  height?: number;
}) {
  const up = data.length > 1 && data[data.length - 1].p >= data[0].p;
  const color = up ? "hsl(152 64% 45%)" : "hsl(0 72% 56%)";
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="pc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="t"
          tickFormatter={(t) => new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          tick={{ fill: "hsl(215 14% 58%)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          minTickGap={40}
        />
        <YAxis
          domain={["auto", "auto"]}
          tick={{ fill: "hsl(215 14% 58%)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={48}
          tickFormatter={(v) => `$${Math.round(v)}`}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(222 22% 7%)",
            border: "1px solid hsl(220 14% 16%)",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "hsl(215 14% 58%)" }}
          formatter={(v) => [`$${Number(v).toFixed(2)}`, "Price"]}
          labelFormatter={(t) => new Date(t as string).toLocaleDateString()}
        />
        <Area type="monotone" dataKey="p" stroke={color} strokeWidth={2} fill="url(#pc)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
