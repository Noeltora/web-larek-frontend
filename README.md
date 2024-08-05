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

Интерфейс для описания данных заказа

```
interface IOrder extends IContacts {
    items: ProductItem[];
}
```

Интерфейс для реализации API клиента

```
interface IProductAPI {
    getProducts: () => Promise<ProductItem[]>; - Получение списка товаров
    orderProducts: (order: Order) => Promise<OrderResult[]>; - Покупка товаров
}
```

Интерфейс типов данных для модели данных - состояния приложения

```
interface IAppState {
    products?: ProductItem[]; - Список товаров
    selectedProduct?: ProductItem; - Выбранный товар
    selectedProductDescription: string; - Описание выбранного продукта
    openedModal: AppStateModals | null; - Открытое модальное окно
    basketProduct?: ProductItem[]; - Товары, используемые в корзине
    basketTotal: number; - Сумма заказа на основе имеющегося товара в корзине
    contacts: Contacts; - Контакты, полученные из формы
    isOrderReady: boolean; - Валидность заказа
    validationError: string | null; - Состояние ошибки при валидации формы

    loadProduct(): Promise<void>; - Загрузка продукта
    openModal(modal: AppStateModals): void; - Открытие модального окна
    selectProducts(id: string): void; - Выбор товара
    fillContacts(contacts: Partial<Contacts>): void; - Заполнение контактов
    orderProducts(): Promise<OrderResult[]>; - Покупка товаров
}
```

Интерфейс для настроек в случае изменений

```
interface IAppStateSettings {
    currency: string; - Вывод интерфейса (валюта)
    storageKey: string; - Сохранение при перезагрузки страницы
    onChange: (changed: AppStateChanges) => void; - Подписка на события (изменения)
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

### Класс Component<T> -
Абстрактный класс дженерик содержащий методы для работы с компонентами отображения, принимает в конструкторе `container` типа `HTMLElement`.

Основные методы реализуемые классом:

`toggleClass()` - переключение класса элемента;
`setDisabled()` - смена статуса блокировки;
`setHidden()` - скрыть элемент;
`setVisible()` - сделать элемент видимым;
`setImage()` - установить изображение с альт текстом;
`render()` - метод рендеринга элемента;

### Класс Model -
Абстрактный класс для управления данными и событиями в приложении.

Методы класса:

`emitChanges()` - генерирует событие с указанным именем.

### Класс ProductApi -
Расширяет базовый класс Api и предназначен для работы с API товаров.

Свойства класса:

В конструкторе принимает Api поля `baseurl` и `options`
Принимает и сохраняет входящий запрос

Методы класса:

`getCatalog()` - получает список всех продуктов из каталога.
`postOrder()` - отправляет данные о заказе на сервер.

### Класс Card -
Расширяет базовый класс `Component` и отвечает за хранение и логику работы с данными товара. Конструктор принимает брокер событий.

Свойства класса:

`_category` - категория товара;
`_title` - название товара;
`_image` - изображение товара;
`_price` - цена продукта;
`_description` - описание товара;

Методы класса:

`set category()` - устанавливает категорию товара;
`set title(`) - устанавливает название товара;
`set image()` - устанавливает изображение товара;
`set price()` - устанавливает цену товара;
`set description()` - устанавливает описание товара.

### Класс AppState -
Расширяет базовый класс `Model` по интерфейсу `IAppState`.

Методы класса:

`addToBasket()` - довавить товар в корзину;
`deleteFromBasket()` - удалить товар из корзины;
`clearBasket()` - очистить корзину;
`getBasketCount()` - получить количество товаров в корзине;
`getTotalBasket()` - получить общую сумму товаров в корзине;
`clearOrder()` - очистить форму заказа после совершения покупки;
`setItems()` - добавление ID товарам в корзине;
`resetSelected()` - обновление полей заказа после покупки;
`validationContacts()` - валидация формы контактов;
`validationOrder()` - валидация формы заказа;
`setOrderField()` - заполнение полей формы заказов.

### Класс Page -
Расширяет базовый класс `Component` и предназначен для управления основными элементами страницы приложения.

Свойства класса:

`_counter` - счетчик товаров в корзине;
`_catalog` - каталог товаров;
`_wrapper` - обертка страницы;
`_basket` - кпнока корзины.

Методы класса:

`set counter()` - устанавливает значение счетчика товаров в корзине;
`set catalog()` - устанавливает элементы каталога товаров.

### Класс Modal -
Расширяет базовый класс `Component` и предназначен для управления модальными окнами в приложении.

Свойства класса:

`_closeButton` - кнопка закрытия модального окна;
`_content` - содержимое модального окна.

Методы класса:

`set content()` - устанавливает содержимое модального окна;
`open()` - открывает модальное окно;
`close()` - закрывает модальное окно;
`render()` - рендерит данные модального окна и открывает его.

### Класс Basket -
Расширяет базовый класс `Component` и предназначен для управления корзиной в приложении.

Свойства класса:

`_list` - список товаров в корзине;
`_price` - общая цена товаров в корзине;
`_button` - кнопка для оформления заказа.

Методы класса:

`set list()` - устанавливает элементы списка товаров в корзине;
`set selected()` - устанавливает состояние кнопки оформления заказа;
`set price()` - устанавливает общую цену товаров в корзине.

### Класс Payment - 
Расширяет класс `Form` и предназначен для управления формой данных об оплате в приложении.

Свойства класса:

`_buttons` - разметка формы кнопок выбора способа оплаты.

Методы класса:

`set payment()` - установка на кнопку класса, которая её активирует;
`set address()` - устанавливает значения поля адреса доставки в форме.

### Класс Contact -
Расширяет класс `Form` и предназначен для управления формой данных пользователя в приложении.

Методы класса:

`set email()` - устанавливает значение поля электронной почты в форме;
`set phone()` - устанавливает значение поле номера телефона в форме.

### Класс Success -
Расширяет базовый класс `Component` и предназначен для отображения модального окна успешного заказа в приложении.

Свойства класса:

`_close` - кнопка закрытия уведомления об успешном заказе;
`_totalPrice` - общая цена заказа.

Методы класса:

`set totalPrice()` - устанаваливает текстовое содержимое элемента общей цены заказа.

Список событий:

`items: changed` - вызываеться при изменении списка товаров;
`card: selected` - вызываеться при нажатии на карточку для открытия модального окна с описанием товара;
`card: addToBasket` - вызываеться при нажатии на кнопку добавления товара в корзину и обновляет счётчик корзины и делает кнопку добавления данного товара неактиной;
`basket: open` - вызываеться при нажатии на корзину и открывает модальное окно с товарами в ней;
`basket: delete` - вызывается при удалении товара из корзины, обновляет счётчик корзины, меняет статус кнопки на активный, обновляет сумму заказа в корзине;
`basket: order` - вызывается при нажатии на кнопку оформить в корзине и открывает модалку с заполнением адреса и способа оплаты;
`order: submit` - вызывается при нажатии кнопки подтверждения после заполнения адреса и способа оплаты и октрывает модальное окно с контактными данными;
`contacts: submit` - вызываеться при нажатии кнопки подтверждения после заполнения email и телефона;
`orderFormErrors: changed` - вызываеться при вводе данных в форме заказа и возвращает ошибки формы;
`contactsFormErrors:` changed - вызываеться при вводе данных в форме контактных даных и возвращает ошибки формы;
`order:success` - вызывается при успешном заказе и открывает модальное окно с сообщением об успешной оплате;
`modal: close` - вызывается при клике на крестик модального окна или за пределами модалки.