import { Button, Flex, Space, Text } from "@mantine/core";
import { useMutateDeleteExpense } from "@/features/expense/core/app";

export interface DeleteExpenseProps {
	id: string;
	onCancel: () => void;
	onError: (e: unknown) => void;
	onSuccess: () => void;
	onSettled: () => void;
}

export function DeleteExpense({
	id,
	onCancel,
	onError,
	onSuccess,
	onSettled,
}: DeleteExpenseProps) {
	const deleteExpense = useMutateDeleteExpense();

	const onClickDelete = () => {
		deleteExpense.mutate(
			{ id },
			{
				onError,
				onSuccess,
				onSettled,
			},
		);
	};

	return (
		<>
			<Text>Are you sure you want to delete this Expense?</Text>
			<Space h="md" />
			<Flex direction="row" gap="md" wrap="wrap" justify="space-between">
				<Button flex="1" onClick={onCancel}>
					Cancel
				</Button>
				<Button
					flex="1"
					onClick={onClickDelete}
					loading={deleteExpense.isPending}
					variant="outline"
				>
					Delete
				</Button>
			</Flex>
		</>
	);
}
