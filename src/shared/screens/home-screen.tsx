import { Button, Card, Flex, Grid, GridCol, Text } from "@mantine/core";
import { ExpensesBreakdown } from "@/features/expense/breakdown/ui";
import { ExpensesStats } from "@/features/expense/stats/ui";
import { ExpensesTable } from "@/features/expense/table/ui";
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from "@/shared/icons";

const TIME_RANGES: {
	label: string;
}[] = [
	{
		label: "Month",
	},
	{
		label: "Week",
	},
	{
		label: "Day",
	},
];

export default function HomeScreen() {
	return (
		<Flex direction="column" gap="lg">
			<Card withBorder>
				<Flex
					align="center"
					direction="row"
					justify="space-between"
					wrap="wrap"
					gap="md"
				>
					<Flex align="center" direction="column" gap="md">
						<Flex align="center" direction="row" gap="xs" wrap="wrap">
							<Button size="compact-sm">
								<ArrowLeftIcon height="1rem" width="1rem" />
							</Button>
							<Text fw="bold" size="1.6rem">
								April / 2026
							</Text>
							<Button size="compact-sm">
								<ArrowRightIcon height="1rem" width="1rem" />
							</Button>
						</Flex>
						<Flex direction="row" gap="xs" wrap="wrap">
							{TIME_RANGES.map(({ label }) => (
								<Button
									key={label}
									size="compact-sm"
									variant={
										label === TIME_RANGES.at(0)?.label ? "filled" : "light"
									}
								>
									{label}
								</Button>
							))}
						</Flex>
					</Flex>
					<Button
						leftSection={<PlusIcon height="1.2rem" width="1.2rem" />}
						size="md"
					>
						Add Expense
					</Button>
				</Flex>
			</Card>
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
