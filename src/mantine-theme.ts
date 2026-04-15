export const theme = {
	primaryColor: "green",
	black: "#001a03",
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
