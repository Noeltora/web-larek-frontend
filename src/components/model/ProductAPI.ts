import { ApiListResponse, Api } from '../base/api';
import {
	IOrder,
	IOrderResult,
	IProductItem,
} from '../../types/components/ProductAPI';

export class ProductApi extends Api {
	cdn: string;
	items: IProductItem[];

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getCatalog(): Promise<IProductItem[]> {
		return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	postOrder(order: IOrder): Promise<IOrderResult> {
		return this.post(`/order`, order).then((data: IOrderResult) => data);
	}
}
