import AddImageBlock from "@/components/add-image-block";
import { CarouselBlock } from "@/components/carousel-block";
import { PieChartList } from "@/components/pie-chart";
import { ToDoList } from "@/components/to-do-list";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-muted/50 overflow-hidden">
          <AddImageBlock/>
        </div>
        <div className="rounded-xl bg-muted/50 h-full">
          <PieChartList />
        </div>
        <div className="rounded-xl bg-muted/50 h-full">
          <CarouselBlock />
        </div>
      </div>
      <div className="max-h-fit flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <ToDoList/>
      </div>
    </div>
  );
}
