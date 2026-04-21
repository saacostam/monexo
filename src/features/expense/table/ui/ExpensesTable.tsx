import {
	Button,
	Card,
	Divider,
	Flex,
	Skeleton,
	TextInput,
} from "@mantine/core";
import { useCallback } from "react";
import { useQueryExpensesInRange } from "@/features/expense/core/app";
import { useRetry } from "@/shared/async-state";
import { QueryError } from "@/shared/components";
import { PlusIcon } from "@/shared/icons";
import { useGlobalModals } from "@/shared/modals/app";
import { IModalType } from "@/shared/modals/domain";
import { ExpensesTableContent } from "./ExpensesTableContent";

export interface ExpensesTableProps {
	start: number | null;
	end: number | null;
}

export function ExpensesTable({ start, end }: ExpensesTableProps) {
	const queryAllExpenses = useQueryExpensesInRange({
		// biome-ignore lint/style/noNonNullAssertion: ⚠️ WARNING: Enforced through enabled field
		start: start!,
		// biome-ignore lint/style/noNonNullAssertion: ⚠️ WARNING: Enforced though enabled field
		end: end!,
		enabled: !!start && !!end,
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
					placeholder="Search..."
					style={{ flex: 1 }}
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
				<ExpensesTableContent expenses={queryAllExpenses.data} />
			)}
			{queryAllExpenses.isLoading && <Skeleton h="256px" />}
		</Card>
	);
}
