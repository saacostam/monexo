import type { DatesRangeValue } from "@mantine/dates";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAdapters } from "@/shared/adapters/core/app";

export function useDateRangeSearchParams() {
	const { date } = useAdapters();
	const [searchParams, setSearchParams] = useSearchParams();

	const rangeRaw = searchParams.get("range");

	const dateRange = useMemo<DatesRangeValue<string>>(() => {
		if (!rangeRaw) return [null, null];

		const [startRaw, endRaw] = rangeRaw.split("_");

		const start = startRaw && date.isValidYyyyMmDd(startRaw) ? startRaw : null;

		const end = endRaw && date.isValidYyyyMmDd(endRaw) ? endRaw : null;

		return [start, end];
	}, [rangeRaw, date]);

	const setDateRange = useCallback(
		(next: DatesRangeValue<string>) => {
			setSearchParams((prev) => {
				const params = new URLSearchParams(prev);

				const [start, end] = next;

				if (!start && !end) {
					params.delete("range");
					return params;
				}

				const encoded = `${start ?? ""}_${end ?? ""}`;
				params.set("range", encoded);

				return params;
			});
		},
		[setSearchParams],
	);

	const didInitRef = useRef(false);

	useEffect(() => {
		if (didInitRef.current) return;

		if (rangeRaw == null) {
			const today = date.todayInYyyyMmDd();

			setSearchParams((prev) => {
				const params = new URLSearchParams(prev);
				params.set("range", `${today}_${today}`);
				return params;
			});
		}

		didInitRef.current = true;
	}, [rangeRaw, setSearchParams, date]);

	return {
		dateRange,
		setDateRange,
	} as const;
}
