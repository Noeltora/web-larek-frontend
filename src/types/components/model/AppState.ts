import { IContacts, IProductItem, IOrderResult } from "./ApiProduct";

export enum IAppStateModals {
    basket,
    contacts,
    success
};

// Интерфейс типа данных для модели данных - состояние приложения
export interface IAppState {
    products?: IProductItem[];
    selectedProduct?: IProductItem;
    selectedProductDescription: string;
    openedModal: IAppStateModals | null;
    basketProduct?: IProductItem[];
    basketTotal: number;
    contacts: IContacts;
    isOrderReady: boolean;
    validationError: string | null;

    loadProduct(): Promise<void>;
    openModal(modal: IAppStateModals): void;
    selectProducts(id: string): void;
    fillContacts(contacts: Partial<IContacts>): void;
    orderProducts(): Promise<IOrderResult[]>;
}

// В случае изменения модели
export enum IAppStateChanges {
    products,
    modal,
    selectedProduct,
    basket,
    order
};

export interface IAppStateSettings {
    currency: string; //Вывод интерфейса (валюта)
    storageKey: string; //Сохранение при перезагрузки страницы
    onChange: (changed: IAppStateChanges) => void;// Подписка на события (изменения)
}
