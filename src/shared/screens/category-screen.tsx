import { Anchor, Breadcrumbs, Flex, Text } from "@mantine/core";
import { Link } from "react-router";
import { TableCategories } from "@/features/category/table/ui";
import { genRoute, RouteName } from "@/shared/router/app";

export default function CategoryScreen() {
	return (
		<Flex direction="column" gap="lg">
			<Breadcrumbs>
				<Anchor component={Link} to={genRoute({ name: RouteName.HOME })}>
					Dashboard
				</Anchor>
				<Text c="green">Categories</Text>
			</Breadcrumbs>
			<TableCategories />
		</Flex>
	);
}
