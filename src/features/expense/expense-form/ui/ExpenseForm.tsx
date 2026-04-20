import {
	Alert,
	Button,
	NumberInput,
	Select,
	Space,
	Textarea,
	TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Controller } from "react-hook-form";
import type { ICategory } from "@/features/category/core/domain";
import type {
	IExpenseForm,
	useExpenseForm,
} from "@/features/expense/expense-form/app";

export interface ExpenseFormProps {
	action: string;
	categories: ICategory[];
	form: ReturnType<typeof useExpenseForm>;
	isPending: boolean;
	onSubmit: (date: IExpenseForm) => void;
}

export function ExpenseForm({
	action,
	categories,
	form,
	isPending,
	onSubmit,
}: ExpenseFormProps) {
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
			<Controller
				control={form.control}
				name="amount"
				render={({ field }) => (
					<NumberInput
						size="sm"
						label="Amount"
						placeholder="Amount"
						value={field.value}
						onChange={(v) => field.onChange(Number(v) || 0)}
						min={0}
						error={errors.amount?.message}
					/>
				)}
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
			<Space h="sm" />
			<Controller
				control={form.control}
				name="date"
				render={({ field }) => (
					<DatePickerInput
						label="Date"
						placeholder="Pick Date"
						value={field.value}
						onChange={field.onChange}
						error={errors.date?.message}
					/>
				)}
			/>
			<Space h="sm" />
			<Controller
				control={form.control}
				name="categoryId"
				render={({ field }) => (
					<Select
						size="sm"
						label="Category"
						placeholder="Category"
						data={categories.map((c) => ({
							value: c.id,
							label: c.name,
						}))}
						value={field.value}
						onChange={field.onChange}
						error={errors.categoryId?.message}
						nothingFoundMessage="Nothing found..."
					/>
				)}
			/>
			{rootErrorMessage && (
				<>
					<Space h="xl" />
					<Alert color="red" title={rootErrorMessage} />
				</>
			)}
			<Space h="xl" />
			<Button type="submit" w="100%" loading={isPending}>
				{action} Expense
			</Button>
		</form>
	);
}
