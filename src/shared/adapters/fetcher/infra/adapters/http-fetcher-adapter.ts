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

export class HttpFetcherAdapter implements IFetcherAdapter {
	private readonly baseUrl?: string;
	private readonly defaultHeaders?: Record<string, string>;

	constructor(
		private readonly sideEffects?: IFetcherSideEffects,
		options?: {
			baseUrl?: string;
			defaultHeaders?: Record<string, string>;
		},
	) {
		this.baseUrl = options?.baseUrl;
		this.defaultHeaders = options?.defaultHeaders;
	}

	private buildUrl(
		url: string,
		params?: Record<string, string | number | boolean | null | undefined>,
	) {
		const fullUrl = this.baseUrl
			? `${this.baseUrl.replace(/\/$/, "")}/${url.replace(/^\//, "")}`
			: url;

		if (!params) return fullUrl;

		const query = new URLSearchParams(
			Object.entries(params)
				.filter(([, v]) => v != null)
				.map(([k, v]) => [k, String(v)]),
		).toString();

		return query ? `${fullUrl}?${query}` : fullUrl;
	}

	private buildHeaders(
		config?: IFetcherAdapterRequestConfig,
		hasBody = false,
	): HeadersInit {
		return {
			...(hasBody && { "Content-Type": "application/json" }),
			...this.defaultHeaders,
			...config?.headers,
		};
	}

	private async request<T extends ZodType>(
		method: string,
		url: string,
		schema: T,
		body?: unknown,
		config?: IFetcherAdapterRequestConfig,
	): Promise<z.infer<T>> {
		const res = await fetch(this.buildUrl(url, config?.params), {
			method,
			headers: this.buildHeaders(config, body !== undefined),
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
			const fields = this.getFieldErrors(parsed);
			const userMsg = this.getErrorMessage(parsed) ?? "Unexpected Server Error";

			if (res.status === 401) {
				this.sideEffects?.onUnauthorized?.();
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

		// 204 or empty → let schema decide (z.void(), z.undefined(), etc.)
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

		// Non-empty response
		try {
			return schema.parse(parsed);
		} catch (err) {
			throw new DomainError({
				type: DomainErrorType.INVALID_RESPONSE,
				userMsg: "Unexpected App Error",
				msg: `[HttpFetcherAdapter] Schema parse errored out - ${String(err)}`,
			});
		}
	}

	get<T extends ZodType>(
		url: string,
		schema: T,
		config?: IFetcherAdapterRequestConfig,
	) {
		return this.request("GET", url, schema, undefined, config);
	}

	post<T extends ZodType, B = unknown>(
		url: string,
		schema: T,
		body?: B,
		config?: IFetcherAdapterRequestConfig,
	) {
		return this.request("POST", url, schema, body, config);
	}

	put<T extends ZodType, B = unknown>(
		url: string,
		schema: T,
		body?: B,
		config?: IFetcherAdapterRequestConfig,
	) {
		return this.request("PUT", url, schema, body, config);
	}

	patch<T extends ZodType, B = unknown>(
		url: string,
		schema: T,
		body?: B,
		config?: IFetcherAdapterRequestConfig,
	) {
		return this.request("PATCH", url, schema, body, config);
	}

	delete<T extends ZodType, B = unknown>(
		url: string,
		schema: T,
		body?: B,
		config?: IFetcherAdapterRequestConfig,
	) {
		return this.request("DELETE", url, schema, body, config);
	}

	private getErrorMessage(payload: unknown): string | undefined {
		if (
			typeof payload === "object" &&
			payload !== null &&
			"message" in payload &&
			typeof payload.message === "string"
		) {
			return payload.message;
		}
	}

	private getFieldErrors(payload: unknown): DomainErrorField[] | undefined {
		if (
			typeof payload === "object" &&
			payload !== null &&
			"errors" in payload &&
			this.isFieldErrorArray(payload.errors)
		) {
			return payload.errors.map((field) => ({
				name: field.field,
				message: field.message,
			}));
		}
	}

	private isFieldErrorArray(
		value: unknown,
	): value is { field: string; message: string }[] {
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
	}
}
