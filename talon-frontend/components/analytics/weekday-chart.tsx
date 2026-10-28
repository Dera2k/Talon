"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type WeekdayDatum = { day: string; rate: number };

const AXIS_COLOR = "var(--muted-foreground)";
const AXIS_TICK = { fill: AXIS_COLOR };

export function WeekdayChart({ data }: { data: WeekdayDatum[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
          <XAxis dataKey="day" stroke={AXIS_COLOR} tick={AXIS_TICK} tickLine={false} axisLine={false} />
          <YAxis
            stroke={AXIS_COLOR}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            unit="%"
            domain={[0, 100]}
          />
          <Tooltip
            cursor={{ fill: "oklch(1 0 0 / 5%)" }}
            formatter={(value) => [`${value}%`, "Completion"]}
            contentStyle={{
              backgroundColor: "var(--popover)",
              border: "1px solid oklch(1 0 0 / 10%)",
              borderRadius: 8,
              color: "var(--popover-foreground)",
            }}
          />
          <Bar dataKey="rate" fill="var(--primary)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
