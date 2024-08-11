import { Card } from './Card';
import { IActions, IProductItem } from '../../types/components/ProductAPI';
import { IEvents } from '../base/events';

export interface ICard {
	text: HTMLElement;
	button: HTMLElement;
	render(data: IProductItem): HTMLElement;
}

export class CardPreview extends Card implements ICard {
	text: HTMLElement;
	button: HTMLElement;

	constructor(
		template: HTMLTemplateElement,
		protected events: IEvents,
		actions?: IActions
	) {
		super(template, events, actions);
		this.text = this._cardElement.querySelector('.card__text');
		this.button = this._cardElement.querySelector('.card__button');
		this.button.addEventListener('mousedown', () => {
			this.events.emit('card:addBasket');
		});
	}

	notSale(data: IProductItem) {
		if (data.price) {
			return 'Купить';
		} else {
			this.button.setAttribute('disabled', 'true');
			return 'Не продается';
		}
	}

	render(data: IProductItem): HTMLElement {
		this._category.textContent = data.category;
		this.cardCategory = data.category;
		this._title.textContent = data.title;
		this._image.src = data.image;
		this._image.alt = this._title.textContent;
		this._price.textContent = this.setPrice(data.price);
		this.text.textContent = data.description;
		this.button.textContent = this.notSale(data);
		return this._cardElement;
	}
}
