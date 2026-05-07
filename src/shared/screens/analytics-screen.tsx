import { Anchor, Box, Breadcrumbs, Flex, Text, Title } from "@mantine/core";
import { Link } from "react-router";
import { useDateRangeSearchParams } from "@/features/date/app";
import { Analysis } from "@/features/expense/analysis/ui";
import { genRoute, RouteName } from "@/shared/router/app";

export default function AnalyticsScreen() {
	const { dateRange, setDateRange } = useDateRangeSearchParams();

	return (
		<Flex direction="column" gap="lg">
			<Breadcrumbs>
				<Anchor
					component={Link}
					to={genRoute({ name: RouteName.HOME, payload: { range: dateRange } })}
				>
					Dashboard
				</Anchor>
				<Text c="green">Analytics</Text>
			</Breadcrumbs>
			<Box>
				<Title size="h2">Analytics</Title>
				<Text c="dimmed" size="sm">
					Select a date range to explore.
				</Text>
			</Box>
			<Analysis dateRange={dateRange} setDateRange={setDateRange} />
		</Flex>
	);
}
