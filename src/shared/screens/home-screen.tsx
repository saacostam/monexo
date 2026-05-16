import { useCallback } from "react";
import { useSearchParams } from "react-router";
import { Dashboard } from "@/features/dashboard/ui";
import { useDateRangeSearchParams } from "@/features/date/app";

const SEARCH_KEY = "search";

export default function HomeScreen() {
	const { dateRange, setDateRange } = useDateRangeSearchParams();
	const [searchParams, setSearchParams] = useSearchParams();

	const search = searchParams.get(SEARCH_KEY) ?? "";
	const setSearch = useCallback(
		(search: string) => {
			setSearchParams((prev) => {
				const params = new URLSearchParams(prev);
				params.set(SEARCH_KEY, search);
				return params;
			});
		},
		[setSearchParams],
	);

	return (
		<Dashboard
			dateRange={dateRange}
			search={search}
			setDateRange={setDateRange}
			setSearch={setSearch}
		/>
	);
}
