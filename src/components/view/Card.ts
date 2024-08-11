import { IActions, IProductItem } from '../../types/components/ProductAPI';
import { IEvents } from '../base/events';

export interface ICard {
	render(data: IProductItem): HTMLElement;
}

export class Card implements ICard {
	protected _cardElement: HTMLElement;
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _description = <Record<string, string>>{
		дополнительное: 'additional',
		'софт-скил': 'soft',
		кнопка: 'button',
		'хард-скил': 'hard',
		другое: 'other',
	};

	constructor(
		template: HTMLTemplateElement,
		protected events: IEvents,
		actions?: IActions
	) {
		this._cardElement = template.content
			.querySelector('.card')
			.cloneNode(true) as HTMLElement;
		this._category = this._cardElement.querySelector('.card__category');
		this._title = this._cardElement.querySelector('.card__title');
		this._image = this._cardElement.querySelector('.card__image');
		this._price = this._cardElement.querySelector('.card__price');

		if (actions?.onClick) {
			this._cardElement.addEventListener('mousedown', actions.onClick);
		}
	}

	protected setText(element: HTMLElement, value: unknown): string {
		if (element) {
			return (element.textContent = String(value));
		}
	}

	set cardCategory(value: string) {
		this.setText(this._category, value);
		this._category.className = `card__category card__category_${this._description[value]}`;
	}

	protected setPrice(value: number | null): string {
		if (value === null) {
			return 'Бесценно';
		}
		return String(value) + ' синапсов';
	}

	render(data: IProductItem): HTMLElement {
		this._category.textContent = data.category;
		this.cardCategory = data.category;
		this._title.textContent = data.title;
		this._image.src = data.image;
		this._image.alt = this._title.textContent;
		this._price.textContent = this.setPrice(data.price);
		return this._cardElement;
	}
}
