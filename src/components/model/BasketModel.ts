import { IBasketModel } from '../../types/components/AppState';
import { IProductItem } from '../../types/components/ProductAPI';

export class BasketModel implements IBasketModel {
	protected _basketProducts: IProductItem[];

	constructor() {
		this._basketProducts = [];
	}

	set basketProducts(data: IProductItem[]) {
		this._basketProducts = data;
	}

	get basketProducts() {
		return this._basketProducts;
	}

	getCounter() {
		return this.basketProducts.length;
	}

	getSumAllProducts() {
		let sumAll = 0;
		this.basketProducts.forEach((item) => {
			sumAll = sumAll + item.price;
		});
		return sumAll;
	}

	setSelectedСard(data: IProductItem) {
		this._basketProducts.push(data);
	}

	deleteCardToBasket(item: IProductItem) {
		const index = this._basketProducts.indexOf(item);
		if (index >= 0) {
			this._basketProducts.splice(index, 1);
		}
	}

	clearBasketProducts() {
		this.basketProducts = [];
	}
}
