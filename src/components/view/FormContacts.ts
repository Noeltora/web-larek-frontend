import { IEvents } from '../base/events';
import { Form } from '../common/Form';
import { IContacts } from '../../types/components/ProductAPI';

export class ContactsForm extends Form<IContacts> {
	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
	}

	// Сеттер для установки значения при вводе телефона
	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	// Сеттер для установки значения при вводе email
	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
