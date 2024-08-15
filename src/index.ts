import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ProductApi } from './components/view/ProductAPI';
import { Card, CardView } from './components/view/Card';
import { IOrder, IProductItem, IContacts } from './types/components/ProductAPI';
import { Modal } from './components/common/Modal';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Basket } from './components/view/Basket';
import { Order } from './components/view/FormOrder';
import { Contact } from './components/view/FormContacts';
import { Success } from './components/view/Success';
import { AppState } from './components/model/AppState';
import { Page } from './components/view/Page';

const events = new EventEmitter();
const apiModel = new ProductApi(CDN_URL, API_URL);

const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(
	cloneTemplate<HTMLTemplateElement>(basketTemplate),
	events
);
const order = new Order(cloneTemplate<HTMLFormElement>(orderTemplate), events);
const contacts = new Contact(cloneTemplate(contactsTemplate), events);

//Получаем данные с сервера
apiModel
	.getCatalog()
	.then(appData.setItems.bind(appData))
	.catch((err) => {
		console.error(err);
	});

// В случае изменений
events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// Показать превью карточки
events.on('card:select', (item: IProductItem) => {
	const card = new CardView(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('card:add', item),
	});
	modal.render({
		content: card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
			description: item.description,
		}),
	});

	if (item.price === null) {
		card.setDisabled(card.buttonElement, true);
	} else if (appData.containsProduct(item)) {
		card.setDisabled(card.buttonElement, true);
	}
});

// Добавление карточки товара в корзину
events.on('card:add', (item: IProductItem) => {
	appData.addOrderID(item);
	appData.addToBasket(item);
	page.counter = appData.basket.length;
	modal.close();
});

// Открытие модального окна корзины
events.on('basket:open', () => {
	basket.total = appData.getTotalBasket();
	basket.setDisabled(basket.button, appData.isEmpty);
	basket.items = appData.basket.map((item, index) => {
		const card = new CardView(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:remove', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	modal.render({
		content: basket.render(),
	});
});

// Удаление карточки товара из корзины
events.on('card:remove', (item: IProductItem) => {
	appData.deleteFromBasket(item);
	appData.removeOrderID(item);
	page.counter = appData.basket.length;
	basket.setDisabled(basket.button, appData.isEmpty);
	basket.total = appData.getTotalBasket();
	basket.items = appData.basket.map((item, index) => {
		const card = new CardView(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:remove', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	modal.render({
		content: basket.render(),
	});
});

// Открытие модального окна формы заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			payment: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открытие модального окна контактов
events.on('order:submit', () => {
	appData.order.total = appData.getTotalBasket();
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Реакция на изменении способа оплаты в форме заказа.
events.on('payment:change', (item: HTMLButtonElement) => {
	appData.order.payment = item.name;
	appData.validateAdress();
});

// Валидация данных строки "address" и "payment"
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { address, payment } = errors;
	order.valid = !address && !payment;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

// Отслеживаем изменение одного из полей
events.on(
	/^order\..*:change/,
	(data: { field: keyof IContacts; value: string }) => {
		appData.setOrderAddress(data.field, data.value);
	}
);

// Отслеживаем изменение в полях ввода "Контакты"
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContacts; value: string }) => {
		appData.setOrderData(data.field, data.value);
	}
);

// Валидация данных строки "Email" и "Телефон"
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on('contacts:submit', () => {
	apiModel
		.postOrder(appData.order)
		.then((res) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			modal.render({
				content: success.render({
					total: res.total,
				}),
			});

			appData.clearBasket();
			page.counter = 0;
		})
		.catch((err) => {
			console.error(err);
		});
});

// Блокировка прокрутки при открытии модального окна
events.on('modal:open', () => {
	page.locked = true;
});

// Снятие блокировки прокрутки при открытии модального окна
events.on('modal:close', () => {
	page.locked = false;
});
