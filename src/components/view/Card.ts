import { IActions } from '../../types/components/ProductAPI';
import { CategoryType } from '../../utils/constants';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface ICard {
	id: string;
	title: string;
	category: string;
	description: string;
	image: string;
	price: number | null;
	index?: number;
}

export class Card extends Component<ICard> {
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;

	constructor(container: HTMLTemplateElement, actions?: IActions) {
		super(container);
		this._category = container.querySelector('.card__category');
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._image = container.querySelector(`.card__image`);
		this._price = ensureElement<HTMLImageElement>(`.card__price`, container);

		if (actions?.onClick) {
			container.addEventListener('mousedown', actions.onClick);
		}
	}

	// Сеттер ID карточки
	set id(value: string) {
		this.container.dataset.id = value;
	}

	// Геттер ID карточки
	get id(): string {
		return this.container.dataset.id || '';
	}

	// Сеттер для заголовка карточки
	set title(value: string) {
		this.setText(this._title, value);
	}

	// Сеттер для картинки карточки
	set image(value: string) {
		this.setImage(this._image, value);
	}

	// Сеттер установки цены товара
	set price(value: number) {
		value === null
			? this.setText(this._price, 'Бесценно')
			: this.setText(this._price, `${value} синапсов`);
	}

	// Сеттер установки категории товара
	set category(value: string) {
		this.setText(this._category, value);
		this._category.className = `card__category card__category_${CategoryType[value]}`;
	}
}

export class CardView extends Card {
	protected _index: HTMLElement;
	protected _description: HTMLElement;
	buttonElement: HTMLButtonElement;

	constructor(container: HTMLTemplateElement, actions?: IActions) {
		super(container);
		this.buttonElement = container.querySelector('.card__button');
		this._index = container.querySelector('.basket__item-index');
		this._description = container.querySelector('.card__text');
		if (actions?.onClick) {
			if (this.buttonElement) {
				this.buttonElement.addEventListener('mousedown', actions.onClick);
			}
		}
	}

	// Сеттер индекса карточки
	set index(value: number) {
		this.setText(this._index, value);
	}

	// Сеттер отображения текстового содержания карточки
	set description(value: string) {
		this.setText(this._description, value);
	}
}
