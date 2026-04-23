import { Skeleton } from "@mantine/core";
import { useMemo } from "react";
import { useQueryExpensesInRange } from "@/features/expense/core/app";
import { useAdapters } from "@/shared/adapters/core/app";
import { ExpensesStatsContent } from "./ExpensesStatsContent";

export interface ExpensesStatsProps {
	start: number | null;
	end: number | null;
}

export function ExpensesStats({ start, end }: ExpensesStatsProps) {
	const { date } = useAdapters();

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
		// biome-ignore lint/style/noNonNullAssertion: ⚠️ WARNING: Enforced through enabled field
		start: start!,
		// biome-ignore lint/style/noNonNullAssertion: ⚠️ WARNING: Enforced though enabled field
		end: end!,
		enabled: !!start && !!end,
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
