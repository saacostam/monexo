import {
	Button,
	Card,
	Divider,
	Flex,
	Skeleton,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { Link } from "react-router";
import { useQueryExpensesInRange } from "@/features/expense/core/app";
import { useRetry } from "@/shared/async-state";
import { QueryError } from "@/shared/components";
import { ArrowRightIcon, ChartBarIcon } from "@/shared/icons";
import { genRoute, RouteName } from "@/shared/router/app";
import { ExpensesBreakdownContent } from "./ExpensesBreakdownContent";

export interface ExpensesBreakdownProps {
	start: number | null;
	end: number | null;
}

export function ExpensesBreakdown({ start, end }: ExpensesBreakdownProps) {
	const queryAllExpensesInCalendarRange = useQueryExpensesInRange({
		// biome-ignore lint/style/noNonNullAssertion: ⚠️ WARNING: Enforced through enabled field
		start: start!,
		// biome-ignore lint/style/noNonNullAssertion: ⚠️ WARNING: Enforced though enabled field
		end: end!,
		enabled: !!start && !!end,
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
