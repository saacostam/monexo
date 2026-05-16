import {
	ActionIcon,
	Badge,
	Button,
	Flex,
	Paper,
	Table,
	TableTbody,
	TableTd,
	TableTh,
	TableThead,
	TableTr,
	Text,
	Tooltip,
} from "@mantine/core";
import { useMemo } from "react";
import type { IExpense, IWithCategory } from "@/features/expense/core/domain";
import { useAdapters } from "@/shared/adapters/core/app";
import { IThemeVariant } from "@/shared/adapters/theme/domain";
import { EmptyQuery } from "@/shared/components";
import {
	InformationCircleIcon,
	PencilSquareIcon,
	TrashIcon,
} from "@/shared/icons";
import { useGlobalModals } from "@/shared/modals/app";
import { IModalType } from "@/shared/modals/domain";

export interface ExpensesTableContentProps {
	expenses: IWithCategory<IExpense>[];
	search: string;
	setSearch: (search: string) => void;
}

export function ExpensesTableContent({
	expenses,
	search,
	setSearch,
}: ExpensesTableContentProps) {
	const { date, themeAdapter } = useAdapters();

	const { set } = useGlobalModals();

	const filteredExpenses = useMemo(() => {
		return [...expenses].filter((e) =>
			e.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
		);
	}, [expenses, search]);

	return (
		<Flex direction="column" gap="md">
			{!!search && (
				<Flex direction="row" justify="space-between">
					<Badge variant="light">Search: {search}</Badge>
					<Button
						color="red"
						size="compact-sm"
						variant="light"
						onClick={() => setSearch("")}
					>
						Clear Filter
					</Button>
				</Flex>
			)}
			{filteredExpenses.length === 0 ? (
				<Paper bg="transparent" p="lg" withBorder>
					<EmptyQuery
						title="No expenses to show here"
						description="Broaden your filters or add an expense"
					/>
				</Paper>
			) : (
				<Table
					striped
					stripedColor={
						themeAdapter.theme === IThemeVariant.LIGHT ? "gray.1" : "dark.7"
					}
					withTableBorder
				>
					<TableThead>
						<TableTr>
							<TableTh>Date</TableTh>
							<TableTh>Name</TableTh>
							<TableTh visibleFrom="xs">Category</TableTh>
							<TableTh style={{ textAlign: "end" }}>Amount</TableTh>
							<TableTh style={{ textAlign: "end" }}>Actions</TableTh>
						</TableTr>
					</TableThead>
					<TableTbody>
						{filteredExpenses.map((expense) => (
							<TableTr key={expense.id}>
								<TableTd>
									{date.fromUtcMsSinceEpochToLocalYyyyMmDd(expense.date)}
								</TableTd>
								<TableTd>
									<Flex align="center" direction="row" gap="0.25rem">
										{expense.description && (
											<Tooltip label={expense.description} flex="0">
												<InformationCircleIcon height="1rem" width="1rem" />
											</Tooltip>
										)}
										<Text component="span" inherit flex="1" miw="0">
											{expense.name}
										</Text>
									</Flex>
								</TableTd>
								<TableTd visibleFrom="xs">
									{expense.category ? (
										<Badge>{expense.category.name}</Badge>
									) : (
										"-"
									)}
								</TableTd>
								<TableTd style={{ textAlign: "end" }}>
									${" "}
									{expense.amount !== undefined || expense.amount !== null
										? expense.amount.toFixed(2)
										: "-"}
								</TableTd>
								<TableTd style={{ textAlign: "end" }}>
									<Actions
										onClickDelete={() =>
											set({
												type: IModalType.REMOVE_EXPENSE,
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
			)}
		</Flex>
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
