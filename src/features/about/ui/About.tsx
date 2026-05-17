import { Box, Flex, List, ListItem, Text, Title } from "@mantine/core";

export function About() {
	return (
		<Flex direction="column" gap="lg">
			{/* <Box>
				<Title mb="lg" size="h3">
					Demo
				</Title>
				Embed video element container here later
			</Box> */}

			<Box>
				<Title mb="lg" size="h3">
					About the Project
				</Title>
				<Text>
					Monexo started as a straightforward personal utility to track expenses
					without the setup friction of traditional budgeting apps. I wanted a
					fast way to log transactions, calculate velocity, and view spending
					patterns on a clean interface.
				</Text>
				<Text>
					From an engineering perspective, the project serves as a practical
					showcase for clean codebase organization, type safety, and efficient
					client-side data handling.
				</Text>
			</Box>

			<Box>
				<Title mb="lg" size="h3">
					Key Functionality
				</Title>
				<List>
					<ListItem>
						<Text component="span" fw="bold">
							Dashboard & Metrics:{" "}
						</Text>
						Simple, clear widgets calculating total spend and active transaction
						velocity.
					</ListItem>
					<ListItem>
						<Text component="span" fw="bold">
							Data Visualizations:{" "}
						</Text>
						Category distribution and trend components built using Mantine
						Charts.
					</ListItem>
					<ListItem>
						<Text component="span" fw="bold">
							State & Filters:{" "}
						</Text>
						Coordinated date ranges and active search filtering across view
						layers.
					</ListItem>
					<ListItem>
						<Text component="span" fw="bold">
							Graceful Fallbacks:{" "}
						</Text>
						UI states designed to handle empty conditions elegantly when no data
						or categories are present.
					</ListItem>
				</List>
			</Box>

			<Box>
				<Title mb="lg" size="h3">
					Implementation & Technical Focus
				</Title>
				<List>
					<ListItem>
						<Text component="span" fw="bold">
							Layered Architecture:{" "}
						</Text>
						The codebase follows a structured, vertically sliced layout to
						isolate domain logic from the UI components.
					</ListItem>
					<ListItem>
						<Text component="span" fw="bold">
							Strict Type Safety:{" "}
						</Text>
						Fully typed TypeScript domains that enforce clear boundaries for
						expenses, users, and categories.
					</ListItem>
					<ListItem>
						<Text component="span" fw="bold">
							Scalable Async State:{" "}
						</Text>
						Implementation of React Query for server-state synchronization,
						caching, and clean side-effect management.
					</ListItem>
					<ListItem>
						<Text component="span" fw="bold">
							Component Reusability:{" "}
						</Text>
						A modular UI approach combining Mantine pieces into a consistent
						layout.
					</ListItem>
					<ListItem>
						<Text component="span" fw="bold">
							Complete CRUD Lifecycles:{" "}
						</Text>
						Reliable form handling and state updates across all entity
						workflows.
					</ListItem>
					<ListItem>
						<Text component="span" fw="bold">
							Pragmatic Testing Suite:{" "}
						</Text>
						A growing foundation of integration-level tests. The focus here is
						on prioritizing test setups that offer fast feedback loops and
						remain resilient during structural refactors.
					</ListItem>
				</List>
			</Box>
		</Flex>
	);
}
