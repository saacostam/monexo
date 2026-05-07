import {
	Button,
	Card,
	Divider,
	Flex,
	Skeleton,
	ThemeIcon,
	Title,
} from "@mantine/core";
import type { DatesRangeValue } from "@mantine/dates";
import { Link } from "react-router";
import { useDateRangeToMs } from "@/features/date/app";
import { useQueryExpensesInRange } from "@/features/expense/core/app";
import { useRetry } from "@/shared/async-state";
import { QueryError } from "@/shared/components";
import { ArrowRightIcon, ChartBarIcon } from "@/shared/icons";
import { genRoute, RouteName } from "@/shared/router/app";
import { ExpensesBreakdownContent } from "./ExpensesBreakdownContent";

export interface ExpensesBreakdownProps {
	dateRange: DatesRangeValue<string>;
}

export function ExpensesBreakdown({ dateRange }: ExpensesBreakdownProps) {
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

	return (
		<Card h="100%" withBorder>
			<Flex align="center" direction="row" gap="xs" wrap="wrap">
				<ThemeIcon bdrs="100%" p="0.25rem">
					<ChartBarIcon />
				</ThemeIcon>
				<Title size="h4">Spending Breakdown</Title>
			</Flex>
			<Divider my="sm" />
			{queryAllExpensesInCalendarRange.isLoading && <Skeleton h="256px" />}
			{queryAllExpensesInCalendarRange.isError && (
				<QueryError
					msg="Unable to retrieve the spending information"
					retry={retry}
					error={queryAllExpensesInCalendarRange.error}
					where="ExpensesBreakdown.queryAllExpensesInCalendarRange.isError"
				/>
			)}
			{queryAllExpensesInCalendarRange.isSuccess && (
				<ExpensesBreakdownContent
					expenses={queryAllExpensesInCalendarRange.data}
				/>
			)}
			<Divider my="md" />
			<Button
				component={Link}
				rightSection={<ArrowRightIcon height="1.2rem" width="1.2rem" />}
				size="md"
				to={genRoute({ name: RouteName.ANALYTICS })}
			>
				More Analytics
			</Button>
		</Card>
	);
}
