import { Divider, Flex } from "@mantine/core";
import { About } from "@/features/about/ui";
import { Login } from "@/features/auth/login/ui";

export default function LoginScreen() {
	return (
		<Flex direction="column" gap="lg">
			<Login />
			<Divider mt="xl" />
			<About />
		</Flex>
	);
}
