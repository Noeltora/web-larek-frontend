import { IProductItem } from './ProductAPI';

export interface IBasketModel {
	basketProducts: IProductItem[];

	getCounter: () => number;
	getSumAllProducts: () => number;
	setSelectedСard(data: IProductItem): void;
	deleteCardToBasket(item: IProductItem): void;
	clearBasketProducts(): void;
}

export interface IDataModel {
	productCards: IProductItem[];
	selectedСard: IProductItem;

	setPreview(item: IProductItem): void;
}

export interface IFormModel {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];

	setOrderAddress(field: string, value: string): void;
	validateOrder(): boolean;
	setOrderData(field: string, value: string): void;
	validateContacts(): boolean;
	getOrderLot(): object;
}
