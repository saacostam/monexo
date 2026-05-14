import { Skeleton } from "@mantine/core";
import type { DatesRangeValue } from "@mantine/dates";
import { useDateRangeToMs } from "@/features/date/app";
import { useQueryExpensesInRange } from "@/features/expense/core/app";
import { useRetry } from "@/shared/async-state";
import { QueryError } from "@/shared/components";
import { ExpensesBreakdownContent } from "./ExpensesBreakdownContent";

export interface ExpensesBreakdownProps {
	dateRange: DatesRangeValue<string>;
}

export function ExpensesBreakdown({ dateRange }: ExpensesBreakdownProps) {
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
				where="ExpensesBreakdown.queryAllExpensesInCalendarRange.isError"
			/>
		);

	if (queryAllExpensesInCalendarRange.isSuccess)
		return (
			<ExpensesBreakdownContent
				expenses={queryAllExpensesInCalendarRange.data}
			/>
		);

	return <Skeleton h="256px" />;
}
