import {
	Box,
	Button,
	Card,
	Flex,
	Grid,
	GridCol,
	Menu,
	MenuDropdown,
	MenuItem,
	MenuLabel,
	MenuTarget,
	Text,
	Title,
} from "@mantine/core";
import { DatePickerInput, type DatesRangeValue } from "@mantine/dates";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import { useDatePresets } from "@/features/dashboard/app";
import { ExpensesBreakdown } from "@/features/expense/breakdown/ui";
import { ExpensesStats } from "@/features/expense/stats/ui";
import { ExpensesTable } from "@/features/expense/table/ui";
import { useAdapters } from "@/shared/adapters/core/app";
import {
	CalendarDateRangeIcon,
	ChevronDownIcon,
	PlusIcon,
	TagIcon,
} from "@/shared/icons";
import { useGlobalModals } from "@/shared/modals/app";
import { IModalType } from "@/shared/modals/domain";
import { genRoute, RouteName } from "@/shared/router/app";

export function Dashboard() {
	const { date } = useAdapters();

	const { set } = useGlobalModals();

	const datePresets = useDatePresets();
	const [dateRange, setDateRange] = useState<DatesRangeValue<string>>(
		datePresets.at(0)?.datesRangeValue ?? [
			date.todayInYyyyMmDd(),
			date.todayInYyyyMmDd(),
		],
	);
	const dateRangeInMsSinceEpoch = useMemo(() => {
		// enforce: both must exist
		const [startStr, endStr] = dateRange;
		if (!startStr || !endStr) return undefined;

		const toMs = (yyyyMmDd: string) => {
			const res = date.fromYyyyMmDdToUtcMsSinceEpoch(yyyyMmDd);
			return res.ok ? res.value : undefined;
		};

		const start = toMs(startStr);

		let end: number | undefined;
		const nextDay = date.plus(endStr, { days: 1 });
		if (nextDay.ok) {
			end = toMs(nextDay.value);
		}

		if (start === undefined || end === undefined) return undefined;

		return { start, end };
	}, [date.fromYyyyMmDdToUtcMsSinceEpoch, date.plus, dateRange]);

	const onClickAddExpense = useCallback(() => {
		set({
			type: IModalType.CREATE_EXPENSE,
		});
	}, [set]);

	return (
		<Flex direction="column" gap="lg">
			<Flex
				align="end"
				direction="row"
				justify="space-between"
				wrap="wrap"
				gap="md"
			>
				<Box>
					<Title size="h2">Dashboard</Title>
					<Text c="dimmed" size="sm">
						Select a date range to explore.
					</Text>
				</Box>
				<Button
					leftSection={<PlusIcon height="1.2rem" width="1.2rem" />}
					onClick={onClickAddExpense}
					size="md"
				>
					Add Expense
				</Button>
			</Flex>
			<Flex align="center" direction="row" gap="md" wrap="wrap" justify="end">
				<DatePickerInput
					allowSingleDateInRange
					leftSection={<CalendarDateRangeIcon height="1.5rem" width="1.5rem" />}
					onChange={setDateRange}
					placeholder="Date"
					size="md"
					flex="1"
					miw="256"
					type="range"
					value={dateRange}
				/>
				<Menu position="bottom-end" withArrow>
					<MenuTarget>
						<Button
							rightSection={<ChevronDownIcon height="1rem" width="1rem" />}
							size="md"
							variant="light"
							fz="sm"
						>
							Quick Select
						</Button>
					</MenuTarget>
					<MenuDropdown>
						<MenuLabel>
							<Flex direction="row" gap="sm">
								<CalendarDateRangeIcon height="0.9rem" width="0.9rem" />
								Date Presets
							</Flex>
						</MenuLabel>
						{datePresets.map(({ id, datesRangeValue, label }) => (
							<MenuItem key={id} onClick={() => setDateRange(datesRangeValue)}>
								{label}
							</MenuItem>
						))}
					</MenuDropdown>
				</Menu>
			</Flex>
			<ExpensesStats
				start={dateRangeInMsSinceEpoch?.start ?? null}
				end={dateRangeInMsSinceEpoch?.end ?? null}
			/>
			<Grid>
				<GridCol span={{ base: 12, md: 8 }}>
					<ExpensesTable
						start={dateRangeInMsSinceEpoch?.start ?? null}
						end={dateRangeInMsSinceEpoch?.end ?? null}
					/>
				</GridCol>
				<GridCol span={{ base: 12, md: 4 }}>
					<Flex direction="column" gap="md">
						<Card withBorder>
							<Button
								component={Link}
								leftSection={<TagIcon height="1.2rem" width="1.2rem" />}
								size="sm"
								to={genRoute({ name: RouteName.CATEGORY })}
								variant="outline"
							>
								Manage Categories
							</Button>
						</Card>
						<ExpensesBreakdown
							start={dateRangeInMsSinceEpoch?.start ?? null}
							end={dateRangeInMsSinceEpoch?.end ?? null}
						/>
					</Flex>
				</GridCol>
			</Grid>
		</Flex>
	);
}
