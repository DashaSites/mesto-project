export default class Popup {
    constructor(popupSelector) {
        this._popupElement = document.querySelector(popupSelector);
    }

    _handleEscClose(event) {
        if (event.key === 'Escape') {
            this._close(document.querySelector('.popup_opened'));
        }
    }

    open() {
        this._popupElement.classList.add('popup_opened');

        document.addEventListener('keydown', (event) => {
            this._handleEscClose(this._popupElement);
        });
    }

    close() {
        this._popupElement.classList.remove('popup_opened');

        document.removeEventListener('keydown', (event) => {
            this._handleEscClose(this._popupElement);
        });
    }

    setEventListeners() {
        this._popupElement.addEventListener('mousedown', (event) => {
            // Закрытие любого попапа по клику на оверлей
            if (event.target.classList.contains('popup_opened')) {
                this._close(this._popupElement);
            }

            // Закрытие любого попапа по клику на крестик
            if (event.target.classList.contains('popup__close-button')) {
                this._close(this._popupElement);
            }
        });
    }
}