export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IContacts {
	email: string;
	phone: string;
}

export interface IPaymentOption {
	payment: string;
	address: string;
}

export interface IOrder extends IContacts, IPaymentOption {
	items: string[];
	total: number;
}

export interface IOrderResult extends IOrder {
	id: string;
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IActions {
	onClick: (event: MouseEvent) => void;
}
