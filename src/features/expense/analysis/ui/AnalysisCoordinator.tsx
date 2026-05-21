import { Card, Divider, Flex, Grid, ThemeIcon, Title } from "@mantine/core";
import type { DatesRangeValue } from "@mantine/dates";
import { DateRangeInput } from "@/features/date/ui";
import { ChartBarIcon } from "@/shared/icons";

export type AnalysisCoordinatorSlot = React.ComponentType<{
	dateRange: DatesRangeValue<string>;
}>;

export interface AnalysisCoordinatorProps {
	dateRange: DatesRangeValue<string>;
	setDateRange: (next: DatesRangeValue<string>) => void;

	// Slots
	BurnRate: AnalysisCoordinatorSlot;
	CategoriesStats: AnalysisCoordinatorSlot;
	ExpensesBreakdown: AnalysisCoordinatorSlot;
}

export function AnalysisCoordinator({
	dateRange,
	setDateRange,

	BurnRate,
	CategoriesStats,
	ExpensesBreakdown,
}: AnalysisCoordinatorProps) {
	return (
		<>
			<DateRangeInput dateRange={dateRange} setDateRange={setDateRange} />
			<Grid>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<Card h="100%" withBorder>
						<Flex align="center" direction="row" gap="xs" wrap="wrap">
							<ThemeIcon bdrs="100%" p="0.25rem">
								<ChartBarIcon />
							</ThemeIcon>
							<Title size="h4">Spending Breakdown</Title>
						</Flex>
						<Divider my="sm" />
						<ExpensesBreakdown dateRange={dateRange} />
					</Card>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<Card h="100%" withBorder>
						<Flex align="center" direction="row" gap="xs" wrap="wrap">
							<ThemeIcon bdrs="100%" p="0.25rem">
								<ChartBarIcon />
							</ThemeIcon>
							<Title size="h4">Burn Rate (Cumulative)</Title>
						</Flex>
						<Divider my="sm" />
						<BurnRate dateRange={dateRange} />
					</Card>
				</Grid.Col>
				<Grid.Col span={{ base: 12 }}>
					<Card h="100%" withBorder>
						<Flex align="center" direction="row" gap="xs" wrap="wrap">
							<ThemeIcon bdrs="100%" p="0.25rem">
								<ChartBarIcon />
							</ThemeIcon>
							<Title size="h4">Categories Stats</Title>
						</Flex>
						<Divider my="sm" />
						<CategoriesStats dateRange={dateRange} />
					</Card>
				</Grid.Col>
			</Grid>
		</>
	);
}
