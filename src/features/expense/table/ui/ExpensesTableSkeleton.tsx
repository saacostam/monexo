import { Flex, Skeleton } from "@mantine/core";
import { useMemo } from "react";

export function ExpensesTableSkeleton() {
	const content = useMemo(
		() =>
			new Array(5)
				.fill(null)
				.map((_, index) => <Skeleton key={+index} h="32px" />),
		[],
	);

	return (
		<Flex direction="column" gap="xs">
			{content}
		</Flex>
	);
}
