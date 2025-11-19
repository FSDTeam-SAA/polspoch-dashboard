import CardOverview from "./CardOverview";
import {
  BookmarkPlus,
  ChartLine,
  CircleDollarSign,
  WavesLadder,
} from "lucide-react";
import ChartOverview from "./ChartOverview";
import RecentOverview from "./RecentOverview";

export default function Overview() {
  return (
    <div className="p-5">
      <div className="space-y-8">
        <div className="stat-cards flex gap-4">
          <CardOverview
            title="Bookings"
            numberInfo={100}
            icon={<WavesLadder />}
          />
          <CardOverview
            title="Popular Course"
            numberInfo={12}
            icon={<ChartLine />}
          />
          <CardOverview
            title="Revenue"
            numberInfo={45}
            icon={<CircleDollarSign />}
          />
          <CardOverview
            title="Product Sales"
            numberInfo={345}
            icon={<BookmarkPlus />}
          />
        </div>

        <div>
          <div className="col-span-8">
            <ChartOverview />
          </div>
        </div>

        <div>
          <RecentOverview />
        </div>
      </div>
    </div>
  );
}
