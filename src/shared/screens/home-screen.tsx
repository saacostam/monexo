import {
	Box,
	Button,
	Card,
	Flex,
	Grid,
	GridCol,
	type MantineColor,
	Paper,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { type ReactNode, useMemo } from "react";
import { BankNotesIcon, FireIcon, MoonIcon, SunIcon } from "@/shared/icons";

const STATS: {
	name: string;
	icon: ReactNode;
	amount: number;
	insight: string;
	color: MantineColor;
}[] = [
	{
		name: "Total Expenses",
		icon: <FireIcon />,
		amount: 100,
		insight: "Increased",
		color: "green",
	},
	{
		name: "Today Expenses",
		icon: <SunIcon />,
		amount: -20,
		insight: "Decreased",
		color: "blue",
	},
	{
		name: "New Expenses",
		icon: <MoonIcon />,
		amount: 56,
		insight: "Increased",
		color: "red",
	},
	{
		name: "Purchases",
		icon: <BankNotesIcon />,
		amount: -27,
		insight: "Decreased",
		color: "yellow",
	},
];

export default function HomeScreen() {
	const today = useMemo(() => {
		const date = new Date();
		return date.toDateString();
	}, []);

	return (
		<Flex direction="column" gap="lg">
			<Box>
				<Title size="h2">Dashboard</Title>
				<Text c="dimmed" size="sm">
					{today}
				</Text>
			</Box>
			<Paper p="md" withBorder>
				<Flex
					direction="row"
					gap="md"
					justify="space-between"
					mb="sm"
					wrap="wrap"
				>
					<Title size="h3">All Expenses</Title>
					<Button>Add Expense</Button>
				</Flex>
				<Grid gutter="md">
					{STATS.map((stat) => (
						<GridCol key={stat.name} span={{ base: 12, xs: 6, md: 3 }}>
							<Card withBorder>
								<Flex direction="column" gap="md">
									<Flex align="center" direction="row" gap="sm">
										<ThemeIcon color={stat.color}>{stat.icon}</ThemeIcon>
										<Title size="h5">{stat.name}</Title>
									</Flex>
									<Text fw="bold" size="1.5rem">
										$ {stat.amount}
									</Text>
									<Text c="dimmed" size="xs" ta="right">
										<ThemeIcon color={stat.color} bdrs="100%" size="0.6rem" />{" "}
										{stat.insight}
									</Text>
								</Flex>
							</Card>
						</GridCol>
					))}
				</Grid>
			</Paper>
			<Paper p="md" withBorder></Paper>
		</Flex>
	);
}
