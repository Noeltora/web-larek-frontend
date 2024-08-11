# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Типы данных
Интерфейс для описания типа данных товара, полученного из API

```
interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
```

Интерфейс для описания данных контактов

```
interface IContacts {
    email: string;
    phone: string;
}
```

Интерфейс для описания данных способа оплаты и адреса доставки

```
interface IOrder extends IPaymentOption {
    payment: string;
	address: string;
}
```

Интерфейс для описания данных заказа

```
interface IOrder extends IContacts, IPaymentOption {
	items: string[];
	total: number;
}
```

Интерфейс типов данных для модели объектов в корзине

```
interface IBasketModel {
	basketProducts: IProductItem[];

	getCounter: () => number;
	getSumAllProducts: () => number;
	setSelectedСard(data: IProductItem): void;
	deleteCardToBasket(item: IProductItem): void;
	clearBasketProducts(): void;
}
```

Интерфейс типов данных для карточек на главной странице

```
interface IDataModel {
	productCards: IProductItem[];
	selectedСard: IProductItem;

	setPreview(item: IProductItem): void;
}
```

Интерфейс типов данных для форм отправки данных

```
interface IFormModel {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];

	setOrderAddress(field: string, value: string): void;
	validateOrder(): boolean;
	setOrderData(field: string, value: string): void;
	validateContacts(): boolean;
	getOrderLot(): object;
}
```

## Описание проекта
### Класс API  -
('/src/components/base/api.ts') - содержит логику отправки запросов. В конструктор передается адрес сервера и объект с `headers` запроса.

Используемые методы:

```
    get(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse);
    }
```

Метод `get()` - возвращает промис с объектом, который ответил сервер.

```
    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse);
    }
```

Метод `post()` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные.

### Класс EventEmitter -
('./src/components/base/events.ts/') - реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события.

Используемые методы:

```
    on<T extends object>(eventName: EventName, callback: (event: T) => void) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)?.add(callback);
    }
```

Метод `on()` - устанавливает обработчик события.

```
    off(eventName: EventName, callback: Subscriber) {
        if (this._events.has(eventName)) {
            this._events.get(eventName)!.delete(callback);
            if (this._events.get(eventName)?.size === 0) {
                this._events.delete(eventName);
            }
        }
    }
```

Метод `off()` - снимает обработчик события.

```
    emit<T extends object>(eventName: string, data?: T) {
        this._events.forEach((subscribers, name) => {
            if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                subscribers.forEach(callback => callback(data));
            }
        });
    }
```

Метод `emit()` - инициализирует событие с данными.

```
    onAll(callback: (event: EmitterEvent) => void) {
        this.on("*", callback);
    }
```

Метод `onAll()` - слушает все события.

```
    offAll() {
        this._events = new Map<string, Set<Subscriber>>();
    }
```

Метод `ofAll()` - сбрасывает все обработчики.

```
    trigger<T extends object>(eventName: string, context?: Partial<T>) {
        return (event: object = {}) => {
            this.emit(eventName, {
                ...(event || {}),
                ...(context || {})
            });
        };
    }
```

Метод `trigger()` - делает коллбек триггер, генерирующий событие при вызове.

### Класс BasketModel -
Реализует интерфейс IBasketModel и отвечает за работу с данными, полученными от пользователя при работе с корзиной.

Методы класса:

`getCounter()` - возвращает кол-во товаров в корзине;
`getSumAllProducts()` - считает и возвращает сумму всех товаров в корзине;
`setSelectedСard()` - добовляет товар в корзину;
`deleteCardToBasket()` - удаляет товар из корзины;
`clearBasketProducts()` - очищает массив товаров из корзины;

### Класс DataModel -
Реализует интерфейс IDataModel и отвечает за работу с данными, полученными с сервера.

Методы класса:

`set productCards()` - забор данных карточки;
`get productCards()` - получение данных карточки;
`setPreview()` - получение данных карточки, который открыл пользователь.

### Класс FormModel -
Реализует интерфейс IFormModel и отвечает за работу с данными, полученными от пользователя в формах.

Методы класса:

`setOrderAddress()` - принимаем данные адреса пользователя и электронной почты;
`validateOrder()` - валидация введенных данных адреса пользователя и электронной почты;
`setOrderData()` - принимаем номер телефона и почту пользователя.
`validateContacts()` - валидация данных номера телефона и почты пользователя.

### Класс ProductApi -
Расширяет базовый класс Api и предназначен для работы с API товаров.

Свойства класса:

В конструкторе принимает Api поля `cdn`, `baseurl` и `options`
Принимает и сохраняет входящий запрос

Методы класса:

`getCatalog()` - получает список всех продуктов из каталога.
`postOrder()` - отправляет данные о заказе на сервер.

### Класс Card -
Реализует интерфейс ICard и отвечает за хранение и логику работы с данными товара. Конструктор принимает брокер событий.

Свойства класса:

`_cardElement` - элемент карточки;
`_category` - категория товара;
`_title` - название товара;
`_image` - изображение товара;
`_price` - цена продукта;
`_description` - тип товара;

Методы класса:

`set category()` - устанавливает категорию товара;
`set text()` - устанавливает название товара;
`set price()` - устанавливает цену товара;

### Класс Basket -
Реализует интерфейс IBasket. Позволяет управлять отображением корзины.

Методы класса:

`renderHeaderBasketCounter()` - сохраняет товар в корзине и учитывает его количество;
`renderSumAllProducts()` - сумма всех товаров в корзине.

### Класс BasketItem -
Реализует интерфейс IBasketItem. Позволяет управлять элементами в корзине.

Методы класса:

`set price()` - преобразует численное значение цены продукта в строчное.

### Класс CardPreview -
Реализует интерфейс ICard. Позволяет получить подробное описание карточек.

Методы класса:

`notSale()` - проверка на наличие цены продукта.

### Класс FormOrders - 
Реализует интерфейс IOrder. Позволяет управлять содержимым модального окна оплаты и принимает данные, введенные пользователем.

Свойства класса:

formOrder: HTMLFormElement;
buttonAll: HTMLButtonElement[];
paymentSelection: String;
formErrors: HTMLElement;

Методы класса:

`render` - визуализация формы оплаты заказа.

### Класс FormContacts -
Реализует интерфейс IContacts. Позволяет управлять отображением модального окна и принимает email и телефон.

Свойства класса:

formContacts: HTMLFormElement;
inputAll: HTMLInputElement[];
buttonSubmit: HTMLButtonElement;
formErrors: HTMLElement;

Методы класса:

`render` - визуализация формы оплаты заказа.

### Класс Success -
Позволяет отобразить совершенный заказ в модальном окне.

Свойства класса:

success: HTMLElement;
description: HTMLElement;
button: HTMLButtonElement;

Методы класса:

`render` - визуализация финальной формы оформления заказа.

### Основной файл index.ts -

Список событий:

`productCards:receive` - для отображения карточки на страницу;
`card: select`, `modalCard:open` - вызываеться при нажатии на карточку для открытия модального окна с описанием товара;
`card:addBasket` - вызываеться при нажатии на кнопку добавления товара в корзину и обновляет счётчик корзины и делает кнопку добавления данного товара неактиной;
`basket: open` - вызываеться при нажатии на корзину и открывает модальное окно с товарами в ней;
`basket:basketItemRemove` - вызывается при удалении товара из корзины, обновляет счётчик корзины, меняет статус кнопки на активный, обновляет сумму заказа в корзине;
`order:open` - открытие модального окна "способа оплаты" и "адреса доставки";
`order:changeAddress` - отслеживает изменения в полях ввода "адреса доставки";
`contacts:open` - открытие модального окна "Email" и "Телефон";
`contacts:changeInput` - отслеживание изменений в полях ввода "Email" и "Телефон";
`formErrors:change` - вызываеться при вводе данных в форме заказа и возвращает ошибки формы;
`formErrors:address` - валидация при вводе данных строки "address" и "payment";
`success:open` - вызывается при успешном заказе и открывает модальное окно с сообщением об успешной оплате;
`success:close` - вызывается при клике на крестик модального окна или за пределами модалки.