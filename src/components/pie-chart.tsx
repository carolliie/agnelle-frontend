"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import axios from "axios"

const chartConfig = {
  visitors: {
    label: "Visitantes",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function PieChartList() {

  const [chartData, setChartData] = useState<{ platform: string, visitors: number, fill: string}[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analytics/track`, {
          withCredentials: true,
        });

        const data = response.data;
        setChartData([
          { platform: "Desktop", visitors: data.desktop, fill: "hsl(var(--chart-1))" },
          { platform: "Mobile", visitors: data.mobile, fill: "hsl(var(--chart-2))" },
        ]);
      } catch (error) {
        console.error("Erro ao buscar dados de análise", error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Visitantes</CardTitle>
        <CardDescription>Total semanal</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="platform" hideLabel />}
            />
            <Pie data={chartData} dataKey="visitors" nameKey="platform">
              <LabelList
                dataKey="platform"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
        Total de visitantes por dispositivo <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Mobile ou Desktop
        </div>
      </CardFooter>
    </Card>
  )
}
