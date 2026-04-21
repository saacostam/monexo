import {
	Card,
	Flex,
	Grid,
	GridCol,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { useMemo } from "react";
import { useQueryExpensesInRange } from "@/features/expense/core/app";
import { useAdapters } from "@/shared/adapters/core/app";
import { BankNotesIcon, CalendarDateRangeIcon } from "@/shared/icons";
import { ExpensesStatsSkeleton } from "./ExpensesStatsSkeleton";

export interface ExpensesStatsProps {
	start: number | null;
	end: number | null;
}

export function ExpensesStats({ start, end }: ExpensesStatsProps) {
	const { date } = useAdapters();

	const queryAllExpenses = useQueryExpensesInRange({
		// biome-ignore lint/style/noNonNullAssertion: ⚠️ WARNING: Enforced through enabled field
		start: start!,
		// biome-ignore lint/style/noNonNullAssertion: ⚠️ WARNING: Enforced though enabled field
		end: end!,
		enabled: !!start && !!end,
	}).useQuery();

	const stats = useMemo(() => {
		if (!queryAllExpenses.isSuccess) return null;

		const data = queryAllExpenses.data;

		const todayStr = date.todayInYyyyMmDd();
		const todayRes = date.fromYyyyMmDdToUtcMsSinceEpoch(todayStr);

		const tomorrowStrRes = date.plus(todayStr, { days: 1 });
		if (!todayRes.ok || !tomorrowStrRes.ok) return null;

		const tomorrowRes = date.fromYyyyMmDdToUtcMsSinceEpoch(
			tomorrowStrRes.value,
		);
		if (!tomorrowRes.ok) return null;

		let total = 0;
		let todayTotal = 0;

		for (const e of data) {
			total += e.amount;

			if (todayRes.value <= e.date && e.date < tomorrowRes.value) {
				todayTotal += e.amount;
			}
		}

		return { total, todayTotal };
	}, [
		queryAllExpenses.isSuccess,
		queryAllExpenses.data,
		date.todayInYyyyMmDd,
		date.fromYyyyMmDdToUtcMsSinceEpoch,
		date.plus,
	]);

	if (queryAllExpenses.isError) return null; // Quite Error - Not essential feature

	if (stats !== null)
		return (
			<Grid gutter="md">
				<GridCol span={{ base: 12, sm: 6 }}>
					<Card withBorder>
						<Flex align="center" direction="row" gap="sm">
							<ThemeIcon bdrs="100%" color="indigo" p="0.125rem">
								<BankNotesIcon />
							</ThemeIcon>
							<Title size="h5">Total Spent</Title>
							<Text
								fw="bold"
								size="1.3rem"
								style={{ flex: 1, minWidth: 0 }}
								ta="right"
							>
								$ {stats.total}
							</Text>
						</Flex>
					</Card>
				</GridCol>
				<GridCol span={{ base: 12, sm: 6 }}>
					<Card withBorder>
						<Flex align="center" direction="row" gap="sm">
							<ThemeIcon bdrs="100%" color="yellow" p="0.125rem">
								<CalendarDateRangeIcon />
							</ThemeIcon>
							<Title size="h5">Today's Spend</Title>
							<Text
								fw="bold"
								size="1.3rem"
								style={{ flex: 1, minWidth: 0 }}
								ta="right"
							>
								$ {stats.todayTotal}
							</Text>
						</Flex>
					</Card>
				</GridCol>
			</Grid>
		);

	return <ExpensesStatsSkeleton />;
}
