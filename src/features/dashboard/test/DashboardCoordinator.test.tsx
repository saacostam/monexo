import type { DatesRangeValue } from "@mantine/dates";
import { DashboardCoordinator } from "@/features/dashboard/ui";
import { mockDi, renderWithProviders } from "@/tests";

describe("DashboardCoordinator", () => {
	it("should correctly pass state to children slots", async () => {
		const di = mockDi();

		di.adapters.date.plus.mockResolvedValue({
			ok: true,
			value: 200,
		});

		const mockDateRange: DatesRangeValue<string> = ["2026-05-01", "2026-05-31"];
		const setDateRange = vi.fn();
		const mockSearch = "search";
		const setSearch = vi.fn();

		const ExpensesBreakdown = vi.fn();
		const ExpensesTable = vi.fn();
		const ExpensesStats = vi.fn();

		renderWithProviders(
			<DashboardCoordinator
				dateRange={mockDateRange}
				setDateRange={setDateRange}
				search={mockSearch}
				setSearch={setSearch}
				ExpensesBreakdown={ExpensesBreakdown}
				ExpensesTable={ExpensesTable}
				ExpensesStats={ExpensesStats}
			/>,
			di,
		);

		const props = {
			dateRange: mockDateRange,
			search: mockSearch,
			setSearch: setSearch,
		};

		expect(ExpensesBreakdown).toHaveBeenCalledWith(props, undefined);
		expect(ExpensesTable).toHaveBeenCalledWith(props, undefined);
		expect(ExpensesStats).toHaveBeenCalledWith(props, undefined);
	});
});
