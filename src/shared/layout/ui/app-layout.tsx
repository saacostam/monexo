import {
	AppShell,
	Burger,
	Container,
	Flex,
	Group,
	UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type PropsWithChildren, useMemo } from "react";
import { Link } from "react-router";
import { ThemeToggle } from "@/features/theme/ui";
import { UserMenu } from "@/features/user/menu/ui";
import { useAdapters } from "@/shared/adapters/core/app";
import { IThemeVariant } from "@/shared/adapters/theme/domain";
import { Logo } from "@/shared/components";
import { genRoute, RouteName } from "@/shared/router/app";

const MAIN_LINKS: {
	name: RouteName;
	label: string;
}[] = [] as const;

export function AppLayout({ children }: PropsWithChildren) {
	const { themeAdapter } = useAdapters();

	const [opened, { toggle }] = useDisclosure();

	const links = useMemo(
		() =>
			MAIN_LINKS.map(({ name, label }) => ({
				href: genRoute({
					name,
				}),
				label,
			})),
		[],
	);

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 300,
				breakpoint: "sm",
				collapsed: { desktop: true, mobile: !opened },
			}}
			padding="md"
		>
			<AppShell.Header>
				<Group h="100%" px="md">
					<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
					<Group justify="space-between" style={{ flex: 1 }}>
						<UnstyledButton
							component={Link}
							to={genRoute({
								name: RouteName.HOME,
							})}
						>
							<Logo />
						</UnstyledButton>
						<Flex gap="lg">
							<Group gap="lg" visibleFrom="sm">
								{links.map(({ href, label }) => (
									<UnstyledButton component={Link} key={href} to={href}>
										{label}
									</UnstyledButton>
								))}
							</Group>
							<ThemeToggle />
							<UserMenu />
						</Flex>
					</Group>
				</Group>
			</AppShell.Header>

			<AppShell.Navbar py="md" px="lg">
				{links.map(({ href, label }) => (
					<UnstyledButton component={Link} key={href} to={href}>
						{label}
					</UnstyledButton>
				))}
			</AppShell.Navbar>

			<AppShell.Main
				bg={themeAdapter.theme === IThemeVariant.LIGHT ? "gray.1" : undefined}
			>
				<Container mx="auto">{children}</Container>
			</AppShell.Main>
		</AppShell>
	);
}
