import {
	ActionIcon,
	Badge,
	Button,
	Card,
	Divider,
	Flex,
	Table,
	type TableData,
	TextInput,
	Tooltip,
} from "@mantine/core";
import { useAdapters } from "@/shared/adapters/core/app";
import { IThemeVariant } from "@/shared/adapters/theme/domain";
import {
	ChevronDownIcon,
	PencilSquareIcon,
	PlusIcon,
	TrashIcon,
} from "@/shared/icons";

const Actions = () => (
	<Flex direction="row" gap="xs">
		<Tooltip label="Edit">
			<ActionIcon variant="subtle" size="xs">
				<PencilSquareIcon />
			</ActionIcon>
		</Tooltip>
		<Tooltip label="Delete">
			<ActionIcon color="red" variant="subtle" size="xs">
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

export function ExpensesTable() {
	const { themeAdapter } = useAdapters();

	return (
		<Card h="100%" withBorder>
			<Flex direction={{ base: "column", sm: "row" }} gap="md" wrap="wrap">
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
	);
}
