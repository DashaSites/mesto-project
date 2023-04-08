export default class Popup {
    constructor(popupSelector) {
        this._popupElement = document.querySelector(popupSelector);
    }

    open() {
        this._popupElement.classList.add('popup_opened');

        document.addEventListener('keydown', (event) => {
            this._handleEscClose(event);
        });
    }

    close() {
        this._popupElement.classList.remove('popup_opened');

        document.removeEventListener('keydown', (event) => {
            this._handleEscClose(event);
        });
    }

    _handleEscClose(event) {
        if (event.key === 'Escape') {
            this.close();
        }
    }

    setEventListeners() {
        this._popupElement.addEventListener('mousedown', (event) => {
            // Закрытие любого попапа по клику на оверлей
            if (event.target.classList.contains('popup_opened')) {
                this.close();
            }

            // Закрытие любого попапа по клику на крестик
            if (event.target.classList.contains('popup__close-button')) {
                this.close();
            }
        });
    }
}