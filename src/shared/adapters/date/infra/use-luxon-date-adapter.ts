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

	const todayInYyyyMmDd: IDateAdapter["todayInYyyyMmDd"] = useCallback(() => {
		return DateTime.local().toISODate();
	}, []);

	return useMemo(
		() => ({
			fromYyyyMmDdToUtcMsSinceEpoch,
			fromUtcMsSinceEpochToLocalYyyyMmDd,
			todayInYyyyMmDd,
		}),
		[
			fromYyyyMmDdToUtcMsSinceEpoch,
			fromUtcMsSinceEpochToLocalYyyyMmDd,
			todayInYyyyMmDd,
		],
	);
}
