import type { DatesRangeValue } from "@mantine/dates";
import { waitForElementToBeRemoved } from "@testing-library/dom";
import { expensesBreakdownDriver } from "@/features/expense/breakdown/test";
import { ExpensesBreakdown } from "@/features/expense/breakdown/ui";
import { DomainError, DomainErrorType } from "@/shared/errors/domain";
import { mockDi, renderWithProviders } from "@/tests";

describe("ExpensesBreakdown", () => {
	it("should handle loading state", async () => {
		const di = mockDi();

		di.adapters.date.fromYyyyMmDdToUtcMsSinceEpoch.mockReturnValue({
			ok: true,
			value: 200,
		});
		di.adapters.date.plus.mockReturnValue({
			ok: true,
			value: 500,
		});

		di.clients.expense.getAllInRange.mockImplementation(
			() => new Promise(() => {}),
		);

		const mockDateRange: DatesRangeValue<string> = ["2026-05-01", "2026-05-31"];

		renderWithProviders(<ExpensesBreakdown dateRange={mockDateRange} />, di);

		const skeleton = await expensesBreakdownDriver.findByTestId("skeleton");
		expect(skeleton).toBeVisible();

		expect(
			expensesBreakdownDriver.queryByTestId("content"),
		).not.toBeInTheDocument();
		expect(
			expensesBreakdownDriver.queryByTestId("queryError"),
		).not.toBeInTheDocument();
	});

	it("should handle query error state", async () => {
		const di = mockDi();

		di.adapters.date.fromYyyyMmDdToUtcMsSinceEpoch.mockReturnValue({
			ok: true,
			value: 200,
		});
		di.adapters.date.plus.mockReturnValue({
			ok: true,
			value: 500,
		});

		di.clients.expense.getAllInRange.mockRejectedValue(
			new DomainError({
				msg: "message",
				type: DomainErrorType.UNKNOWN,
				userMsg: "user-message",
			}),
		);

		const mockDateRange: DatesRangeValue<string> = ["2026-05-01", "2026-05-31"];

		renderWithProviders(<ExpensesBreakdown dateRange={mockDateRange} />, di);

		const skeleton = await expensesBreakdownDriver.findByTestId("skeleton");
		expect(skeleton).toBeVisible();

		await waitForElementToBeRemoved(skeleton);

		const queryError = await expensesBreakdownDriver.findByTestId("queryError");
		expect(queryError).toBeVisible();

		expect(
			expensesBreakdownDriver.queryByTestId("content"),
		).not.toBeInTheDocument();
		expect(
			expensesBreakdownDriver.queryByTestId("skeleton"),
		).not.toBeInTheDocument();
	});
});
