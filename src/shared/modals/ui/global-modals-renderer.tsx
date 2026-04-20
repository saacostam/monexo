import { Modal } from "@mantine/core";
import { useCallback } from "react";
import { CreateCategory } from "@/features/category/create/ui";
import { DeleteCategory } from "@/features/category/delete/ui";
import { UpdateCategory } from "@/features/category/update/ui";
import { CreateExpense } from "@/features/expense/create/ui";
import { UpdateExpense } from "@/features/expense/update/ui";
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

	const onDeleteCategorySuccess = useCallback(() => {
		notificationAdapter.notify({
			type: "success",
			title: "Delete",
			msg: "Category deleted",
		});
	}, [notificationAdapter.notify]);
	const onDeleteCategoryError = useCallback(
		(e: unknown) => {
			const error = getErrorCopy(e, "Failed to delete category");

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

	const onCreateExpenseSuccess = useCallback(() => {
		notificationAdapter.notify({
			type: "success",
			title: "Created",
			msg: "Expense created",
		});
	}, [notificationAdapter.notify]);

	const onCreateExpenseError = useCallback(
		(e: unknown) => {
			const error = getErrorCopy(e, "Failed to create expense");

			notificationAdapter.notify({
				type: "error",
				title: "Error",
				msg: error,
			});
		},
		[notificationAdapter.notify],
	);

	const onUpdateExpenseSuccess = useCallback(() => {
		notificationAdapter.notify({
			type: "success",
			title: "Updated",
			msg: "Expense updated",
		});
	}, [notificationAdapter.notify]);

	const onUpdateExpenseError = useCallback(
		(e: unknown) => {
			const error = getErrorCopy(e, "Failed to update expense");

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
			<Modal
				opened={modal.type === IModalType.REMOVE_CATEGORY}
				onClose={onClose}
				title="Delete Category"
			>
				{modal.type === IModalType.REMOVE_CATEGORY && (
					<DeleteCategory
						id={modal.payload.id}
						onCancel={onClose}
						onError={onDeleteCategoryError}
						onSuccess={onDeleteCategorySuccess}
						onSettled={onClose}
					/>
				)}
			</Modal>
			<Modal
				opened={modal.type === IModalType.CREATE_EXPENSE}
				onClose={onClose}
				title="Create Expense"
			>
				<CreateExpense
					onError={onCreateExpenseError}
					onSuccess={onCreateExpenseSuccess}
					onSettled={onClose}
				/>
			</Modal>
			<Modal
				opened={modal.type === IModalType.UPDATE_EXPENSE}
				onClose={onClose}
				title="Update Expense"
			>
				{modal.type === IModalType.UPDATE_EXPENSE && (
					<UpdateExpense
						id={modal.payload.id}
						onError={onUpdateExpenseError}
						onSuccess={onUpdateExpenseSuccess}
						onSettled={onClose}
					/>
				)}
			</Modal>
		</section>
	);
}
