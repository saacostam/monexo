import { Box } from "@mantine/core";
import { useCallback } from "react";
import { useMutateCreateCategory } from "@/features/category/core/app";
import type { ICategoryClientPayload } from "@/features/category/core/domain";
import {
	type IManageCategoryForm,
	useManageCategory,
} from "@/features/category/manage-category/app";
import { ManageCategory } from "@/features/category/manage-category/ui";

export interface CreateCategoryProps {
	onError: (e: unknown) => void;
	onSuccess: (res: ICategoryClientPayload["CreateResponse"]) => void;
	onSettled: () => void;
}

export function CreateCategory({
	onError,
	onSuccess,
	onSettled,
}: CreateCategoryProps) {
	const form = useManageCategory({
		defaultValues: { name: "", description: "" },
	});

	const createCategory = useMutateCreateCategory();

	const onSubmit = useCallback(
		(data: IManageCategoryForm) => {
			createCategory.mutate(
				{
					...data,
				},
				{
					onSuccess,
					onError,
					onSettled,
				},
			);
		},
		[createCategory.mutate, onError, onSuccess, onSettled],
	);

	return (
		<Box data-testid="create-category">
			<ManageCategory
				action="Create"
				form={form}
				isPending={createCategory.isPending}
				onSubmit={onSubmit}
			/>
		</Box>
	);
}
