import { Box, Button, Flex, Grid, GridCol, Text, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { ExpensesBreakdown } from "@/features/expense/breakdown/ui";
import { ExpensesStats } from "@/features/expense/stats/ui";
import { ExpensesTable } from "@/features/expense/table/ui";
import { CalendarDateRangeIcon, PlusIcon } from "@/shared/icons";

export default function HomeScreen() {
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
					size="md"
				>
					Add Expense
				</Button>
			</Flex>
			<DatePickerInput
				leftSection={<CalendarDateRangeIcon height="1.5rem" width="1.5rem" />}
				placeholder="Date"
				size="md"
				type="range"
			/>
			<ExpensesStats />
			<Grid>
				<GridCol span={{ base: 12, md: 8 }}>
					<ExpensesTable />
				</GridCol>
				<GridCol span={{ base: 12, md: 4 }}>
					<ExpensesBreakdown />
				</GridCol>
			</Grid>
		</Flex>
	);
}
