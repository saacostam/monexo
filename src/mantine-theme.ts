export const theme = {
	primaryColor: "green",
	components: {
		Modal: {
			defaultProps: {
				closeButtonProps: {
					"data-testid": "modal-close-button",
				},
				"data-testid": "modal",
			},
		},
	},
};
