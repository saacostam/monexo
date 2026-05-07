import { Skeleton } from "@mantine/core";
import type { DatesRangeValue } from "@mantine/dates";
import { useMemo } from "react";
import { useDateRangeToMs } from "@/features/date/app";
import { useQueryExpensesInRange } from "@/features/expense/core/app";
import { useAdapters } from "@/shared/adapters/core/app";
import { ExpensesStatsContent } from "./ExpensesStatsContent";

export interface ExpensesStatsProps {
	dateRange: DatesRangeValue<string>;
}

export function ExpensesStats({ dateRange }: ExpensesStatsProps) {
	const { date } = useAdapters();

	const range = useDateRangeToMs({ dateRange });

	const todayCalendarRange = useMemo(() => {
		const startOfToday = date.todayInYyyyMmDd();
		const endOfToday = date.plus(startOfToday, { days: 1 });

		if (!endOfToday.ok) return;

		const ms = {
			start: date.fromYyyyMmDdToUtcMsSinceEpoch(startOfToday),
			end: date.fromYyyyMmDdToUtcMsSinceEpoch(endOfToday.value),
		};

		if (!ms.start.ok || !ms.end.ok) return;

		return {
			start: ms.start.value,
			end: ms.end.value,
		};
	}, [date.fromYyyyMmDdToUtcMsSinceEpoch, date.plus, date.todayInYyyyMmDd]);

	const queryAllExpensesInCalendarRange = useQueryExpensesInRange({
		// ⚠️ WARNING: Enforced though enabled field
		start: range?.start ?? 0,
		end: range?.end || 0,
		enabled: !!range?.start && !!range.end,
	}).useQuery();

	const queryAllExpensesToday = useQueryExpensesInRange({
		// biome-ignore lint/style/noNonNullAssertion: ⚠️ WARNING: Enforced through enabled field
		start: todayCalendarRange!.start,
		// biome-ignore lint/style/noNonNullAssertion: ⚠️ WARNING: Enforced though enabled field
		end: todayCalendarRange!.end,
		enabled: !!todayCalendarRange,
	}).useQuery();

	if (queryAllExpensesInCalendarRange.isError || queryAllExpensesToday.isError)
		return null;

	if (
		queryAllExpensesInCalendarRange.isSuccess &&
		queryAllExpensesToday.isSuccess
	) {
		return (
			<ExpensesStatsContent
				expensesInCalendarRange={queryAllExpensesInCalendarRange.data}
				expensesInToday={queryAllExpensesToday.data}
			/>
		);
	}

	return <Skeleton h="60px" />;
}
