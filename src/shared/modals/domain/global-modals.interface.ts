export enum IModalType {
	NONE = "NONE",
	CREATE_CATEGORY = "CRATE_CATEGORY",
}

export type IModal =
	| {
			type: IModalType.NONE;
	  }
	| {
			type: IModalType.CREATE_CATEGORY;
	  };

export interface IGlobalModals {
	modal: IModal;
	set: (modal: IModal) => void;
}
