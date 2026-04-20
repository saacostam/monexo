import {
	Card,
	Flex,
	Grid,
	GridCol,
	type MantineColor,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import type { ReactNode } from "react";
import { FireIcon, MoonIcon } from "@/shared/icons";

const STATS: {
	name: string;
	icon: ReactNode;
	amount: number;
	diff: number;
	color: MantineColor;
}[] = [
	{
		name: "Total Spent",
		icon: <FireIcon />,
		amount: 100,
		diff: 21,
		color: "blue",
	},
	{
		name: "Today's Spend",
		icon: <MoonIcon />,
		amount: 56,
		diff: -30,
		color: "blue",
	},
];

export function ExpensesStats() {
	return (
		<Grid gutter="md">
			{STATS.map((stat) => (
				<GridCol key={stat.name} span={{ base: 12, sm: 6 }}>
					<Card withBorder>
						<Flex align="center" direction="row" gap="sm">
							<ThemeIcon bdrs="100%" color={stat.color} p="0.125rem">
								{stat.icon}
							</ThemeIcon>
							<Title size="h5">{stat.name}</Title>
							<Text
								fw="bold"
								size="1.3rem"
								style={{ flex: 1, minWidth: 0 }}
								ta="right"
							>
								$ {stat.amount}
							</Text>
						</Flex>
					</Card>
				</GridCol>
			))}
		</Grid>
	);
}
