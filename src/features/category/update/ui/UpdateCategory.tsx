import { Skeleton } from "@mantine/core";
import { useQueryCategoryById } from "@/features/category/core/app";
import type { ICategoryClientPayload } from "@/features/category/core/domain";
import { useRetry } from "@/shared/async-state";
import { QueryError } from "@/shared/components";
import { UpdateCategoryContent } from "./UpdateCategoryContent";

export interface UpdateCategoryProps {
	id: string;
	onError: (e: unknown) => void;
	onSuccess: (res: ICategoryClientPayload["UpdateResponse"]) => void;
	onSettled: () => void;
}

export function UpdateCategory({
	id,
	onError,
	onSuccess,
	onSettled,
}: UpdateCategoryProps) {
	const queryCategoryById = useQueryCategoryById({ id }).useQuery();

	const retry = useRetry(
		queryCategoryById.refetch,
		queryCategoryById.isLoading,
	);

	if (queryCategoryById.isError)
		return (
			<QueryError
				msg="Unable to retrieve category information"
				retry={retry}
				error={queryCategoryById.error}
				where="UpdateCategory.queryCategoryById.isError"
			/>
		);

	if (queryCategoryById.isSuccess)
		return (
			<UpdateCategoryContent
				category={queryCategoryById.data}
				onError={onError}
				onSuccess={onSuccess}
				onSettled={onSettled}
			/>
		);

	return <Skeleton height="128px" />;
}
