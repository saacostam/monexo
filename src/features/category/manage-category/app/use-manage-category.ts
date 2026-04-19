import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const categorySchema = z.object({
	name: z.string().min(1, "Required").max(30, "Max 30 characters allowed"),
	description: z
		.string()
		.min(0)
		.max(500, "Max 500 characters allowed")
		.nullable()
		.optional(),
});

export type IManageCategoryForm = z.infer<typeof categorySchema>;

export interface UseManageCategoryArgs {
	defaultValues?: {
		name?: string;
		description?: string;
	};
}

export function useManageCategory(props?: UseManageCategoryArgs) {
	return useForm({
		defaultValues: {
			name: props?.defaultValues?.name ?? "",
			description: props?.defaultValues?.description ?? "",
		},
		resolver: zodResolver(categorySchema),
	});
}
