import { screen, waitFor } from "@testing-library/dom";
import type { ICategoryClientPayload } from "@/features/category/core/domain";
import { CreateCategory } from "@/features/category/create/ui";
import { manageCategoryDriver } from "@/features/category/manage-category/test";
import { mockDi, renderWithProviders } from "@/tests";

function setup() {
	const di = mockDi();

	const onError = vi.fn();
	const onSuccess = vi.fn();
	const onSettled = vi.fn();

	renderWithProviders(
		<CreateCategory
			onError={onError}
			onSuccess={onSuccess}
			onSettled={onSettled}
		/>,
		di,
	);

	return { di, onError, onSuccess, onSettled };
}

describe("CreateCategory", () => {
	it("should create a category", async () => {
		const { di, onError, onSuccess, onSettled } = setup();

		await manageCategoryDriver.fillForm({
			name: "test",
			description: "test",
		});

		await manageCategoryDriver.submitForm({
			buttonCopy: "Create Category",
		});

		await waitFor(() => {
			const createReq: ICategoryClientPayload["CreateRequest"] = {
				name: "test",
				description: "test",
			};
			expect(di.clients.category.create).toHaveBeenCalledExactlyOnceWith(
				createReq,
			);
		});
		expect(onSuccess).toHaveBeenCalledOnce();
		expect(onError).not.toHaveBeenCalled();
		expect(onSettled).toHaveBeenCalledOnce();
	});

	it("should handle errors when creating a category", async () => {
		const { di, onError, onSuccess, onSettled } = setup();

		await manageCategoryDriver.fillForm({
			name: "test",
			description: "test",
		});

		di.clients.category.create.mockRejectedValue(new Error());
		await manageCategoryDriver.submitForm({
			buttonCopy: "Create Category",
		});

		await waitFor(() => {
			const createReq: ICategoryClientPayload["CreateRequest"] = {
				name: "test",
				description: "test",
			};
			expect(di.clients.category.create).toHaveBeenCalledExactlyOnceWith(
				createReq,
			);
		});

		expect(onError).toHaveBeenCalledOnce();
		expect(onSuccess).not.toHaveBeenCalled();
		expect(onSettled).toHaveBeenCalledOnce();
	});

	const inputLimitsTestCases: {
		isSubmittable: boolean;
		input: {
			name: string;
			description: string;
		};
		expectedError: {
			name: string | null;
			description: string | null;
		};
	}[] = [
		{
			isSubmittable: false,
			input: {
				name: "",
				description: "test",
			},
			expectedError: {
				name: "Required",
				description: null,
			},
		},
		{
			isSubmittable: true,
			input: {
				name: "a".repeat(30),
				description: "test",
			},
			expectedError: {
				name: null,
				description: null,
			},
		},
		{
			isSubmittable: false,
			input: {
				name: "a".repeat(31),
				description: "test",
			},
			expectedError: {
				name: "Max 30 characters allowed",
				description: null,
			},
		},
		{
			isSubmittable: true,
			input: {
				name: "test",
				description: "a".repeat(500),
			},
			expectedError: {
				name: null,
				description: null,
			},
		},
		{
			isSubmittable: false,
			input: {
				name: "test",
				description: "a".repeat(501),
			},
			expectedError: {
				name: null,
				description: "Max 500 characters allowed",
			},
		},
	];

	describe("CreateCategory - input limits", () => {
		it.each(inputLimitsTestCases)("should validate input %#", async ({
			isSubmittable,
			input,
			expectedError,
		}) => {
			const { di } = setup();

			await manageCategoryDriver.fillForm(input);

			await manageCategoryDriver.submitForm({
				buttonCopy: "Create Category",
			});

			const nameField = screen.getByRole("textbox", { name: /name/i });
			const descriptionField = screen.getByRole("textbox", {
				name: /description/i,
			});

			if (isSubmittable) {
				await waitFor(() => {
					const createReq: ICategoryClientPayload["CreateRequest"] = {
						name: input.name,
						description: input.description,
					};

					expect(di.clients.category.create).toHaveBeenCalledExactlyOnceWith(
						createReq,
					);
				});
			} else {
				await waitFor(() => {
					expect(di.clients.category.create).not.toHaveBeenCalled();
				});
			}

			const nameError = manageCategoryDriver.getFieldError(nameField);
			const descriptionError =
				manageCategoryDriver.getFieldError(descriptionField);

			expect(nameError).toBe(expectedError.name);
			expect(descriptionError).toBe(expectedError.description);
		});
	});
});
