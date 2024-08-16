import { Component } from '../base/Component';
import { createElement, ensureElement, formatNumber } from '../../utils/utils';
import { EventEmitter } from '../base/events';

interface IBasketView {
	total: number;
	basketList: HTMLElement[];
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	button: HTMLButtonElement;
	protected _price: HTMLElement;

	constructor(container: HTMLTemplateElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this.button = this.container.querySelector('.basket__button');
		this._price = this.container.querySelector('.basket__price');

		if (this.button) {
			this.button.addEventListener('mousedown', () => {
				this.events.emit('order:open');
			});
		}

		this.items = [];
	}

	// Сеттер установки списка элементов в корзине
	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	// Сеттер установки выбранных элементов в корзине
	set selected(items: string[]) {
        this.setDisabled(this.button, items.length === 0);
    }

	// Сеттер установки общей суммы заказа
	set total(sumAll: number) {
		this.setText(this._price, formatNumber(sumAll) + ' синапсов');
	}
}
