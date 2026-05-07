import { Skeleton } from "@mantine/core";
import type { DatesRangeValue } from "@mantine/dates";
import { DateRangeInput } from "@/features/date/ui";

export interface AnalysisProps {
	dateRange: DatesRangeValue<string>;
	setDateRange: (next: DatesRangeValue<string>) => void;
}

export function Analysis({ dateRange, setDateRange }: AnalysisProps) {
	return (
		<>
			<DateRangeInput dateRange={dateRange} setDateRange={setDateRange} />
			<Skeleton h="256px" />
		</>
	);
}
