import { PieChart } from "@mantine/charts";
import {
	ActionIcon,
	Badge,
	Button,
	Card,
	Divider,
	Flex,
	Grid,
	GridCol,
	Indicator,
	type MantineColor,
	Progress,
	Table,
	type TableData,
	Text,
	TextInput,
	ThemeIcon,
	Title,
	Tooltip,
} from "@mantine/core";
import type { ReactNode } from "react";
import { useAdapters } from "@/shared/adapters/core/app";
import { IThemeVariant } from "@/shared/adapters/theme/domain";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	BankNotesIcon,
	ChartBarIcon,
	ChevronDownIcon,
	FireIcon,
	MoonIcon,
	PencilSquareIcon,
	PlusIcon,
	SunIcon,
	TrashIcon,
} from "@/shared/icons";

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
		name: "Remaining Budget",
		icon: <SunIcon />,
		amount: 3,
		diff: 25,
		color: "yellow",
	},
	{
		name: "Today's Spend",
		icon: <MoonIcon />,
		amount: 56,
		diff: -30,
		color: "blue",
	},
];

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

const Actions = () => (
	<Flex direction="row" gap="xs">
		<Tooltip label="Edit">
			<ActionIcon variant="light" size="xs">
				<PencilSquareIcon />
			</ActionIcon>
		</Tooltip>
		<Tooltip label="Delete">
			<ActionIcon color="red" variant="light" size="xs">
				<TrashIcon />
			</ActionIcon>
		</Tooltip>
	</Flex>
);

const TABLE_DATA: TableData = {
	head: [
		<Flex key="1" align="center" gap="xs">
			<ChevronDownIcon height="1rem" width="1rem" /> {"Date"}
		</Flex>,
		"Category",
		"Description",
		<Flex key="2" align="center" gap="xs">
			<ChevronDownIcon height="1rem" width="1rem" /> {"Amount"}
		</Flex>,
		"Actions",
	],
	body: [
		["2026-04-14", "Food", "Lunch", 12.5, <Actions key="1" />],
		["2026-04-14", "House", "Bus fare", 2.75, <Actions key="2" />],
		["2026-04-13", "Food", "Supermarket", 45.2, <Actions key="3" />],
		["2026-04-12", "Fun", "Movie ticket", 10, <Actions key="4" />],
		["2026-04-11", "House", "Electricity bill", 60, <Actions key="5" />],
		["2026-04-10", "House", "Electricity bill", 60, <Actions key="1" />],
	].map((vals) => [
		...vals.slice(0, 1),
		<Badge
			key={vals[1] as string}
			color={
				vals[1] === "Food" ? "green" : vals[1] === "House" ? "blue" : "yellow"
			}
		>
			{vals[1]}
		</Badge>,
		...vals.slice(2),
	]),
};

const CHART_DATA = [
	{ name: "House" as const, value: 400, color: "indigo.6" },
	{ name: "Fun" as const, value: 300, color: "yellow.6" },
	{ name: "Food" as const, value: 300, color: "green.6" },
];

export default function HomeScreen() {
	const { themeAdapter } = useAdapters();

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
					<Flex direction="column" gap="md">
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
			<Grid gutter="md">
				{STATS.map((stat) => (
					<GridCol key={stat.name} span={{ base: 12, sm: 4 }}>
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
			<Grid>
				<GridCol span={{ base: 12, md: 8 }}>
					<Card h="100%" withBorder>
						<Flex
							direction={{ base: "column", sm: "row" }}
							gap="md"
							wrap="wrap"
						>
							<TextInput placeholder="Search..." style={{ flex: 1 }} />
							<Button
								leftSection={<PlusIcon height="1.2rem" width="1.2rem" />}
								variant="outline"
							>
								Add Expense
							</Button>
						</Flex>
						<Divider my="md" />
						<Table
							data={TABLE_DATA}
							striped
							stripedColor={
								themeAdapter.theme === IThemeVariant.LIGHT ? "gray.3" : "dark.7"
							}
							withTableBorder
						/>
					</Card>
				</GridCol>
				<GridCol span={{ base: 12, md: 4 }}>
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
						<Flex
							direction="row"
							gap="xs"
							justify="space-between"
							mb="sm"
							wrap="wrap"
						>
							<Flex align="center" direction="row" gap="xs" wrap="wrap">
								<ThemeIcon bdrs="100%" p="0.25rem">
									<BankNotesIcon />
								</ThemeIcon>
								<Title size="h4">Monthly Budget</Title>
							</Flex>
							<Tooltip label="Edit Budget">
								<ActionIcon variant="light" size="sm">
									<PencilSquareIcon />
								</ActionIcon>
							</Tooltip>
						</Flex>
						<Progress mb="xs" size="1.5rem" striped value={45} />
						<Flex direction="row" justify="space-between">
							<Text size="sm">
								Spent:{" "}
								<Text component="span" inherit fw="bold">
									$14
								</Text>
							</Text>
							<Text size="sm">
								Remaining:{" "}
								<Text component="span" inherit fw="bold">
									$28
								</Text>
							</Text>
						</Flex>
						<Divider my="md" />
						<Button
							rightSection={<ArrowRightIcon height="1.2rem" width="1.2rem" />}
							size="md"
						>
							More Analytics
						</Button>
					</Card>
				</GridCol>
			</Grid>
		</Flex>
	);
}
