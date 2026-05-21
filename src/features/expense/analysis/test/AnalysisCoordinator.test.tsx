import type { DatesRangeValue } from "@mantine/dates";
import { AnalysisCoordinator } from "@/features/expense/analysis/ui";
import { mockDi, renderWithProviders } from "@/tests";

describe("AnalysisCoordinator", () => {
	it("should correctly pass state to children slots", async () => {
		const di = mockDi();

		di.adapters.date.plus.mockResolvedValue({
			ok: true,
			value: 200,
		});

		const mockDateRange: DatesRangeValue<string> = ["2026-05-01", "2026-05-31"];
		const setDateRange = vi.fn();

		const BurnRate = vi.fn();
		const CategoriesStats = vi.fn();
		const ExpensesBreakdown = vi.fn();

		renderWithProviders(
			<AnalysisCoordinator
				dateRange={mockDateRange}
				setDateRange={setDateRange}
				BurnRate={BurnRate}
				CategoriesStats={CategoriesStats}
				ExpensesBreakdown={ExpensesBreakdown}
			/>,
			di,
		);

		const props = {
			dateRange: mockDateRange,
		};

		expect(BurnRate).toHaveBeenCalledWith(props, undefined);
		expect(CategoriesStats).toHaveBeenCalledWith(props, undefined);
		expect(ExpensesBreakdown).toHaveBeenCalledWith(props, undefined);
	});
});
