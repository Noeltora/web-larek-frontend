import { ApiListResponse, Api } from '../base/api';
import {
	IOrder,
	IOrderResult,
	IProductItem,
} from '../../types/components/ProductAPI';

export interface IProductApi {
	getCatalog: () => Promise<IProductItem[]>; // Получение списка всех продуктов, доступных в магазине
	postOrder: (value: IOrder) => Promise<IOrderResult>; // Отправка заказа на сервер
}

export class ProductApi extends Api implements IProductApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	// Получение списка товаров
	getCatalog(): Promise<IProductItem[]> {
		return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	// Отправка заказа
	postOrder(order: IOrder): Promise<IOrderResult> {
		return this.post(`/order`, order).then((data: IOrderResult) => data);
	}
}
