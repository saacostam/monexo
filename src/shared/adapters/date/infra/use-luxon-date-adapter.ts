import { DateTime } from "luxon";
import { useCallback, useMemo } from "react";
import type { IDateAdapter } from "@/shared/adapters/date/domain";

export function useLuxonDateAdapter(): IDateAdapter {
	const fromUtcMsSinceEpochToLocalYyyyMmDd: IDateAdapter["fromUtcMsSinceEpochToLocalYyyyMmDd"] =
		useCallback((utcMsSinceEpoch: number) => {
			return DateTime.fromMillis(utcMsSinceEpoch, { zone: "utc" })
				.toLocal()
				.toISODate();
		}, []);

	const fromYyyyMmDdToUtcMsSinceEpoch: IDateAdapter["fromYyyyMmDdToUtcMsSinceEpoch"] =
		useCallback((date: string) => {
			const dt = DateTime.fromISO(date, { zone: "local" }).startOf("day");

			if (!dt.isValid) {
				return {
					ok: false,
					error: "Invalid date format",
				};
			}

			return {
				ok: true,
				value: dt.toUTC().toMillis(),
			};
		}, []);

	const isValidYyyyMmDd: IDateAdapter["isValidYyyyMmDd"] = useCallback(
		(date: string) => {
			if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

			const dt = DateTime.fromISO(date, { zone: "local" });

			return dt.isValid && dt.toISODate() === date;
		},
		[],
	);

	const plus: IDateAdapter["plus"] = useCallback((date, args) => {
		const dt = DateTime.fromISO(date, { zone: "local" }).startOf("day");

		if (!dt.isValid) {
			return {
				ok: false,
				error: "Invalid date format",
			};
		}

		const next = dt.plus({
			months: args?.months ?? 0,
			weeks: args?.weeks ?? 0,
			days: args?.days ?? 0,
		});

		return {
			ok: true,
			value: next.toISODate(),
		};
	}, []);

	const todayInYyyyMmDd: IDateAdapter["todayInYyyyMmDd"] = useCallback(() => {
		return DateTime.local().toISODate();
	}, []);

	const startOfMonth: IDateAdapter["startOfMonth"] = useCallback(() => {
		return DateTime.local().startOf("month").toISODate();
	}, []);

	const startOfWeek: IDateAdapter["startOfWeek"] = useCallback(() => {
		return DateTime.local().startOf("week").toISODate();
	}, []);

	return useMemo(
		() => ({
			fromYyyyMmDdToUtcMsSinceEpoch,
			fromUtcMsSinceEpochToLocalYyyyMmDd,
			isValidYyyyMmDd,
			plus,
			todayInYyyyMmDd,
			startOfMonth,
			startOfWeek,
		}),
		[
			fromYyyyMmDdToUtcMsSinceEpoch,
			fromUtcMsSinceEpochToLocalYyyyMmDd,
			isValidYyyyMmDd,
			plus,
			todayInYyyyMmDd,
			startOfMonth,
			startOfWeek,
		],
	);
}
