import {
	Alert,
	Anchor,
	Box,
	Button,
	Card,
	Divider,
	Flex,
	PasswordInput,
	Space,
	Text,
	TextInput,
} from "@mantine/core";
import { Link } from "react-router";
import { Logo } from "@/shared/components";
import { genRoute, RouteName } from "@/shared/router/app";
import { useLogin } from "../app";

export function Login() {
	const { form, isLoading, onSubmit } = useLogin();

	const errors = form.formState.errors;
	const rootErrorMessage = errors.root?.message;

	return (
		<Card mx="auto" maw="512" withBorder data-testid="login">
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Flex justify="center" style={{ scale: 1.2 }}>
					<Logo />
				</Flex>
				<Divider my="md" />
				<Box ta="center" mb="md">
					<Text size="xl" fw="bold">
						Login
					</Text>
					<Text size="sm">💰 Track expenses. See where your money goes.</Text>
				</Box>
				<TextInput
					size="sm"
					label="Username"
					placeholder="Username"
					{...form.register("username")}
					error={errors.username?.message}
				/>
				<Space h="md" />
				<PasswordInput
					size="sm"
					label="Password"
					placeholder="Password"
					{...form.register("password")}
					error={errors.password?.message}
				/>
				{rootErrorMessage && (
					<>
						<Space h="xl" />
						<Alert color="red" title={rootErrorMessage} />
					</>
				)}
				<Space h="xl" />
				<Button fullWidth loading={isLoading} type="submit">
					Login
				</Button>
				<Space h="xl" />
				<Text size="sm" ta="center">
					Don't have an account?{" "}
					<Anchor
						component={Link}
						inherit
						to={genRoute({ name: RouteName.SIGNUP })}
					>
						Sign Up
					</Anchor>
				</Text>
			</form>
		</Card>
	);
}
