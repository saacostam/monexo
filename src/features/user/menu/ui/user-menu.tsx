import {
	Avatar,
	Menu,
	MenuDropdown,
	MenuItem,
	MenuLabel,
	MenuTarget,
	Skeleton,
	UnstyledButton,
} from "@mantine/core";
import { useCallback } from "react";
import { useQueryUser } from "@/features/user/core/app";
import { useAdapters } from "@/shared/adapters/core/app";
import { ArrowRightStartOnRectangle } from "@/shared/icons";

export function UserMenu() {
	const { sessionAdapter } = useAdapters();

	const user = useQueryUser().useQuery();

	const onClickLogout = useCallback(
		() => sessionAdapter.removeToken(),
		[sessionAdapter.removeToken],
	);

	return (
		<Menu withArrow>
			<MenuTarget>
				<UnstyledButton>
					{user.isSuccess ? (
						<Avatar color="green">
							{user.data.username.slice(0, 2).toUpperCase()}
						</Avatar>
					) : user.isError ? (
						<Avatar color="green" />
					) : (
						<Skeleton bdrs="100%" height="2.4rem" width="2.4rem" />
					)}
				</UnstyledButton>
			</MenuTarget>

			<MenuDropdown miw="128">
				{user.isSuccess && <MenuLabel>{user.data.username}</MenuLabel>}
				<MenuItem
					leftSection={
						<ArrowRightStartOnRectangle height="1rem" width="1rem" />
					}
					onClick={onClickLogout}
				>
					Logout
				</MenuItem>
			</MenuDropdown>
		</Menu>
	);
}
