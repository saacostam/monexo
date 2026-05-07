import type { DatesRangeValue } from "@mantine/dates";
import { useMemo } from "react";
import { useAdapters } from "@/shared/adapters/core/app";

export interface UseDateRangeArgs {
	dateRange: DatesRangeValue<string>;
}

/**
 * Converts a Mantine date range (`YYYY-MM-DD` strings) into a UTC
 * millisecond range suitable for querying or filtering by time intervals.
 *
 * The returned range is inclusive of the start date and exclusive of the
 * end date by advancing the end date by one day.
 *
 * Returns `undefined` when:
 * - either date is missing
 * - a date conversion fails
 * - adding one day to the end date fails
 *
 * @returns An object containing:
 * - `start`: UTC milliseconds for the start date at midnight
 * - `end`: UTC milliseconds for the day after the end date at midnight
 *
 * Or `undefined` if the range is incomplete or invalid.
 */
export function useDateRangeToMs({ dateRange }: UseDateRangeArgs) {
	const { date } = useAdapters();

	return useMemo(() => {
		// enforce: both must exist
		const [startStr, endStr] = dateRange;
		if (!startStr || !endStr) return undefined;

		const toMs = (yyyyMmDd: string) => {
			const res = date.fromYyyyMmDdToUtcMsSinceEpoch(yyyyMmDd);
			return res.ok ? res.value : undefined;
		};

		const start = toMs(startStr);

		let end: number | undefined;
		const nextDay = date.plus(endStr, { days: 1 });
		if (nextDay.ok) {
			end = toMs(nextDay.value);
		}

		if (start === undefined || end === undefined) return undefined;

		return { start, end };
	}, [date.fromYyyyMmDdToUtcMsSinceEpoch, date.plus, dateRange]);
}
