import { IDataModel } from '../../types/components/AppState';
import { IProductItem } from '../../types/components/ProductAPI';
import { IEvents } from '../base/events';

export class DataModel implements IDataModel {
	protected _productCards: IProductItem[];
	selectedСard: IProductItem;

	constructor(protected events: IEvents) {
		this._productCards = [];
	}

	set productCards(data: IProductItem[]) {
		this._productCards = data;
		this.events.emit('productCards:receive');
	}

	get productCards() {
		return this._productCards;
	}

	setPreview(item: IProductItem) {
		this.selectedСard = item;
		this.events.emit('modalCard:open', item);
	}
}
