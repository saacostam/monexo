import { waitFor } from "@testing-library/dom";
import { CategoriesStats } from "@/features/category/stats/ui";
import { DomainError, DomainErrorType } from "@/shared/errors/domain";
import { mockDi, renderWithProviders } from "@/tests";
import { categoriesStatsDriver } from "./categories-stats-driver";

describe("CategoriesStats", () => {
	it("should handle loading state", async () => {
		const di = mockDi();

		di.adapters.date.fromYyyyMmDdToUtcMsSinceEpoch.mockReturnValue({
			ok: true,
			value: 100,
		});
		di.adapters.date.plus.mockReturnValue({
			ok: true,
			value: 200,
		});

		di.clients.expense.getAllInRange.mockImplementation(
			() => new Promise(() => {}),
		);

		renderWithProviders(
			<CategoriesStats dateRange={["2026-05-01", "2026-05-31"]} />,
			di,
		);

		const skeleton = await categoriesStatsDriver.findSkeleton();
		expect(skeleton).toBeVisible();

		await expect(categoriesStatsDriver.findContent()).rejects.toThrow();
	});

	it("should handle query error state", async () => {
		const di = mockDi();

		di.adapters.date.fromYyyyMmDdToUtcMsSinceEpoch.mockReturnValue({
			ok: true,
			value: 100,
		});
		di.adapters.date.plus.mockReturnValue({
			ok: true,
			value: 200,
		});

		di.clients.expense.getAllInRange.mockRejectedValue(
			new DomainError({
				type: DomainErrorType.UNKNOWN,
				msg: "error",
				userMsg: "user-facing-error",
			}),
		);

		renderWithProviders(
			<CategoriesStats dateRange={["2026-05-01", "2026-05-31"]} />,
			di,
		);

		const skeleton = await categoriesStatsDriver.findSkeleton();
		expect(skeleton).toBeVisible();

		await waitFor(async () => {
			const queryError = await categoriesStatsDriver.findQueryError();
			expect(queryError).toBeVisible();
		});

		await expect(categoriesStatsDriver.findContent()).rejects.toThrow();
	});
});
