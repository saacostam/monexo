import type { DatesRangeValue } from "@mantine/dates";
import { useMemo } from "react";
import { useAdapters } from "@/shared/adapters/core/app";

export interface IDatePreset {
	id: string;
	label: string;
	datesRangeValue: DatesRangeValue;
}

export function useDatePresets(): IDatePreset[] {
	const { date } = useAdapters();

	return useMemo(() => {
		const today = date.todayInYyyyMmDd();

		const thisWeekStart = date.startOfWeek();
		const thisMonthStart = date.startOfMonth();

		const thisWeekEnd = date.plus(thisWeekStart, {
			weeks: 1,
			days: -1,
		});

		const thisMonthEnd = date.plus(thisMonthStart, {
			months: 1,
			days: -1,
		});

		const next7 = date.plus(today, {
			weeks: 1,
			days: -1,
		});

		const presets: IDatePreset[] = [
			{
				id: "today",
				label: "Today",
				datesRangeValue: [today, today],
			},

			...(thisWeekEnd.ok
				? [
						{
							id: "this-week",
							label: "This Week",
							datesRangeValue: [
								thisWeekStart,
								thisWeekEnd.value,
							] as DatesRangeValue,
						},
					]
				: []),

			...(thisMonthEnd.ok
				? [
						{
							id: "this-month",
							label: "This Month",
							datesRangeValue: [
								thisMonthStart,
								thisMonthEnd.value,
							] as DatesRangeValue,
						},
					]
				: []),

			...(next7.ok
				? [
						{
							id: "next-7-days",
							label: "Next 7 Days",
							datesRangeValue: [today, next7.value] as DatesRangeValue,
						},
					]
				: []),
		];

		return presets;
	}, [date]);
}
