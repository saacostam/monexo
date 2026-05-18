import { fireEvent, screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

enum Selector {
	CONTAINER = "signup",
}

class SignupDriver {
	async findContainer() {
		return screen.findByTestId(Selector.CONTAINER);
	}

	async fillForm(args: {
		username: string;
		password: string;
		confirmPassword: string;
	}) {
		const username = screen.getByRole("textbox", { name: /username/i });
		fireEvent.change(username, {
			target: { value: args.username },
		});

		const password = screen.getByPlaceholderText("Password");
		fireEvent.change(password, {
			target: { value: args.password },
		});

		const confirmPassword = screen.getByPlaceholderText("Confirm Password");
		fireEvent.change(confirmPassword, {
			target: { value: args.confirmPassword },
		});
	}

	async submitForm() {
		const submitButton = screen.getByRole("button", { name: /sign up/i });
		return userEvent.click(submitButton);
	}

	getFieldError(input: HTMLElement): string | null {
		const describedBy = input.getAttribute("aria-describedby");
		if (!describedBy) return null;

		const errorEl = document.getElementById(describedBy);
		return errorEl?.textContent ?? null;
	}
}

export const signupDriver = new SignupDriver();
