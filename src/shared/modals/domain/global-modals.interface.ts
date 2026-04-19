export enum IModalType {
	NONE = "NONE",
	CREATE_CATEGORY = "CRATE_CATEGORY",
	REMOVE_CATEGORY = "REMOVE_CATEGORY",
	UPDATE_CATEGORY = "UPDATE_CATEGORY",
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
	  };

export interface IGlobalModals {
	modal: IModal;
	set: (modal: IModal) => void;
}
