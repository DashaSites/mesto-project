import Popup from './Popup.js';
export default class PopupWithImage extends Popup {
    constructor(popupSelector) {
        super(popupSelector); // Вызываю конструктор попапа-родителя
        this._popupImage = this._popupElement.querySelector('.popup__image');
        this._popupCaption = this._popupElement.querySelector('.popup__caption');
    }

    open(link, name) {
        // 1) добавляю к функциональности родительского класса новую функциональность:
        // в попап вставляю картинку с изображением из карточки и подписью из карточки

        this._link = link;
        this._name = name;

        this._popupImage.src = this._link;
        this._popupImage.alt = this._name;
        this._popupCaption.textContent = this._name;

        super.open(); // 2) вызываю родительский метод
    }
}