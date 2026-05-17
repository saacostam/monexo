import { Divider, Flex } from "@mantine/core";
import { About } from "@/features/about/ui";
import { SignUp } from "@/features/auth/signup/ui";

export default function SignUpScreen() {
	return (
		<Flex direction="column" gap="lg">
			<SignUp />
			<Divider mt="xl" />
			<About />
		</Flex>
	);
}
