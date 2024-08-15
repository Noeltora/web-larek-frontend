import { IEvents } from '../base/events';
import { Form } from '../common/Form';
import { ensureAllElements } from '../../utils/utils';
import { IPaymentOption } from '../../types/components/ProductAPI';

export class Order extends Form<IPaymentOption> {
	protected _buttonAll: HTMLButtonElement[];

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._buttonAll = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);

		this._buttonAll.forEach((item) => {
			item.addEventListener('mousedown', () => {
				this.paymentSelection = item.name;
				events.emit('payment:change', item);
			});
		});
	}

	// Сеттер для выбора способа оплаты
	set paymentSelection(paymentMethod: string) {
		this._buttonAll.forEach((button) => {
			this.toggleClass(
				button,
				'button_alt-active',
				button.name === paymentMethod
			);
		});
	}

	// Сеттер для установки адреса
	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
