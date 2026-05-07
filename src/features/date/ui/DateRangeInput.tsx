import {
	Button,
	Flex,
	Menu,
	MenuDropdown,
	MenuItem,
	MenuLabel,
	MenuTarget,
} from "@mantine/core";
import { DatePickerInput, type DatesRangeValue } from "@mantine/dates";
import { useDatePresets } from "@/features/date/app";
import { CalendarDateRangeIcon, ChevronDownIcon } from "@/shared/icons";

export interface DateRangeInputProps {
	dateRange: DatesRangeValue<string>;
	setDateRange: (next: DatesRangeValue<string>) => void;
}

export function DateRangeInput({
	dateRange,
	setDateRange,
}: DateRangeInputProps) {
	const datePresets = useDatePresets();

	return (
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
	);
}
