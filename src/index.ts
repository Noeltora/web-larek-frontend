import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ProductApi } from './components/model/ProductAPI';
import { DataModel } from './components/model/DataModel';
import { Card } from './components/view/Card';
import { CardPreview } from './components/view/CardPreview';
import { IOrder, IProductItem } from './types/components/ProductAPI';
import { Modal } from './components/view/Modal';
import { ensureElement } from './utils/utils';
import { BasketModel } from './components/model/BasketModel';
import { Basket } from './components/view/Basket';
import { BasketItem } from './components/view/BasketItem';
import { FormModel } from './components/model/FormModel';
import { Order } from './components/view/FormOrder';
import { Contacts } from './components/view/FormContacts';
import { Success } from './components/view/Success';

const cardCatalogTemplate = document.querySelector(
	'#card-catalog'
) as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector(
	'#card-preview'
) as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector(
	'#card-basket'
) as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
	'#contacts'
) as HTMLTemplateElement;
const successTemplate = document.querySelector(
	'#success'
) as HTMLTemplateElement;

const apiModel = new ProductApi(CDN_URL, API_URL);
const events = new EventEmitter();
const dataModel = new DataModel(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(basketTemplate, events);
const basketModel = new BasketModel();
const formModel = new FormModel(events);
const order = new Order(orderTemplate, events);
const contacts = new Contacts(contactsTemplate, events);

//Получаем данные с сервера
apiModel
	.getCatalog()
	.then(function (data: IProductItem[]) {
		dataModel.productCards = data;
	})
	.catch((error) => console.log(error));

// Отображения карточек товара на странице
events.on('productCards:receive', () => {
	dataModel.productCards.forEach((item) => {
		const card = new Card(cardCatalogTemplate, events, {
			onClick: () => events.emit('card:select', item),
		});
		ensureElement<HTMLElement>('.gallery').append(card.render(item));
	});
});

// Показать превью карточки
events.on('card:select', (item: IProductItem) => {
	dataModel.setPreview(item);
});

events.on('modalCard:open', (item: IProductItem) => {
	const cardPreview = new CardPreview(cardPreviewTemplate, events);
	modal.content = cardPreview.render(item);
	modal.render();
});

// Добавление карточки товара в корзину
events.on('card:addBasket', () => {
	basketModel.setSelectedСard(dataModel.selectedСard);
	basket.renderHeaderBasketCounter(basketModel.getCounter());
	modal.close();
});

// Открытие модального окна корзины
events.on('basket:open', () => {
	basket.renderSumAllProducts(basketModel.getSumAllProducts());
	let i = 0;
	basket.items = basketModel.basketProducts.map((item) => {
		const basketItem = new BasketItem(cardBasketTemplate, events, {
			onClick: () => events.emit('basket:basketItemRemove', item),
		});
		i = i + 1;
		return basketItem.render(item, i);
	});
	modal.content = basket.render();
	modal.render();
});

// Удаление карточки товара из корзины
events.on('basket:basketItemRemove', (item: IProductItem) => {
	basketModel.deleteCardToBasket(item);
	basket.renderHeaderBasketCounter(basketModel.getCounter());
	basket.renderSumAllProducts(basketModel.getSumAllProducts());
	let i = 0;
	basket.items = basketModel.basketProducts.map((item) => {
		const basketItem = new BasketItem(cardBasketTemplate, events, {
			onClick: () => events.emit('basket:basketItemRemove', item),
		});
		i = i + 1;
		return basketItem.render(item, i);
	});
});

// Открытие модального окна "способа оплаты" и "адреса доставки"
events.on('order:open', () => {
	modal.content = order.render();
	modal.render();
	formModel.items = basketModel.basketProducts.map((item) => item.id);
});

events.on('order:paymentSelection', (button: HTMLButtonElement) => {
	formModel.payment = button.name;
});

// Отслеживаем изменение в полях ввода "адреса доставки"
events.on(`order:changeAddress`, (data: { field: string; value: string }) => {
	formModel.setOrderAddress(data.field, data.value);
});

// Валидация данных строки "address" и "payment"
events.on('formErrors:address', (errors: Partial<IOrder>) => {
	const { address, payment } = errors;
	order.valid = !address && !payment;
	order.formErrors.textContent = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

// Открытие модального окна "Email" и "Телефон"
events.on('contacts:open', () => {
	formModel.total = basketModel.getSumAllProducts();
	modal.content = contacts.render();
	modal.render();
});

// Отслеживаем изменение в полях ввода "Email" и "Телефон"
events.on(`contacts:changeInput`, (data: { field: string; value: string }) => {
	formModel.setOrderData(data.field, data.value);
});

// Валидация данных строки "Email" и "Телефон"
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.formErrors.textContent = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Открытие модального окна готовности заказа
events.on('success:open', () => {
	apiModel
		.postOrder(formModel.getOrderLot())
		.then((data) => {
			console.log(data);
			const success = new Success(successTemplate, events);
			modal.content = success.render(basketModel.getSumAllProducts());
			basketModel.clearBasketProducts();
			basket.renderHeaderBasketCounter(basketModel.getCounter());
			modal.render();
		})
		.catch((error) => console.log(error));
});

events.on('success:close', () => modal.close());

events.on('modal:open', () => {
	modal.locked = true;
});

events.on('modal:close', () => {
	modal.locked = false;
});
