import {
	Box,
	Card,
	CheckIcon,
	Flex,
	Grid,
	GridCol,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { ArrowRightIcon } from "@/shared/icons";

const FEATURES = [
	{
		title: "Dashboard & Metrics",
		description:
			"Simple, clear widgets calculating total spend and active transaction velocity.",
	},
	{
		title: "Data Visualizations",
		description:
			"Category distribution and trend components built using Mantine Charts.",
	},
	{
		title: "State & Filters",
		description:
			"Coordinated date ranges and active search filtering across view layers.",
	},
	{
		title: "Graceful Fallbacks",
		description:
			"UI states designed to handle empty conditions elegantly when no data or categories are present.",
	},
];

const TECH_DETAILS = [
	{
		title: "Layered Architecture",
		description:
			"The codebase follows a structured, vertically sliced layout to isolate domain logic from the UI components.",
	},
	{
		title: "Strict Type Safety",
		description:
			"Fully typed TypeScript domains that enforce clear boundaries for expenses, users, and categories.",
	},
	{
		title: "Scalable Async State",
		description:
			"Implementation of React Query for server-state synchronization, caching, and clean side-effect management.",
	},
	{
		title: "Component Reusability",
		description:
			"A modular UI approach combining Mantine pieces into a consistent layout.",
	},
	{
		title: "Complete CRUD Lifecycles",
		description:
			"Reliable form handling and state updates across all entity workflows.",
	},
	{
		title: "Pragmatic Testing Suite",
		description:
			"A growing foundation of integration-level tests. The focus here is on prioritizing test setups that offer fast feedback loops and remain resilient during structural refactors.",
	},
];

export function About() {
	return (
		<Flex direction="column" gap="lg">
			{/* <Box>
				<Title mb="lg" size="h3">
					Demo
				</Title>
				Embed video element container here later
			</Box> */}

			<Flex direction="column" gap="lg">
				<Title size="h3" ta="center">
					About the Project
				</Title>
				<Text component="p">
					📊 Monexo started as a straightforward personal utility to track
					expenses without the setup friction of traditional budgeting apps. I
					wanted a fast way to log transactions, calculate velocity, and view
					spending patterns on a clean interface.
				</Text>
				<Text component="p">
					From an engineering perspective, the project serves as a practical
					showcase for clean codebase organization, type safety, and efficient
					client-side data handling.
				</Text>
			</Flex>

			<Box>
				<Title mb="lg" size="h3" ta="center">
					Key Functionality
				</Title>
				<Grid gap="sm">
					{FEATURES.map((feat, index) => (
						<GridCol key={+index} span={{ base: 12, xs: 6, sm: 3 }}>
							<Card h="100%">
								<Title size="h5" mb="md">
									<ThemeIcon bdrs="100%" mr="xs" p="0.125rem" size="xs">
										<CheckIcon />
									</ThemeIcon>
									{feat.title}
								</Title>
								<Text>{feat.description}</Text>
							</Card>
						</GridCol>
					))}
				</Grid>
			</Box>

			<Box>
				<Title mb="lg" size="h3" ta="center">
					Implementation & Technical Focus
				</Title>
				<Grid gap="sm">
					{TECH_DETAILS.map((tech, index) => (
						<GridCol key={+index} span={{ base: 12, sm: 6 }}>
							<Card h="100%" w="100%">
								<Flex direction="row" gap="xs" mb="sm">
									<ThemeIcon p="0.125rem" size="sm" variant="light">
										<ArrowRightIcon />
									</ThemeIcon>
									<Title c="green.9" size="h5">
										{tech.title}
									</Title>
								</Flex>
								<Text>{tech.description}</Text>
							</Card>
						</GridCol>
					))}
				</Grid>
			</Box>
		</Flex>
	);
}
