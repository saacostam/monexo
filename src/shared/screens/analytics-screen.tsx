import {
	Anchor,
	Box,
	Breadcrumbs,
	Flex,
	Skeleton,
	Text,
	Title,
} from "@mantine/core";
import { Link } from "react-router";
import { genRoute, RouteName } from "@/shared/router/app";

export default function AnalyticsScreen() {
	return (
		<Flex direction="column" gap="lg">
			<Breadcrumbs>
				<Anchor component={Link} to={genRoute({ name: RouteName.HOME })}>
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
			<Skeleton h="256px" />
		</Flex>
	);
}
