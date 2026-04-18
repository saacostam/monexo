import { useMemo } from "react";
import type { ZodType, z } from "zod";
import type {
	IFetcherAdapter,
	IFetcherAdapterRequestConfig,
	IFetcherSideEffects,
} from "@/shared/adapters/fetcher/domain";
import {
	DomainError,
	type DomainErrorField,
	DomainErrorType,
} from "@/shared/errors/domain";

export function useHttpFetcherAdapter(
	sideEffects?: IFetcherSideEffects,
	options?: {
		baseUrl?: string;
		defaultHeaders?: Record<string, string>;
	},
): IFetcherAdapter {
	const baseUrl = options?.baseUrl;
	const defaultHeaders = options?.defaultHeaders;

	return useMemo<IFetcherAdapter>(() => {
		const buildUrl = (
			url: string,
			params?: Record<string, string | number | boolean | null | undefined>,
		) => {
			const fullUrl = baseUrl
				? `${baseUrl.replace(/\/$/, "")}/${url.replace(/^\//, "")}`
				: url;

			if (!params) return fullUrl;

			const query = new URLSearchParams(
				Object.entries(params)
					.filter(([, v]) => v != null)
					.map(([k, v]) => [k, String(v)]),
			).toString();

			return query ? `${fullUrl}?${query}` : fullUrl;
		};

		const buildHeaders = (
			config?: IFetcherAdapterRequestConfig,
			hasBody = false,
		): HeadersInit => {
			return {
				...(hasBody && { "Content-Type": "application/json" }),
				...defaultHeaders,
				...config?.headers,
			};
		};

		const isFieldErrorArray = (
			value: unknown,
		): value is { field: string; message: string }[] => {
			return (
				Array.isArray(value) &&
				value.every(
					(e) =>
						typeof e === "object" &&
						e !== null &&
						"field" in e &&
						"message" in e &&
						typeof e.field === "string" &&
						typeof e.message === "string",
				)
			);
		};

		const getErrorMessage = (payload: unknown): string | undefined => {
			if (
				typeof payload === "object" &&
				payload !== null &&
				"message" in payload &&
				typeof payload.message === "string"
			) {
				return payload.message;
			}
		};

		const getFieldErrors = (
			payload: unknown,
		): DomainErrorField[] | undefined => {
			if (
				typeof payload === "object" &&
				payload !== null &&
				"errors" in payload &&
				isFieldErrorArray(payload.errors)
			) {
				return payload.errors.map((field) => ({
					name: field.field,
					message: field.message,
				}));
			}
		};

		const request = async <T extends ZodType>(
			method: string,
			url: string,
			schema: T,
			body?: unknown,
			config?: IFetcherAdapterRequestConfig,
		): Promise<z.infer<T>> => {
			const res = await fetch(buildUrl(url, config?.params), {
				method,
				headers: buildHeaders(config, body !== undefined),
				body: body !== undefined ? JSON.stringify(body) : undefined,
			});

			const raw = await res.text().catch(() => "");

			let parsed: unknown;
			if (raw) {
				try {
					parsed = JSON.parse(raw);
				} catch {
					parsed = raw;
				}
			}

			if (!res.ok) {
				const fields = getFieldErrors(parsed);
				const userMsg = getErrorMessage(parsed) ?? "Unexpected Server Error";

				if (res.status === 401) {
					sideEffects?.onUnauthorized?.();
				}

				const typeMap: Record<number, DomainErrorType> = {
					401: DomainErrorType.UNAUTHORIZED,
					403: DomainErrorType.FORBIDDEN,
					404: DomainErrorType.NOT_FOUND,
				};

				throw new DomainError({
					type: typeMap[res.status] ?? DomainErrorType.UNKNOWN,
					userMsg,
					msg: `HTTP ${res.status} ${res.statusText}: ${raw}`,
					fields,
				});
			}

			if (!raw) {
				try {
					return schema.parse(undefined);
				} catch {
					throw new DomainError({
						type: DomainErrorType.INVALID_RESPONSE,
						userMsg: "Unexpected App Error",
						msg: "Response body was empty",
					});
				}
			}

			try {
				return schema.parse(parsed);
			} catch (err) {
				throw new DomainError({
					type: DomainErrorType.INVALID_RESPONSE,
					userMsg: "Unexpected App Error",
					msg: `[HttpFetcherAdapter] Schema parse errored out - ${String(err)}`,
				});
			}
		};

		return {
			get: <T extends ZodType>(
				url: string,
				schema: T,
				config?: IFetcherAdapterRequestConfig,
			) => request("GET", url, schema, undefined, config),

			post: <T extends ZodType, B = unknown>(
				url: string,
				schema: T,
				body?: B,
				config?: IFetcherAdapterRequestConfig,
			) => request("POST", url, schema, body, config),

			put: <T extends ZodType, B = unknown>(
				url: string,
				schema: T,
				body?: B,
				config?: IFetcherAdapterRequestConfig,
			) => request("PUT", url, schema, body, config),

			patch: <T extends ZodType, B = unknown>(
				url: string,
				schema: T,
				body?: B,
				config?: IFetcherAdapterRequestConfig,
			) => request("PATCH", url, schema, body, config),

			delete: <T extends ZodType, B = unknown>(
				url: string,
				schema: T,
				body?: B,
				config?: IFetcherAdapterRequestConfig,
			) => request("DELETE", url, schema, body, config),
		};
	}, [baseUrl, defaultHeaders, sideEffects]);
}
