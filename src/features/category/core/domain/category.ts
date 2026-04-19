/**
 * Category used for grouping and organizing expenses.
 */
export interface ICategory {
	id: string;
	name: string;
	description: string;
	ownership:
		| {
				type: "public";
		  }
		| {
				type: "private";
				userId: string;
		  };
}
