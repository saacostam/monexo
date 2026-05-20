import { screen, waitFor, within } from "@testing-library/dom";

type DriverSelectors = Record<string, { default: string }>;

export class Driver<T extends DriverSelectors> {
	constructor(private readonly selectors: T) {}

	findByTestId(key: keyof T): Promise<HTMLElement> {
		return screen.findByTestId(this.selectors[key].default);
	}

	async findModal(): Promise<HTMLElement> {
		return await waitFor(() => {
			const modals = screen.getAllByTestId("modal");

			const openModal = modals.find((modal) => {
				const isVisible =
					modal.getAttribute("aria-hidden") !== "true" &&
					!modal.hasAttribute("hidden");

				const hasContent = modal.children.length > 0;

				return isVisible && hasContent;
			});

			if (!openModal) {
				throw new Error("No open modal found");
			}

			return openModal;
		});
	}

	findWithinByTestId(element: HTMLElement, key: keyof T): Promise<HTMLElement> {
		return within(element).findByTestId(this.selectors[key].default);
	}

	getAllWithinByTestId(element: HTMLElement, key: keyof T): HTMLElement[] {
		return within(element).getAllByTestId(this.selectors[key].default);
	}

	queryByTestId(key: keyof T): HTMLElement | null {
		return screen.queryByTestId(this.selectors[key].default);
	}

	queryWithinByTestId(element: HTMLElement, key: keyof T): HTMLElement | null {
		return within(element).queryByTestId(this.selectors[key].default);
	}

	selector(key: keyof T): string {
		return this.selectors[key].default;
	}
}
