import { Skeleton, Space } from "@mantine/core";

export function ExpenseFormSkeleton() {
	return (
		<>
			<FieldSkeleton h="32px" />
			<Space h="sm" />
			<FieldSkeleton h="32px" />
			<Space h="sm" />
			<FieldSkeleton h="56px" />
			<Space h="sm" />
			<FieldSkeleton h="32px" />
			<Space h="sm" />
			<FieldSkeleton h="32px" />
			<Space h="xl" />
			<Skeleton h="36px" />
		</>
	);
}

function FieldSkeleton(props: { h: string }) {
	return (
		<>
			<Skeleton h="20px" w="64px" />
			<Space h="0.5rem" />
			<Skeleton h={props.h} />
		</>
	);
}
