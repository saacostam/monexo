import { Alert, Button, Space, Textarea, TextInput } from "@mantine/core";
import type {
	IManageCategoryForm,
	useManageCategory,
} from "@/features/category/manage-category/app";

export interface ManageCategoryProps {
	action: string;
	form: ReturnType<typeof useManageCategory>;
	isPending: boolean;
	onSubmit: (data: IManageCategoryForm) => void;
}

export function ManageCategory({
	action,
	form,
	isPending,
	onSubmit,
}: ManageCategoryProps) {
	const errors = form.formState.errors;
	const rootErrorMessage = errors.root?.message;

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<TextInput
				size="sm"
				label="Name"
				placeholder="Name"
				{...form.register("name")}
				error={errors.name?.message}
			/>
			<Space h="sm" />
			<Textarea
				size="sm"
				label="Description"
				placeholder="Description"
				{...form.register("description")}
				error={errors.description?.message}
				autosize
				minRows={2}
				maxRows={5}
			/>
			{rootErrorMessage && (
				<>
					<Space h="xl" />
					<Alert color="red" title={rootErrorMessage} />
				</>
			)}
			<Space h="xl" />
			<Button type="submit" w="100%" loading={isPending}>
				{action} Category
			</Button>
		</form>
	);
}
