import { Card, Divider, Flex, Grid, ThemeIcon, Title } from "@mantine/core";
import type { DatesRangeValue } from "@mantine/dates";
import { DateRangeInput } from "@/features/date/ui";
import { ExpensesBreakdown } from "@/features/expense/breakdown/ui";
import { ChartBarIcon } from "@/shared/icons";

export interface AnalysisProps {
	dateRange: DatesRangeValue<string>;
	setDateRange: (next: DatesRangeValue<string>) => void;
}

export function Analysis({ dateRange, setDateRange }: AnalysisProps) {
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
			</Grid>
		</>
	);
}
