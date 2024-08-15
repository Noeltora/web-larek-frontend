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

export interface IOrderResult {
	total: number;
}

export interface IPage {
	counter: HTMLElement;
	catalog: HTMLElement;
	basket: HTMLElement;
}

export type CatalogItemStatus = {
	category: 'софт-скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное';
};

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IActions {
	onClick: (event: MouseEvent) => void;
}
