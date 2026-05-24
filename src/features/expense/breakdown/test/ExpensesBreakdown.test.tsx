import type { DatesRangeValue } from "@mantine/dates";
import { screen, waitForElementToBeRemoved } from "@testing-library/dom";
import { categoryMockFactory } from "@/features/category/core/test";
import { expensesBreakdownDriver } from "@/features/expense/breakdown/test";
import { ExpensesBreakdown } from "@/features/expense/breakdown/ui";
import type { IExpenseClientPayload } from "@/features/expense/core/domain";
import { expenseMockFactory } from "@/features/expense/core/test";
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

	it("should handle render content", async () => {
		const di = mockDi();

		di.adapters.date.fromYyyyMmDdToUtcMsSinceEpoch.mockReturnValue({
			ok: true,
			value: 200,
		});
		di.adapters.date.plus.mockReturnValue({
			ok: true,
			value: 500,
		});

		const food = categoryMockFactory.createCategory({ name: "Food" });
		const transport = categoryMockFactory.createCategory({ name: "Transport" });
		const health = categoryMockFactory.createCategory({ name: "Health" });

		const response: IExpenseClientPayload["GetAllInRangeResponse"] = [
			expenseMockFactory.createExpenseWithCategory({
				category: food,
				categoryId: food.id,
				amount: 10,
			}),
			expenseMockFactory.createExpenseWithCategory({
				category: food,
				categoryId: food.id,
				amount: 20,
			}),
			expenseMockFactory.createExpenseWithCategory({
				category: transport,
				categoryId: transport.id,
				amount: 15,
			}),
			expenseMockFactory.createExpenseWithCategory({
				category: transport,
				categoryId: transport.id,
				amount: 35,
			}),
			expenseMockFactory.createExpenseWithCategory({
				category: health,
				categoryId: health.id,
				amount: 60,
			}),
			expenseMockFactory.createExpenseWithCategory({
				category: health,
				categoryId: health.id,
				amount: 40,
			}),
		];

		di.clients.expense.getAllInRange.mockResolvedValue(response);

		const mockDateRange: DatesRangeValue<string> = ["2026-05-01", "2026-05-31"];

		renderWithProviders(<ExpensesBreakdown dateRange={mockDateRange} />, di);

		const skeleton = await expensesBreakdownDriver.findByTestId("skeleton");
		expect(skeleton).toBeVisible();

		await waitForElementToBeRemoved(skeleton);

		const content = await expensesBreakdownDriver.findByTestId("content");
		expect(content).toBeVisible();

		const foodEntry = screen.getByText("Food").closest("p");
		expect(foodEntry).toHaveTextContent("Food");
		expect(foodEntry).toHaveTextContent("30.00");

		const transportEntry = screen.getByText("Transport").closest("p");
		expect(transportEntry).toHaveTextContent("Transport");
		expect(transportEntry).toHaveTextContent("50.00");

		const healthEntry = screen.getByText("Health").closest("p");
		expect(healthEntry).toHaveTextContent("Health");
		expect(healthEntry).toHaveTextContent("100.00");

		expect(
			expensesBreakdownDriver.queryByTestId("queryError"),
		).not.toBeInTheDocument();
		expect(
			expensesBreakdownDriver.queryByTestId("skeleton"),
		).not.toBeInTheDocument();
	});

	it("should render empty state when no expenses returned", async () => {
		const di = mockDi();

		di.adapters.date.fromYyyyMmDdToUtcMsSinceEpoch.mockReturnValue({
			ok: true,
			value: 200,
		});
		di.adapters.date.plus.mockReturnValue({
			ok: true,
			value: 500,
		});

		const response: IExpenseClientPayload["GetAllInRangeResponse"] = [];
		di.clients.expense.getAllInRange.mockResolvedValue(response);

		const mockDateRange: DatesRangeValue<string> = ["2026-05-01", "2026-05-31"];

		renderWithProviders(<ExpensesBreakdown dateRange={mockDateRange} />, di);

		await waitForElementToBeRemoved(
			await expensesBreakdownDriver.findByTestId("skeleton"),
		);

		expect(
			expensesBreakdownDriver.queryByTestId("content"),
		).toBeInTheDocument();

		const emptyQuery = expensesBreakdownDriver.queryByTestId("emptyQuery");
		expect(emptyQuery).toBeVisible();

		expect(
			expensesBreakdownDriver.queryByTestId("queryError"),
		).not.toBeInTheDocument();
		expect(
			expensesBreakdownDriver.queryByTestId("skeleton"),
		).not.toBeInTheDocument();
	});
});
