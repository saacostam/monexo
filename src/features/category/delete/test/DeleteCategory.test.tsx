import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import type { ICategoryClientPayload } from "@/features/category/core/domain";
import { DeleteCategory } from "@/features/category/delete/ui";
import { DomainError, DomainErrorType } from "@/shared/errors/domain";
import { mockDi, renderWithProviders } from "@/tests";

function setup() {
	const di = mockDi();

	const testId = "mock-id";
	const onCancel = vi.fn();
	const onError = vi.fn();
	const onSuccess = vi.fn();
	const onSettled = vi.fn();

	renderWithProviders(
		<DeleteCategory
			id={testId}
			onCancel={onCancel}
			onError={onError}
			onSuccess={onSuccess}
			onSettled={onSettled}
		/>,
		di,
	);

	return { di, onCancel, onError, onSuccess, onSettled, testId };
}

describe("DeleteCategory", () => {
	it("should delete category", async () => {
		const { di, onCancel, onError, onSuccess, onSettled, testId } = setup();

		let res!: (value: unknown) => void;
		di.clients.category.remove.mockImplementationOnce(
			() =>
				new Promise((resolve) => {
					res = resolve;
				}),
		);

		const deleteButton = screen.getByRole("button", { name: /delete/i });
		await userEvent.click(deleteButton);

		await waitFor(() => {
			const deleteReq: ICategoryClientPayload["RemoveRequest"] = {
				id: testId,
			};

			expect(di.clients.category.remove).toHaveBeenCalledExactlyOnceWith(
				deleteReq,
			);
		});

		const loadingDeleteButton = screen.getByRole("button", {
			name: /delete/i,
		});
		expect(loadingDeleteButton).toBeDisabled();

		res(null);

		await waitFor(() => {
			expect(onSettled).toHaveBeenCalledOnce();
		});
		expect(onSuccess).toHaveBeenCalledOnce();
		expect(onCancel).not.toHaveBeenCalledOnce();
		expect(onError).not.toHaveBeenCalledOnce();
	});

	it("should handle cancel", async () => {
		const { di, onCancel, onError, onSuccess, onSettled } = setup();

		const cancelButton = screen.getByRole("button", { name: /cancel/i });
		await userEvent.click(cancelButton);

		expect(di.clients.category.remove).not.toHaveBeenCalled();
		expect(onCancel).toHaveBeenCalledOnce();
		expect(onSuccess).not.toHaveBeenCalledOnce();
		expect(onError).not.toHaveBeenCalledOnce();
		expect(onSettled).not.toHaveBeenCalledOnce();
	});

	it("should handle error from client", async () => {
		const { di, onCancel, onError, onSuccess, onSettled, testId } = setup();

		di.clients.category.remove.mockRejectedValueOnce(
			new DomainError({
				type: DomainErrorType.UNKNOWN,
				userMsg: "user error",
				msg: "error",
			}),
		);

		const deleteButton = screen.getByRole("button", { name: /delete/i });
		await userEvent.click(deleteButton);

		await waitFor(() => {
			const deleteReq: ICategoryClientPayload["RemoveRequest"] = {
				id: testId,
			};

			expect(di.clients.category.remove).toHaveBeenCalledExactlyOnceWith(
				deleteReq,
			);
		});

		expect(onCancel).not.toHaveBeenCalledOnce();
		expect(onSuccess).not.toHaveBeenCalledOnce();
		expect(onError).toHaveBeenCalledOnce();
		expect(onSettled).toHaveBeenCalledOnce();
	});
});
