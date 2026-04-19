import { zodResolver } from "@hookform/resolvers/zod";
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
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import z from "zod";
import { useMutateSignup } from "@/features/auth/core/app";
import { useAdapters } from "@/shared/adapters/core/app";
import { Logo } from "@/shared/components";
import { genRoute, RouteName } from "@/shared/router/app";
import { FormUtils } from "@/shared/utils/form";

const signUpSchema = z.object({
	username: z.string().min(1, { message: "Username is required" }).max(48),
	password: z.string().min(1, { message: "Password is required" }).max(48),
});

export function SignUp() {
	const nav = useNavigate();

	const { analyticsAdapter, errorMonitoringAdapter, notificationAdapter } =
		useAdapters();

	const form = useForm({
		defaultValues: {
			username: "",
			password: "",
		},
		resolver: zodResolver(signUpSchema),
	});

	const signUp = useMutateSignup();

	const onSubmit = useCallback(
		(data: ReturnType<typeof signUpSchema.parse>) => {
			signUp.mutate(
				{
					...data,
				},
				{
					onSuccess: () => {
						notificationAdapter.notify({
							type: "success",
							msg: "User signed up",
							title: "Signed up",
						});

						analyticsAdapter.trackEvent({
							name: "signup",
							payload: {
								success: true,
							},
						});

						nav(genRoute({ name: RouteName.LOGIN }));
					},
					onError: (error) => {
						FormUtils.handleApiErrors({
							error,
							setError: form.setError,
						});

						errorMonitoringAdapter.report(error, {
							where: "Signup.onSubmit.signup.mutate",
						});

						analyticsAdapter.trackEvent({
							name: "signup",
							payload: {
								success: false,
							},
						});

						notificationAdapter.notify({
							type: "error",
							title: "Error",
							msg: "Unable to signup user. Please try again",
						});
					},
				},
			);
		},
		[
			analyticsAdapter.trackEvent,
			errorMonitoringAdapter.report,
			form.setError,
			nav,
			notificationAdapter.notify,
			signUp,
		],
	);

	const errors = form.formState.errors;
	const rootErrorMessage = errors.root?.message;

	return (
		<Card mx="auto" maw="512" withBorder data-testid="signup">
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Flex justify="center" style={{ scale: 1.2 }}>
					<Logo />
				</Flex>
				<Divider my="md" />
				<Box ta="center" mb="md">
					<Text size="xl" fw="bold">
						Sign Up
					</Text>
					<Text size="sm">💵 Track. Plan. Take control of your spending.</Text>
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
				<Button fullWidth loading={signUp.isPending} type="submit">
					Sign Up
				</Button>
				<Space h="xl" />
				<Text size="sm" ta="center">
					Already have an account?{" "}
					<Anchor
						component={Link}
						inherit
						to={genRoute({ name: RouteName.LOGIN })}
					>
						Login
					</Anchor>
				</Text>
			</form>
		</Card>
	);
}
