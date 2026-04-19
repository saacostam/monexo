import { Box, Button, Flex, Skeleton, Text, Title } from "@mantine/core";
import { useCallback } from "react";
import { useQueryAllCategories } from "@/features/category/core/app";
import { useRetry } from "@/shared/async-state";
import { QueryError } from "@/shared/components";
import { PlusIcon } from "@/shared/icons";
import { useGlobalModals } from "@/shared/modals/app";
import { IModalType } from "@/shared/modals/domain";
import { TableCategoriesContent } from "./TableCategoriesContent";

export function TableCategories() {
	const { set } = useGlobalModals();

	const queryAllCategories = useQueryAllCategories().useQuery();

	const retry = useRetry(
		queryAllCategories.refetch,
		queryAllCategories.isPending,
	);

	const onClickCreateCategory = useCallback(() => {
		set({
			type: IModalType.CREATE_CATEGORY,
		});
	}, [set]);

	return (
		<Flex direction="column" gap="lg">
			<Flex
				align="end"
				direction="row"
				gap="md"
				justify="space-between"
				wrap="wrap"
			>
				<Box>
					<Title size="h2">Manage Categories</Title>
					<Text c="dimmed" size="sm">
						Used to organize your expenses.
					</Text>
				</Box>
				<Button
					leftSection={<PlusIcon height="1rem" width="1rem" />}
					onClick={onClickCreateCategory}
				>
					Create Category
				</Button>
			</Flex>
			{queryAllCategories.isError && (
				<QueryError
					msg="Unable to retrieve categories data"
					retry={retry}
					error={queryAllCategories.error}
					where="ManageCategories.queryAllCategories.isError"
				/>
			)}
			{queryAllCategories.isSuccess && (
				<TableCategoriesContent categories={queryAllCategories.data} />
			)}
			{queryAllCategories.isLoading && <Skeleton h="256px" />}
		</Flex>
	);
}
