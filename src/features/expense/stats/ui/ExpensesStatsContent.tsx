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
import type { IExpense, IWithCategory } from "@/features/expense/core/domain";
import { BankNotesIcon, CalendarDateRangeIcon } from "@/shared/icons";

export interface ExpensesStatsContentProps {
	expensesInCalendarRange: IWithCategory<IExpense>[];
	expensesInToday: IWithCategory<IExpense>[];
}

export function ExpensesStatsContent({
	expensesInCalendarRange,
	expensesInToday,
}: ExpensesStatsContentProps) {
	const total = useMemo(() => {
		let sum = 0;
		for (const e of expensesInCalendarRange) {
			sum += e.amount;
		}

		return sum;
	}, [expensesInCalendarRange]);

	const todayTotal = useMemo(() => {
		let sum = 0;
		for (const e of expensesInToday) {
			sum += e.amount;
		}

		return sum;
	}, [expensesInToday]);

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
							$ {total}
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
							$ {todayTotal}
						</Text>
					</Flex>
				</Card>
			</GridCol>
		</Grid>
	);
}
