export type IAnalyticsEvent =
	| { name: "login"; payload: { success: boolean } }
	| { name: "signup"; payload: { success: boolean } }
	| { name: "createTodo"; payload: { todoId: string } }
	| { name: "deleteTodo"; payload: { todoId: string } };

export interface IAnalyticsAdapter {
	trackEvent(event: IAnalyticsEvent): void;
}
