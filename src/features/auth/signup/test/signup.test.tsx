import { screen, waitFor } from "@testing-library/dom";
import type { IAuthClientPayload } from "@/features/auth/core/domain";
import { SignUp } from "@/features/auth/signup/ui";
import { mockDi, renderWithProviders } from "@/tests";
import { signupDriver } from "./signup-driver";

describe("SignUp", () => {
	it("should validate password and confirm password match", async () => {
		const di = mockDi();
		renderWithProviders(<SignUp />, di);

		const signup = await signupDriver.findContainer();
		expect(signup).toBeVisible();

		await signupDriver.fillForm({
			username: "test",
			password: "password",
			confirmPassword: "different-password",
		});
		await signupDriver.submitForm();

		expect(screen.getByText("Passwords do not match")).toBeVisible();
	});

	const inputLimitsTestCases: {
		description: string;
		isSubmittable: boolean;
		input: {
			username: string;
			password: string;
			confirmPassword: string;
		};
		expectedError: {
			username: string | null;
			password: string | null;
			confirmPassword: string | null;
		};
	}[] = [
		// Username field
		{
			description: "should require username",
			isSubmittable: false,
			input: {
				username: "",
				password: "test",
				confirmPassword: "test",
			},
			expectedError: {
				username: "Username is required",
				password: null,
				confirmPassword: null,
			},
		},
		{
			description: "should allow username with 48 characters",
			isSubmittable: true,
			input: {
				username: "a".repeat(48),
				password: "test",
				confirmPassword: "test",
			},
			expectedError: {
				username: null,
				password: null,
				confirmPassword: null,
			},
		},
		{
			description: "should reject username longer than 48 characters",
			isSubmittable: false,
			input: {
				username: "a".repeat(48 + 1),
				password: "test",
				confirmPassword: "test",
			},
			expectedError: {
				username: "Max 48 characters allowed for username",
				password: null,
				confirmPassword: null,
			},
		},

		// Password field
		{
			description: "should require password",
			isSubmittable: false,
			input: {
				username: "test",
				password: "",
				confirmPassword: "test",
			},
			expectedError: {
				username: null,
				password: "Password is required",
				confirmPassword: "Passwords do not match",
			},
		},
		{
			description: "should allow password with 48 characters",
			isSubmittable: true,
			input: {
				username: "test",
				password: "a".repeat(48),
				confirmPassword: "a".repeat(48),
			},
			expectedError: {
				username: null,
				password: null,
				confirmPassword: null,
			},
		},
		{
			description: "should reject password longer than 48 characters",
			isSubmittable: false,
			input: {
				username: "test",
				password: "a".repeat(48 + 1),
				confirmPassword: "test",
			},
			expectedError: {
				username: null,
				password: "Max 48 characters allowed for password",
				confirmPassword: "Passwords do not match",
			},
		},

		// Confirm password field
		{
			description: "should require confirm password",
			isSubmittable: false,
			input: {
				username: "test",
				password: "test",
				confirmPassword: "",
			},
			expectedError: {
				username: null,
				password: null,
				confirmPassword: "Confirm password is required",
			},
		},
		{
			description: "should allow confirm password with 48 characters",
			isSubmittable: true,
			input: {
				username: "test",
				password: "a".repeat(48),
				confirmPassword: "a".repeat(48),
			},
			expectedError: {
				username: null,
				password: null,
				confirmPassword: null,
			},
		},
		{
			description: "should reject confirm password longer than 48 characters",
			isSubmittable: false,
			input: {
				username: "test",
				password: "test",
				confirmPassword: "a".repeat(48 + 1),
			},
			expectedError: {
				username: null,
				password: null,
				confirmPassword: "Max 48 characters allowed for confirm password",
			},
		},
	];
	describe("CreateCategory - input limits", () => {
		it.each(inputLimitsTestCases)("$description", async ({
			isSubmittable,
			input,
			expectedError,
		}) => {
			const di = mockDi();
			renderWithProviders(<SignUp />, di);

			const signup = await signupDriver.findContainer();
			expect(signup).toBeVisible();

			await signupDriver.fillForm(input);
			await signupDriver.submitForm();

			const usernameField = screen.getByRole("textbox", { name: /username/i });
			const passwordField = screen.getByPlaceholderText("Password");
			const confirmPasswordField =
				screen.getByPlaceholderText("Confirm Password");

			if (isSubmittable) {
				await waitFor(() => {
					const signupReq: IAuthClientPayload["SignUpIn"] = {
						username: input.username,
						password: input.password,
					};

					expect(di.clients.authClient.signup).toHaveBeenCalledExactlyOnceWith(
						signupReq,
					);
				});
			} else {
				await waitFor(() => {
					expect(di.clients.authClient.signup).not.toHaveBeenCalled();
				});
			}

			const usernameError = signupDriver.getFieldError(usernameField);
			const passwordError = signupDriver.getFieldError(passwordField);
			const confirmPasswordError =
				signupDriver.getFieldError(confirmPasswordField);

			expect(usernameError).toBe(expectedError.username);
			expect(passwordError).toBe(expectedError.password);
			expect(confirmPasswordError).toBe(expectedError.confirmPassword);
		});
	});
});
