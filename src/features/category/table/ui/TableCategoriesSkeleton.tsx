import { Flex, Skeleton } from "@mantine/core";
import { useMemo } from "react";

export function TableCategoriesSkeleton() {
	const content = useMemo(
		() =>
			new Array(8)
				.fill(null)
				.map((_, index) => <Skeleton key={+index} h="36px" />),
		[],
	);

	return (
		<Flex data-testid="table-categories-skeleton" direction="column" gap="md">
			<Skeleton h="112px" />
			<Flex direction="column" gap="xs">
				{content}
			</Flex>
		</Flex>
	);
}
