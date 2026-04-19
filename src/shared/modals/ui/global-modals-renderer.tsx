import { Modal } from "@mantine/core";
import { useCallback } from "react";
import { CreateCategory } from "@/features/category/create/ui";
import { UpdateCategory } from "@/features/category/update/ui";
import { useAdapters } from "@/shared/adapters/core/app";
import { getErrorCopy } from "@/shared/errors/domain";
import { useGlobalModals } from "@/shared/modals/app";
import { IModalType } from "@/shared/modals/domain";

export function GlobalModalsRenderer() {
	const { notificationAdapter } = useAdapters();

	const { modal, set } = useGlobalModals();

	const onClose = useCallback(() => {
		set({ type: IModalType.NONE });
	}, [set]);

	const onCreateCategorySuccess = useCallback(() => {
		notificationAdapter.notify({
			type: "success",
			title: "Created",
			msg: "Category created",
		});
	}, [notificationAdapter.notify]);
	const onCreateCategoryError = useCallback(
		(e: unknown) => {
			const error = getErrorCopy(e, "Failed to create category");

			notificationAdapter.notify({
				type: "error",
				title: "Error",
				msg: error,
			});
		},
		[notificationAdapter.notify],
	);

	const onUpdateCategorySuccess = useCallback(() => {
		notificationAdapter.notify({
			type: "success",
			title: "Updated",
			msg: "Category updated",
		});
	}, [notificationAdapter.notify]);
	const onUpdateCategoryError = useCallback(
		(e: unknown) => {
			const error = getErrorCopy(e, "Failed to update category");

			notificationAdapter.notify({
				type: "error",
				title: "Error",
				msg: error,
			});
		},
		[notificationAdapter.notify],
	);

	return (
		<section>
			<Modal
				opened={modal.type === IModalType.CREATE_CATEGORY}
				onClose={onClose}
				title="Create Category"
			>
				<CreateCategory
					onError={onCreateCategoryError}
					onSuccess={onCreateCategorySuccess}
					onSettled={onClose}
				/>
			</Modal>
			<Modal
				opened={modal.type === IModalType.UPDATE_CATEGORY}
				onClose={onClose}
				title="Update Category"
			>
				{modal.type === IModalType.UPDATE_CATEGORY && (
					<UpdateCategory
						id={modal.payload.id}
						onError={onUpdateCategoryError}
						onSuccess={onUpdateCategorySuccess}
						onSettled={onClose}
					/>
				)}
			</Modal>
		</section>
	);
}
