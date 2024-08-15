import { Model } from '../base/Model';
import {
	FormErrors,
	IProductItem,
	IOrder,
	IContacts,
} from '../../types/components/ProductAPI';

export interface IAppState {
	catalog: IProductItem[];
	basket: string[];
	order: IOrder;
}

export class AppState extends Model<IAppState> {
	basket: IProductItem[] = [];
	catalog: IProductItem[];
	formErrors: FormErrors = {};
	order: IOrder = {
		total: 0,
		items: [],
		payment: '',
		address: '',
		email: '',
		phone: '',
	};

	// Установка каталога товаров
	setItems(data: IProductItem[]) {
		this.catalog = data;
		this.emitChanges('items:changed');
	}

	// Добавить ID товара в корзину
	addOrderID(item: IProductItem) {
		this.order.items.push(item.id);
	}

	// Удалить ID товара из корзины
	removeOrderID(item: IProductItem) {
		const index = this.order.items.indexOf(item.id);
		if (index >= 0) {
			this.order.items.splice(index, 1);
		}
	}

	// Принимаем значение строки "address"
	setOrderAddress(field: keyof IContacts, value: string) {
		this.order[field] = value;

		if (this.validateAdress()) {
			this.events.emit('order:ready', this.order);
		}
	}

	// Валидация данных строки "address" и способа оплаты
	validateAdress() {
		const regexp = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/;
		const errors: typeof this.formErrors = {};

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		} else if (!regexp.test(this.order.address)) {
			errors.address = 'Укажите настоящий адрес';
		} else if (!this.order.payment) {
			errors.payment = 'Выберите способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	// Принимаем значение данных строк "Email" и "Телефон"
	setOrderData(field: keyof IContacts, value: string) {
		this.order[field] = value;

		if (this.validateEmail()) {
			this.events.emit('order:ready', this.order);
		}
	}

	// Валидация данных строк "Email" и "Телефон"
	validateEmail() {
		const regexpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
		const regexpPhone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		} else if (!regexpEmail.test(this.order.email)) {
			errors.email = 'Некорректный адрес электронной почты';
		}

		if (this.order.phone.startsWith('8')) {
			this.order.phone = '+7' + this.order.phone.slice(1);
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!regexpPhone.test(this.order.phone)) {
			errors.phone = 'Некорректный формат номера телефона';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	// Есть ли товар в корзине?
	containsProduct(item: IProductItem) {
		return this.basket.includes(item);
	}

	// Сумма товаров в корзине
	getTotalBasket() {
		return this.order.items.reduce(
			(firstItem, nextItem) =>
				firstItem +
				this.catalog.find((targetItem) => targetItem.id === nextItem).price,
			0
		);
	}

	// Добавить в корзину
	addToBasket(data: IProductItem) {
		this.basket.push(data);
	}

	// Удалить товар из корзины
	deleteFromBasket(item: IProductItem) {
		const index = this.basket.indexOf(item);
		if (index >= 0) {
			this.basket.splice(index, 1);
		}
	}

	// Очистить корзину
	clearBasket() {
		this.basket = [];
		this.order.items = [];
	}

	get isEmpty(): boolean {
		return this.basket.length === 0;
	}
}
