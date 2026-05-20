import { Box, Button, Flex, Space, Text } from "@mantine/core";
import { useMutateRemoveCategory } from "@/features/category/core/app";

export interface DeleteCategoryProps {
	id: string;
	onCancel: () => void;
	onError: (e: unknown) => void;
	onSuccess: () => void;
	onSettled: () => void;
}

export function DeleteCategory({
	id,
	onCancel,
	onError,
	onSuccess,
	onSettled,
}: DeleteCategoryProps) {
	const removeCategory = useMutateRemoveCategory();

	const onClickDelete = () => {
		removeCategory.mutate(
			{ id },
			{
				onError,
				onSuccess,
				onSettled,
			},
		);
	};

	return (
		<Box data-testid="delete-category">
			<Text>Are you sure you want to delete this category?</Text>
			<Space h="md" />
			<Flex direction="row" gap="md" wrap="wrap" justify="space-between">
				<Button flex="1" onClick={onCancel}>
					Cancel
				</Button>
				<Button
					flex="1"
					onClick={onClickDelete}
					loading={removeCategory.isPending}
					variant="outline"
				>
					Delete
				</Button>
			</Flex>
		</Box>
	);
}
