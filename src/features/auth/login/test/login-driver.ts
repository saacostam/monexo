import { fireEvent, screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

enum Selector {
	CONTAINER = "login",
}

class LoginDriver {
	async findLoginContainer() {
		return screen.findByTestId(Selector.CONTAINER);
	}

	async fillForm(args: { username: string; password: string }) {
		const username = screen.getByRole("textbox", { name: /username/i });
		fireEvent.change(username, {
			target: { value: args.username },
		});

		const password = screen.getByPlaceholderText("Password");
		fireEvent.change(password, {
			target: { value: args.password },
		});
	}

	async submitForm() {
		const submitButton = screen.getByRole("button", { name: /login/i });
		return userEvent.click(submitButton);
	}
}

export const loginDriver = new LoginDriver();
