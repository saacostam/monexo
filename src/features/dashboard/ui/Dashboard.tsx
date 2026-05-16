import {
	Box,
	Button,
	Card,
	Divider,
	Flex,
	Grid,
	GridCol,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import type { DatesRangeValue } from "@mantine/dates";
import { useCallback } from "react";
import { Link } from "react-router";
import { DateRangeInput } from "@/features/date/ui";
import { ExpensesBreakdown } from "@/features/expense/breakdown/ui";
import { ExpensesStats } from "@/features/expense/stats/ui";
import { ExpensesTable } from "@/features/expense/table/ui";
import {
	ArrowRightIcon,
	ChartBarIcon,
	PlusIcon,
	TagIcon,
} from "@/shared/icons";
import { useGlobalModals } from "@/shared/modals/app";
import { IModalType } from "@/shared/modals/domain";
import { genRoute, RouteName } from "@/shared/router/app";

export interface DashboardProps {
	dateRange: DatesRangeValue<string>;
	setDateRange: (next: DatesRangeValue<string>) => void;
	search: string;
	setSearch: (search: string) => void;
}

export function Dashboard({
	dateRange,
	setDateRange,
	search,
	setSearch,
}: DashboardProps) {
	const { set } = useGlobalModals();

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
					<ExpensesTable
						dateRange={dateRange}
						search={search}
						setSearch={setSearch}
					/>
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
						<Card h="100%" withBorder>
							<Flex align="center" direction="row" gap="xs" wrap="wrap">
								<ThemeIcon bdrs="100%" p="0.25rem">
									<ChartBarIcon />
								</ThemeIcon>
								<Title size="h4">Spending Breakdown</Title>
							</Flex>
							<Divider my="sm" />
							<ExpensesBreakdown dateRange={dateRange} />
							<Divider my="md" />
							<Button
								component={Link}
								rightSection={<ArrowRightIcon height="1.2rem" width="1.2rem" />}
								size="md"
								to={genRoute({
									name: RouteName.ANALYTICS,
									payload: { range: dateRange },
								})}
							>
								More Analytics
							</Button>
						</Card>
					</Flex>
				</GridCol>
			</Grid>
		</Flex>
	);
}
