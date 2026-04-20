import { DateTime } from "luxon";
import { useCallback, useMemo } from "react";
import type { IDateAdapter } from "@/shared/adapters/date/domain";

export function useLuxonDateAdapter(): IDateAdapter {
	const todayInYyyyMmDd: IDateAdapter["todayInYyyyMmDd"] = useCallback(() => {
		return DateTime.local().toISODate();
	}, []);

	return useMemo(
		() => ({
			todayInYyyyMmDd,
		}),
		[todayInYyyyMmDd],
	);
}
