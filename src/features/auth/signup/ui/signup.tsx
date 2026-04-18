import { zodResolver } from "@hookform/resolvers/zod";
import {
	Alert,
	Box,
	Button,
	Card,
	PasswordInput,
	Space,
	Text,
	TextInput,
} from "@mantine/core";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import z from "zod";
import { useMutateSignup } from "@/features/auth/core/app";
import { useAdapters } from "@/shared/adapters/core/app";
import { genRoute, RouteName } from "@/shared/router/app";
import { FormUtils } from "@/shared/utils/form";

const signUpSchema = z.object({
	username: z.string().min(1, { message: "Username is required" }).max(48),
	password: z.string().min(1, { message: "Password is required" }).max(48),
});

export function SignUp() {
	const nav = useNavigate();

	const { analyticsAdapter, errorMonitoringAdapter } = useAdapters();

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
						nav(genRoute({ name: RouteName.LANDING }));

						analyticsAdapter.trackEvent({
							name: "signup",
							payload: {
								success: true,
							},
						});
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
					},
				},
			);
		},
		[
			analyticsAdapter.trackEvent,
			errorMonitoringAdapter.report,
			form.setError,
			signUp,
			nav,
		],
	);

	const errors = form.formState.errors;
	const rootErrorMessage = errors.root?.message;

	return (
		<Card mx="auto" maw="512" withBorder data-testid="signup">
			<form onSubmit={form.handleSubmit(onSubmit)}>
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
			</form>
		</Card>
	);
}
