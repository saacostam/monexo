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
import { useGlobalModals } from "@/shared/modals/app";
import { IModalType } from "@/shared/modals/domain";

export interface ExpensesTableContentProps {
	expenses: IWithCategory<IExpense>[];
}

export function ExpensesTableContent({ expenses }: ExpensesTableContentProps) {
	const { date, themeAdapter } = useAdapters();

	const { set } = useGlobalModals();

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
					<TableTh style={{ textAlign: "end" }}>Actions</TableTh>
				</TableTr>
			</TableThead>
			<TableTbody>
				{filteredExpenses.map((expense) => (
					<TableTr key={expense.id}>
						<TableTd>
							{date.fromUtcMsSinceEpochToLocalYyyyMmDd(expense.date)}
						</TableTd>
						<TableTd>{expense.name}</TableTd>
						<TableTd>
							{expense.category ? <Badge>{expense.category.name}</Badge> : "-"}
						</TableTd>
						<TableTd visibleFrom="xs">
							{expense.description ? expense.description : "-"}
						</TableTd>
						<TableTd style={{ textAlign: "end" }}>
							<Actions
								onClickDelete={() =>
									set({
										type: IModalType.UPDATE_EXPENSE,
										payload: { id: expense.id },
									})
								}
								onClickEdit={() =>
									set({
										type: IModalType.UPDATE_EXPENSE,
										payload: { id: expense.id },
									})
								}
							/>
						</TableTd>
					</TableTr>
				))}
			</TableTbody>
		</Table>
	);
}

const Actions = (props: {
	onClickEdit: () => void;
	onClickDelete: () => void;
}) => (
	<Flex direction="row" gap="xs" justify="end">
		<Tooltip label="Edit">
			<ActionIcon onClick={props.onClickEdit} size="xs" variant="subtle">
				<PencilSquareIcon />
			</ActionIcon>
		</Tooltip>
		<Tooltip label="Delete">
			<ActionIcon
				color="red"
				onClick={props.onClickDelete}
				size="xs"
				variant="subtle"
			>
				<TrashIcon />
			</ActionIcon>
		</Tooltip>
	</Flex>
);
