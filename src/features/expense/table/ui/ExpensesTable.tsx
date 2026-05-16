import { Button, Card, Divider, Flex, TextInput } from "@mantine/core";
import type { DatesRangeValue } from "@mantine/dates";
import { useCallback } from "react";
import { useDateRangeToMs } from "@/features/date/app";
import { useQueryExpensesInRange } from "@/features/expense/core/app";
import { useRetry } from "@/shared/async-state";
import { QueryError } from "@/shared/components";
import { PlusIcon } from "@/shared/icons";
import { useGlobalModals } from "@/shared/modals/app";
import { IModalType } from "@/shared/modals/domain";
import { ExpensesTableContent } from "./ExpensesTableContent";
import { ExpensesTableSkeleton } from "./ExpensesTableSkeleton";

export interface ExpensesTableProps {
	dateRange: DatesRangeValue<string>;
	search: string;
	setSearch: (search: string) => void;
}

export function ExpensesTable({
	dateRange,
	search,
	setSearch,
}: ExpensesTableProps) {
	const range = useDateRangeToMs({ dateRange });

	const queryAllExpenses = useQueryExpensesInRange({
		// ⚠️ WARNING: Enforced though enabled field
		start: range?.start ?? 0,
		end: range?.end || 0,
		enabled: !!range?.start && !!range.end,
	}).useQuery();

	const retry = useRetry(queryAllExpenses.refetch, queryAllExpenses.isLoading);

	const { set } = useGlobalModals();

	const onClickAddExpense = useCallback(() => {
		set({
			type: IModalType.CREATE_EXPENSE,
		});
	}, [set]);

	return (
		<Card h="100%" withBorder>
			<Flex direction={{ base: "column", sm: "row" }} gap="md" wrap="wrap">
				<TextInput
					disabled={!queryAllExpenses.isSuccess}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search..."
					style={{ flex: 1 }}
					value={search}
				/>
				<Button
					leftSection={<PlusIcon height="1.2rem" width="1.2rem" />}
					variant="outline"
					onClick={onClickAddExpense}
				>
					Add Expense
				</Button>
			</Flex>
			<Divider my="md" />
			{queryAllExpenses.isError && (
				<QueryError
					msg="Unable to retrieve expenses information"
					retry={retry}
					error={queryAllExpenses.error}
					where="ExpensesTable.queryAllExpenses.isError"
				/>
			)}
			{queryAllExpenses.isSuccess && (
				<ExpensesTableContent
					expenses={queryAllExpenses.data}
					search={search}
					setSearch={setSearch}
				/>
			)}
			{queryAllExpenses.isLoading && <ExpensesTableSkeleton />}
		</Card>
	);
}
