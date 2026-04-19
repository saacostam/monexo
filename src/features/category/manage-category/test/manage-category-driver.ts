import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

class ManageCategoryDriver {
	async fillForm(args: { name: string; description: string }) {
		const nameField = screen.getByRole("textbox", { name: /name/i });
		await userEvent.clear(nameField);
		if (args.name) {
			await userEvent.type(nameField, args.name);
		}

		const descriptionField = screen.getByRole("textbox", {
			name: /description/i,
		});
		await userEvent.clear(descriptionField);
		if (args.description) {
			await userEvent.type(descriptionField, args.description);
		}
	}

	async submitForm(args: { buttonCopy: string }) {
		const submitButton = screen.getByRole("button", {
			name: args.buttonCopy,
		});
		return userEvent.click(submitButton);
	}

	getFieldError(input: HTMLElement): string | null {
		const describedBy = input.getAttribute("aria-describedby");
		if (!describedBy) return null;

		const errorEl = document.getElementById(describedBy);
		return errorEl?.textContent ?? null;
	}
}

export const manageCategoryDriver = new ManageCategoryDriver();
