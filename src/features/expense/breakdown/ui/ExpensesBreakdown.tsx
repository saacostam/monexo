import { PieChart } from "@mantine/charts";
import {
	Button,
	Card,
	Divider,
	Flex,
	Indicator,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { ArrowRightIcon, ChartBarIcon } from "@/shared/icons";

const CHART_DATA = [
	{ name: "House" as const, value: 400, color: "indigo.6" },
	{ name: "Fun" as const, value: 300, color: "yellow.6" },
	{ name: "Food" as const, value: 300, color: "green.6" },
];

export function ExpensesBreakdown() {
	return (
		<Card h="100%" withBorder>
			<Flex align="center" direction="row" gap="xs" wrap="wrap">
				<ThemeIcon bdrs="100%" p="0.25rem">
					<ChartBarIcon />
				</ThemeIcon>
				<Title size="h4">Spending Breakdown</Title>
			</Flex>
			<Divider my="sm" />
			<Flex justify="center">
				<PieChart
					data={CHART_DATA}
					labelsPosition="outside"
					labelsType="percent"
					withLabels
					withLabelsLine
					withTooltip
				/>
			</Flex>
			<Flex direction="column" gap="0.5rem" wrap="wrap">
				{CHART_DATA.map(({ color, name, value }, i) => (
					<Flex align="center" gap="xs" key={+i}>
						<Indicator color={color} />
						<Text size="xs">
							<Text component="span" fw="bold" size="xs">
								{name}
							</Text>
							{" • "}${value}
						</Text>
					</Flex>
				))}
			</Flex>
			<Divider my="md" />
			<Button
				rightSection={<ArrowRightIcon height="1.2rem" width="1.2rem" />}
				size="md"
			>
				More Analytics
			</Button>
		</Card>
	);
}
