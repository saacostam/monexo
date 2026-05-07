import { Dashboard } from "@/features/dashboard/ui";
import { useDateRangeSearchParams } from "@/features/date/app";

export default function HomeScreen() {
	const { dateRange, setDateRange } = useDateRangeSearchParams();

	return <Dashboard dateRange={dateRange} setDateRange={setDateRange} />;
}
