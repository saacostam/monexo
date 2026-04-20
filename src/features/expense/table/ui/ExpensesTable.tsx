import {
	Button,
	Card,
	Divider,
	Flex,
	Skeleton,
	TextInput,
} from "@mantine/core";
import { useQueryExpenses } from "@/features/expense/core/app";
import { useRetry } from "@/shared/async-state";
import { QueryError } from "@/shared/components";
import { PlusIcon } from "@/shared/icons";
import { ExpensesTableContent } from "./ExpensesTableContent";

export function ExpensesTable() {
	const queryAllExpenses = useQueryExpenses().useQuery();

	const retry = useRetry(queryAllExpenses.refetch, queryAllExpenses.isLoading);

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
				>
					Add Expense
				</Button>
			</Flex>
			<Divider my="md" />
			{queryAllExpenses.isError && (
				<QueryError
					msg="Unable to retrieve expenses informatin"
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
