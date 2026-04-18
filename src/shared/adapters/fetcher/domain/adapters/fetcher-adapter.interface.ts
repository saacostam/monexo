import type { ZodType, z } from "zod";

export interface IFetcherAdapter {
	get<T extends ZodType>(
		url: string,
		schema: T,
		config?: IFetcherAdapterRequestConfig,
	): Promise<z.infer<T>>;

	post<T extends ZodType, B = unknown>(
		url: string,
		schema: T,
		body?: B,
		config?: IFetcherAdapterRequestConfig,
	): Promise<z.infer<T>>;

	put<T extends ZodType, B = unknown>(
		url: string,
		schema: T,
		body?: B,
		config?: IFetcherAdapterRequestConfig,
	): Promise<z.infer<T>>;

	patch<T extends ZodType, B = unknown>(
		url: string,
		schema: T,
		body?: B,
		config?: IFetcherAdapterRequestConfig,
	): Promise<z.infer<T>>;

	delete<T extends ZodType, B = unknown>(
		url: string,
		schema: T,
		body?: B,
		config?: IFetcherAdapterRequestConfig,
	): Promise<z.infer<T>>;
}

export interface IFetcherAdapterRequestConfig {
	headers?: Record<string, string>;
	params?: Record<string, string | number | boolean>;
}

export interface IFetcherSideEffects {
	onUnauthorized?: () => Promise<void> | void;
}
