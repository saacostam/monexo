import { Skeleton } from "@mantine/core";
import type { DatesRangeValue } from "@mantine/dates";
import { useDateRangeToMs } from "@/features/date/app";
import { useQueryExpensesInRange } from "@/features/expense/core/app";
import { useRetry } from "@/shared/async-state";
import { QueryError } from "@/shared/components";
import { BurnRateContent } from "./BurnRateContent";

export interface BurnRateProps {
	dateRange: DatesRangeValue<string>;
}

export function BurnRate({ dateRange }: BurnRateProps) {
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
				where="BurnRate.queryAllExpensesInCalendarRange.isError"
			/>
		);

	if (queryAllExpensesInCalendarRange.isSuccess)
		return <BurnRateContent expenses={queryAllExpensesInCalendarRange.data} />;

	return <Skeleton h="256px" />;
}
