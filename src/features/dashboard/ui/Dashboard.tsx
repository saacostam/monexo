import {
	Box,
	Button,
	Card,
	Flex,
	Grid,
	GridCol,
	Text,
	Title,
} from "@mantine/core";
import { useCallback } from "react";
import { Link } from "react-router";
import { useDateRangeQueryState } from "@/features/dashboard/app";
import { DateRangeInput } from "@/features/date/ui";
import { ExpensesBreakdown } from "@/features/expense/breakdown/ui";
import { ExpensesStats } from "@/features/expense/stats/ui";
import { ExpensesTable } from "@/features/expense/table/ui";
import { PlusIcon, TagIcon } from "@/shared/icons";
import { useGlobalModals } from "@/shared/modals/app";
import { IModalType } from "@/shared/modals/domain";
import { genRoute, RouteName } from "@/shared/router/app";

export function Dashboard() {
	const { set } = useGlobalModals();

	const { dateRange, setDateRange } = useDateRangeQueryState();

	const onClickAddExpense = useCallback(() => {
		set({
			type: IModalType.CREATE_EXPENSE,
		});
	}, [set]);

	return (
		<Flex direction="column" gap="lg">
			<Flex
				align="end"
				direction="row"
				justify="space-between"
				wrap="wrap"
				gap="md"
			>
				<Box>
					<Title size="h2">Dashboard</Title>
					<Text c="dimmed" size="sm">
						Select a date range to explore.
					</Text>
				</Box>
				<Button
					leftSection={<PlusIcon height="1.2rem" width="1.2rem" />}
					onClick={onClickAddExpense}
					size="md"
				>
					Add Expense
				</Button>
			</Flex>
			<DateRangeInput dateRange={dateRange} setDateRange={setDateRange} />
			<ExpensesStats dateRange={dateRange} />
			<Grid>
				<GridCol span={{ base: 12, md: 8 }}>
					<ExpensesTable dateRange={dateRange} />
				</GridCol>
				<GridCol span={{ base: 12, md: 4 }}>
					<Flex direction="column" gap="md">
						<Card withBorder>
							<Button
								component={Link}
								leftSection={<TagIcon height="1.2rem" width="1.2rem" />}
								size="sm"
								to={genRoute({ name: RouteName.CATEGORY })}
								variant="outline"
							>
								Manage Categories
							</Button>
						</Card>
						<ExpensesBreakdown dateRange={dateRange} />
					</Flex>
				</GridCol>
			</Grid>
		</Flex>
	);
}
