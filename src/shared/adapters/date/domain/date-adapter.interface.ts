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
	 * Validates that a string is a real calendar date in YYYY-MM-DD format.
	 *
	 * - Must match ISO date shape
	 * - Must represent a valid calendar date (e.g. rejects 2024-02-31)
	 * - Interpreted in local timezone
	 */
	isValidYyyyMmDd(date: string): boolean;

	/**
	 * Adds time to a local YYYY-MM-DD date.
	 * Input is interpreted in the client's local timezone.
	 * Output is normalized to YYYY-MM-DD.
	 */
	plus(
		date: string,
		args?: { months?: number; weeks?: number; days?: number },
	): { ok: true; value: string } | { ok: false; error: string };

	/**
	 * Returns today's date in the client's local timezone
	 * formatted as YYYY-MM-DD.
	 *
	 * No UTC conversion is applied.
	 */
	todayInYyyyMmDd(): string;
	/**
	 * Returns start of current week in the client's local timezone
	 * formatted as YYYY-MM-DD.
	 *
	 * No UTC conversion is applied.
	 */
	startOfWeek(): string;

	/**
	 * Returns start of current month in the client's local timezone
	 * formatted as YYYY-MM-DD.
	 *
	 * No UTC conversion is applied.
	 */
	startOfMonth(): string;
}
