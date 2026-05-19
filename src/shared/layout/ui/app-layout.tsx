import {
	AppShell,
	Container,
	Flex,
	Group,
	UnstyledButton,
} from "@mantine/core";
import type { PropsWithChildren } from "react";
import { Link } from "react-router";
import { ThemeToggle } from "@/features/theme/ui";
import { UserMenu } from "@/features/user/menu/ui";
import { useAdapters } from "@/shared/adapters/core/app";
import { IThemeVariant } from "@/shared/adapters/theme/domain";
import { Logo } from "@/shared/components";
import { genRoute, RouteName } from "@/shared/router/app";

export function AppLayout({ children }: PropsWithChildren) {
	const { themeAdapter } = useAdapters();

	return (
		<AppShell header={{ height: 60 }} padding="md">
			<AppShell.Header>
				<Group h="100%" px="md">
					<Group justify="space-between" style={{ flex: 1 }}>
						<UnstyledButton
							component={Link}
							to={genRoute({
								name: RouteName.HOME,
							})}
						>
							<Logo />
						</UnstyledButton>

						<Flex gap="lg" align="center">
							<ThemeToggle />
							<UserMenu />
						</Flex>
					</Group>
				</Group>
			</AppShell.Header>

			<AppShell.Main
				bg={themeAdapter.theme === IThemeVariant.LIGHT ? "gray.1" : undefined}
			>
				<Container mx="auto">{children}</Container>
			</AppShell.Main>
		</AppShell>
	);
}
