import {
	ActionIcon,
	Button,
	Card,
	Flex,
	Input,
	Space,
	Table,
	TableTbody,
	TableTd,
	TableTh,
	TableThead,
	TableTr,
	Title,
	Tooltip,
} from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import type { ICategory } from "@/features/category/core/domain";
import { useAdapters } from "@/shared/adapters/core/app";
import { IThemeVariant } from "@/shared/adapters/theme/domain";
import { EmptyQuery } from "@/shared/components";
import { PencilSquareIcon, TrashIcon } from "@/shared/icons";
import { useGlobalModals } from "@/shared/modals/app";
import { IModalType } from "@/shared/modals/domain";

export interface ManageCategoriesContentProps {
	categories: ICategory[];
}

const FILTER_TYPES = [
	{
		type: "All",
		filter: (_category: ICategory): boolean => true,
	},
	{
		type: "Mine",
		filter: (category: ICategory): boolean =>
			category.ownership.type === "private",
	},
	{
		type: "Public",
		filter: (category: ICategory): boolean =>
			category.ownership.type === "public",
	},
] as const;

export function TableCategoriesContent({
	categories,
}: ManageCategoriesContentProps) {
	const { themeAdapter } = useAdapters();

	const { set } = useGlobalModals();

	const [search, setSearch] = useState("");
	const [filterType, setFilterType] =
		useState<(typeof FILTER_TYPES)[number]["type"]>("All");

	const filteredCategories = useMemo(() => {
		const config =
			FILTER_TYPES.find((c) => c.type === filterType) ?? FILTER_TYPES[0];

		const searchFilter = (c: ICategory) =>
			search.trim() === ""
				? true
				: c.name.toLowerCase().includes(search.toLowerCase());

		return categories.filter(config.filter).filter(searchFilter);
	}, [categories, filterType, search]);

	const onClickEdit = useCallback(
		(id: string) => {
			set({
				type: IModalType.UPDATE_CATEGORY,
				payload: {
					id,
				},
			});
		},
		[set],
	);

	const onClickDelete = useCallback(
		(id: string) => {
			set({
				type: IModalType.REMOVE_CATEGORY,
				payload: {
					id,
				},
			});
		},
		[set],
	);

	return (
		<Flex data-testid="table-categories-content" direction="column" gap="lg">
			<Card withBorder>
				<Title size="h4">Filters</Title>
				<Space h="sm" />
				<Flex align="end" direction="row" gap="md" wrap="wrap">
					<Input
						flex="1"
						miw="256"
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search..."
						size="sm"
						value={search}
					/>
					<Flex direction="row" gap="xs" wrap="wrap">
						{FILTER_TYPES.map(({ type }) => (
							<Button
								key={type}
								onClick={() => setFilterType(type)}
								size="sm"
								variant={filterType === type ? "filled" : "outline"}
							>
								{type}
							</Button>
						))}
					</Flex>
				</Flex>
			</Card>
			<Card withBorder>
				{filteredCategories.length === 0 ? (
					<EmptyQuery title="No categories yet" />
				) : (
					<Table
						striped
						stripedColor={
							themeAdapter.theme === IThemeVariant.LIGHT ? "gray.1" : "dark.7"
						}
						withTableBorder
					>
						<TableThead>
							<TableTr>
								<TableTh>Name</TableTh>
								<TableTh visibleFrom="xs">Description</TableTh>
								<TableTh>Type</TableTh>
								<TableTh style={{ minWidth: "20%", textAlign: "end" }}>
									Actions
								</TableTh>
							</TableTr>
						</TableThead>
						<TableTbody>
							{filteredCategories.map((category) => (
								<TableTr key={category.id}>
									<TableTd>{category.name}</TableTd>
									<TableTd visibleFrom="xs">
										{category.description.length === 0
											? "-"
											: category.description}
									</TableTd>
									<TableTd>
										{category.ownership.type === "public"
											? "Public"
											: "Private"}
									</TableTd>
									<TableTd style={{ textAlign: "end" }}>
										{category.ownership.type === "private" ? (
											<Flex
												align="center"
												direction="row"
												justify="end"
												gap="md"
												wrap="wrap"
											>
												<Tooltip label="Edit Category">
													<ActionIcon
														onClick={() => onClickEdit(category.id)}
														size="xs"
														variant="light"
													>
														<PencilSquareIcon />
													</ActionIcon>
												</Tooltip>
												<Tooltip label="Delete Category">
													<ActionIcon
														color="red"
														onClick={() => onClickDelete(category.id)}
														size="xs"
														variant="light"
													>
														<TrashIcon />
													</ActionIcon>
												</Tooltip>
											</Flex>
										) : (
											"-"
										)}
									</TableTd>
								</TableTr>
							))}
						</TableTbody>
					</Table>
				)}
			</Card>
		</Flex>
	);
}
