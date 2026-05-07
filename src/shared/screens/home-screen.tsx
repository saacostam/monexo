import { Dashboard } from "@/features/dashboard/ui";
import { useDateRangeQueryState } from "@/features/date/app";

export default function HomeScreen() {
	const { dateRange, setDateRange } = useDateRangeQueryState();

	return <Dashboard dateRange={dateRange} setDateRange={setDateRange} />;
}
