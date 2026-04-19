import { Modal } from "@mantine/core";
import { useCallback } from "react";
import { CreateCategory } from "@/features/category/create/ui";
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
		</section>
	);
}
