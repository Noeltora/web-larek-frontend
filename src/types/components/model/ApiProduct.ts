// Описание API

// Типы данных товара полученного из API
export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// Контакты
export interface IContacts {
    email: string;
    phone: string;
}

// Заказ
export interface IOrder extends IContacts {
    items: IProductItem[];
}

export interface IOrderResult extends IOrder {
	id: string;
}

// Интерфейс для реализации API клиента
export interface IProductAPI {
    getProducts: () => Promise<IProductItem[]>; // Получение списка товаров
    orderProducts: (order: IOrder) => Promise<IOrderResult[]>; // Покупка товаров
}
