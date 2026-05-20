import {
	screen,
	waitFor,
	waitForElementToBeRemoved,
} from "@testing-library/dom";
import type { ICategoryClientPayload } from "@/features/category/core/domain";
import { categoryMockFactory } from "@/features/category/core/test";
import { manageCategoryDriver } from "@/features/category/manage-category/test";
import { updateCategoryDriver } from "@/features/category/update/test";
import { UpdateCategory } from "@/features/category/update/ui";
import { mockDi, renderWithProviders } from "@/tests";

async function setup() {
	const di = mockDi();

	const onError = vi.fn();
	const onSuccess = vi.fn();
	const onSettled = vi.fn();

	const category: ICategoryClientPayload["GetByIdResponse"] =
		categoryMockFactory.createCategory();
	di.clients.category.getById.mockResolvedValue(category);

	renderWithProviders(
		<UpdateCategory
			id={category.id}
			onError={onError}
			onSuccess={onSuccess}
			onSettled={onSettled}
		/>,
		di,
	);

	const skeleton = await updateCategoryDriver.findByTestId("skeleton");
	expect(skeleton).toBeVisible();
	await waitForElementToBeRemoved(skeleton);

	return { category, di, onError, onSuccess, onSettled };
}

describe("UpdateCategory", () => {
	describe("Initial data loaded", () => {
		it("should update a category", async () => {
			const { category, di, onError, onSuccess, onSettled } = await setup();

			await manageCategoryDriver.fillForm({
				name: "test",
				description: "test",
			});

			await manageCategoryDriver.submitForm({
				buttonCopy: "Update Category",
			});

			const updateReq: ICategoryClientPayload["UpdateRequest"] = {
				id: category.id,
				name: "test",
				description: "test",
			};

			await waitFor(() => {
				expect(di.clients.category.update).toHaveBeenCalledExactlyOnceWith(
					updateReq,
				);

				expect(onSuccess).toHaveBeenCalledOnce();
				expect(onError).not.toHaveBeenCalled();
				expect(onSettled).toHaveBeenCalledOnce();
			});
		});

		it("should handle errors when updating a category", async () => {
			const { category, di, onError, onSuccess, onSettled } = await setup();

			di.clients.category.update.mockRejectedValue(new Error());

			await manageCategoryDriver.fillForm({
				name: "test",
				description: "test",
			});

			await manageCategoryDriver.submitForm({
				buttonCopy: "Update Category",
			});

			const updateReq: ICategoryClientPayload["UpdateRequest"] = {
				id: category.id,
				name: "test",
				description: "test",
			};

			await waitFor(() => {
				expect(di.clients.category.update).toHaveBeenCalledExactlyOnceWith(
					updateReq,
				);

				expect(onError).toHaveBeenCalledOnce();
				expect(onSuccess).not.toHaveBeenCalled();
				expect(onSettled).toHaveBeenCalledOnce();
			});
		});

		const inputLimitsTestCases: {
			description: string;
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
				description: "should require name",
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
				description: "should allow name with 30 characters",
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
				description: "should reject name longer than 30 characters",
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
				description: "should allow description with 500 characters",
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
				description: "should reject description longer than 500 characters",
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

		describe("UpdateCategory - input limits", () => {
			it.each(inputLimitsTestCases)("$description", async ({
				isSubmittable,
				input,
				expectedError,
			}) => {
				const { category, di } = await setup();

				await manageCategoryDriver.fillForm(input);

				await manageCategoryDriver.submitForm({
					buttonCopy: "Update Category",
				});

				const nameField = screen.getByRole("textbox", {
					name: /name/i,
				});

				const descriptionField = screen.getByRole("textbox", {
					name: /description/i,
				});

				if (isSubmittable) {
					const updateReq: ICategoryClientPayload["UpdateRequest"] = {
						id: category.id,
						name: input.name,
						description: input.description,
					};

					await waitFor(() => {
						expect(di.clients.category.update).toHaveBeenCalledExactlyOnceWith(
							updateReq,
						);
					});
				} else {
					await waitFor(() => {
						expect(di.clients.category.update).not.toHaveBeenCalled();
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
});
