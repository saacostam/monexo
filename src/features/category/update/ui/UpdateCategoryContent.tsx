import { useCallback } from "react";
import { useMutateUpdateCategory } from "@/features/category/core/app";
import type {
	ICategory,
	ICategoryClientPayload,
} from "@/features/category/core/domain";
import {
	type IManageCategoryForm,
	useManageCategory,
} from "@/features/category/manage-category/app";
import { ManageCategory } from "@/features/category/manage-category/ui";

export interface UpdateCategoryContentProps {
	category: ICategory;
	onError: (e: unknown) => void;
	onSuccess: (res: ICategoryClientPayload["UpdateResponse"]) => void;
	onSettled: () => void;
}

export function UpdateCategoryContent({
	category,
	onError,
	onSettled,
	onSuccess,
}: UpdateCategoryContentProps) {
	const form = useManageCategory({
		defaultValues: {
			name: category.name,
			description: category.description,
		},
	});

	const updateCategory = useMutateUpdateCategory();

	const onSubmit = useCallback(
		(data: IManageCategoryForm) => {
			updateCategory.mutate(
				{
					id: category.id,
					name: data.name,
					description: data.description ?? "",
				},
				{
					onSuccess,
					onError,
					onSettled,
				},
			);
		},
		[category.id, onError, onSuccess, onSettled, updateCategory.mutate],
	);

	return (
		<ManageCategory
			action="Update"
			form={form}
			isPending={updateCategory.isPending}
			onSubmit={onSubmit}
		/>
	);
}
