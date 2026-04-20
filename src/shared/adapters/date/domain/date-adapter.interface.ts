/**
 * Adapter for managing dates
 */
export interface IDateAdapter {
	/**
	 * Converts a UTC timestamp (ms since epoch) into a local date string (YYYY-MM-DD).
	 *
	 * Interpretation:
	 * - Input is treated as UTC
	 * - Converted to client's local timezone
	 * - Only the date portion is returned
	 */
	fromUtcMsSinceEpochToLocalYyyyMmDd(utcMsSinceEpoch: number): string | null;
	/**
	 * Interprets YYYY-MM-DD as local start of day and converts to UTC ms.
	 */
	fromYyyyMmDdToUtcMsSinceEpoch(
		date: string,
	): { ok: true; value: number } | { ok: false; error: string };
	/**
	 * Returns today's date in the client's local timezone
	 * formatted as YYYY-MM-DD.
	 *
	 * No UTC conversion is applied.
	 */
	todayInYyyyMmDd(): string;
}
