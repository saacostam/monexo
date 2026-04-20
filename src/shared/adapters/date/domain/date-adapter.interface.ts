/**
 * Adapter for managing dates
 */
export interface IDateAdapter {
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
