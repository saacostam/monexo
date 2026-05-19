import { Skeleton } from "@mantine/core";
import type { DatesRangeValue } from "@mantine/dates";
import { useDateRangeToMs } from "@/features/date/app";
import { useQueryExpensesInRange } from "@/features/expense/core/app";
import { useRetry } from "@/shared/async-state";
import { QueryError } from "@/shared/components";
import { CategoriesStatsContent } from "./CategoriesStatsContent";

export interface CategoriesStatsProps {
	dateRange: DatesRangeValue<string>;
}

export function CategoriesStats({ dateRange }: CategoriesStatsProps) {
	const range = useDateRangeToMs({ dateRange });

	const queryAllExpensesInCalendarRange = useQueryExpensesInRange({
		// ⚠️ WARNING: Enforced though enabled field
		start: range?.start ?? 0,
		end: range?.end || 0,
		enabled: !!range?.start && !!range.end,
	}).useQuery();

	const retry = useRetry(
		queryAllExpensesInCalendarRange.refetch,
		queryAllExpensesInCalendarRange.isLoading,
	);

	if (queryAllExpensesInCalendarRange.isError)
		return (
			<QueryError
				msg="Unable to retrieve the spending information"
				retry={retry}
				error={queryAllExpensesInCalendarRange.error}
				where="CategoriesStats.queryAllExpensesInCalendarRange.isError"
			/>
		);

	if (queryAllExpensesInCalendarRange.isSuccess)
		return (
			<CategoriesStatsContent expenses={queryAllExpensesInCalendarRange.data} />
		);

	return <Skeleton data-testid="categories-stats-skeleton" h="256px" />;
}
