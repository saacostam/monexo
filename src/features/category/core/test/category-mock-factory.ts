import type { ICategory } from "@/features/category/core/domain";

class CategoryMockFactory {
	_id = 0;

	_getId() {
		this._id++;
		return String(this._id);
	}

	createCategory(overrides?: Partial<ICategory>): ICategory {
		const id = this._getId();

		return {
			id,
			name: `name-${id}`,
			description: `description-${id}`,
			ownership: {
				type: "public",
			},
			...overrides,
		};
	}
}

export const categoryMockFactory = new CategoryMockFactory();
