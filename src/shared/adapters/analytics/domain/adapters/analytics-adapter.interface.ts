export type IAnalyticsEvent =
	| { name: "login"; payload: { success: boolean } }
	| { name: "signup"; payload: { success: boolean } };

export interface IAnalyticsAdapter {
	trackEvent(event: IAnalyticsEvent): void;
}
