import type { FieldValues, UseFormSetError } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { DomainError, DomainErrorType } from "@/shared/errors/domain";
import { FormUtils } from "./index";

describe("FormUtils.handleApiErrors", () => {
	it("should set a generic root error for non-DomainError errors", () => {
		const setError = vi.fn() as UseFormSetError<FieldValues>;

		FormUtils.handleApiErrors({
			error: new Error("Unexpected"),
			setError,
		});

		expect(setError).toHaveBeenCalledTimes(1);

		expect(setError).toHaveBeenCalledWith("root", {
			type: "server",
			message: "An unexpected error occurred.",
		});
	});

	it("should set the root error message from DomainError", () => {
		const setError = vi.fn() as UseFormSetError<FieldValues>;

		const error = new DomainError({
			userMsg: "Something went wrong",
			msg: "Something went wrong",
			type: DomainErrorType.UNKNOWN,
		});

		FormUtils.handleApiErrors({
			error,
			setError,
		});

		expect(setError).toHaveBeenCalledWith("root", {
			type: "server",
			message: "Something went wrong",
		});
	});

	it("should set field-specific errors from DomainError fields", () => {
		type FormValues = {
			email: string;
			password: string;
		};

		const setError = vi.fn() as UseFormSetError<FormValues>;

		const error = new DomainError({
			userMsg: "Validation failed",
			msg: "Validation failed",
			type: DomainErrorType.INVALID_RESPONSE,
			fields: [
				{
					name: "email",
					message: "Invalid email",
				},
				{
					name: "password",
					message: "Password too short",
				},
			],
		});

		FormUtils.handleApiErrors<FormValues>({
			error,
			setError,
		});

		expect(setError).toHaveBeenNthCalledWith(1, "root", {
			type: "server",
			message: "Validation failed",
		});

		expect(setError).toHaveBeenNthCalledWith(2, "email", {
			type: "server",
			message: "Invalid email",
		});

		expect(setError).toHaveBeenNthCalledWith(3, "password", {
			type: "server",
			message: "Password too short",
		});
	});

	it("should only set root error when DomainError has no fields", () => {
		const setError = vi.fn() as UseFormSetError<FieldValues>;

		const error = new DomainError({
			userMsg: "Only root error",
			msg: "Only root error",
			type: DomainErrorType.UNKNOWN,
			fields: undefined,
		});

		FormUtils.handleApiErrors({
			error,
			setError,
		});

		expect(setError).toHaveBeenCalledTimes(1);

		expect(setError).toHaveBeenCalledWith("root", {
			type: "server",
			message: "Only root error",
		});
	});
});
