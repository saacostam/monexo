import {
	ActionIcon,
	Badge,
	Flex,
	Paper,
	Table,
	TableTbody,
	TableTd,
	TableTh,
	TableThead,
	TableTr,
	Tooltip,
} from "@mantine/core";
import type { IExpense, IWithCategory } from "@/features/expense/core/domain";
import { useAdapters } from "@/shared/adapters/core/app";
import { IThemeVariant } from "@/shared/adapters/theme/domain";
import { EmptyQuery } from "@/shared/components";
import { PencilSquareIcon, TrashIcon } from "@/shared/icons";

export interface ExpensesTableContentProps {
	expenses: IWithCategory<IExpense>[];
}

export function ExpensesTableContent({ expenses }: ExpensesTableContentProps) {
	const { themeAdapter } = useAdapters();

	const filteredExpenses = expenses;

	if (filteredExpenses.length === 0) {
		return (
			<Paper bg="transparent" p="lg" withBorder>
				<EmptyQuery
					title="No expenses to show here"
					description="Broaden your filters or add an expense"
				/>
			</Paper>
		);
	}

	return (
		<Table
			striped
			stripedColor={
				themeAdapter.theme === IThemeVariant.LIGHT ? "gray.3" : "dark.7"
			}
			withTableBorder
		>
			<TableThead>
				<TableTr>
					<TableTh>Date</TableTh>
					<TableTh>Name</TableTh>
					<TableTh>Category</TableTh>
					<TableTh visibleFrom="xs">Description</TableTh>
					<TableTh style={{ minWidth: "20%", textAlign: "end" }}>
						Actions
					</TableTh>
				</TableTr>
			</TableThead>
			<TableTbody>
				{filteredExpenses.map((expense) => (
					<TableTr key={expense.id}>
						<TableTd>{expense.date}</TableTd>
						<TableTd>{expense.name}</TableTd>
						<TableTd>
							{expense.category ? <Badge>{expense.category.name}</Badge> : "-"}
						</TableTd>
						<TableTd visibleFrom="xs">{expense.description}</TableTd>
						<TableTd>
							<Actions />
						</TableTd>
					</TableTr>
				))}
			</TableTbody>
		</Table>
	);
}

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
