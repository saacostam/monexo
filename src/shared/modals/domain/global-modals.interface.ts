export enum IModalType {
	NONE = "NONE",

	CREATE_CATEGORY = "CREATE_CATEGORY",
	REMOVE_CATEGORY = "REMOVE_CATEGORY",
	UPDATE_CATEGORY = "UPDATE_CATEGORY",

	CREATE_EXPENSE = "CREATE_EXPENSE",
	REMOVE_EXPENSE = "REMOVE_EXPENSE",
	UPDATE_EXPENSE = "UPDATE_EXPENSE",
}

export type IModal =
	| {
			type: IModalType.NONE;
	  }
	| {
			type: IModalType.CREATE_CATEGORY;
	  }
	| {
			type: IModalType.REMOVE_CATEGORY;
			payload: {
				id: string;
			};
	  }
	| {
			type: IModalType.UPDATE_CATEGORY;
			payload: {
				id: string;
			};
	  }
	| {
			type: IModalType.CREATE_EXPENSE;
	  }
	| {
			type: IModalType.REMOVE_EXPENSE;
			payload: {
				id: string;
			};
	  }
	| {
			type: IModalType.UPDATE_EXPENSE;
			payload: {
				id: string;
			};
	  };

export interface IGlobalModals {
	modal: IModal;
	set: (modal: IModal) => void;
}
