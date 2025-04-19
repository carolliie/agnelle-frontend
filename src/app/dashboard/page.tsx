import { CarouselBlock } from "@/components/carousel-block";
import { ChartBarHorizontal } from "@/components/chart-bar";
import { VisitorsChart } from "@/components/chart-visitors";
import { PieChartList } from "@/components/pie-chart";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-muted/50">
          <VisitorsChart />
        </div>
        <div className="rounded-xl bg-muted/50 h-full">
          <PieChartList />
        </div>
        <div className="rounded-xl bg-muted/50 h-full">
          <CarouselBlock />
        </div>
      </div>
      <div className="max-h-fit flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <ChartBarHorizontal />
      </div>
    </div>
  );
}
