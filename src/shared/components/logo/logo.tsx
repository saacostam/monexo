import { Flex, Text, ThemeIcon } from "@mantine/core";
import { BankNotesIcon } from "@/shared/icons";

export function Logo() {
	return (
		<Flex align="center" gap="xs">
			<ThemeIcon
				variant="transparent"
				size="lg"
				color="var(--mantine-primary-color-5)"
			>
				<BankNotesIcon />
			</ThemeIcon>
			<Text fw="bold" size="xl">
				mo
				<Text c="green" component="span" inherit>
					ne
				</Text>
				xo
			</Text>
		</Flex>
	);
}
