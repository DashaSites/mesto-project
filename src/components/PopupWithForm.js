import Popup from './Popup.js';
export default class PopupWithForm extends Popup {
    constructor(popupSelector, handleFormSubmit) {
        super(popupSelector); // Вызываю конструктор попапа из класса родителя
        this._handleFormSubmit = handleFormSubmit;

        this._form = this._popupElement.querySelector('.popup__form');
        this._inputs = this._form.querySelectorAll('.popup__form-input-item');
        this._submitButton = this._form.querySelector('.popup__submit-button');
        //this._submitButtonText = this._submitButton.textContent;
    }

    _getInputValues() { // Cоздаю объект и собираю в него данные из всех полей формы
        this._inputsCollection = {};

        this._inputs.forEach((input) => {
            this._inputsCollection[input.name] = input.value;
        });

        return this._inputsCollection;
    }

    //renderLoading(isLoading, loadingText='Сохранение...')

    setEventListeners() { 
        super.setEventListeners();
        // в дополнение к родительскому методу, добавляю сюда обработчик сабмита формы
        this._form.addEventListener('submit', (event) => {
            event.preventDefault();
            //this._submitButton.textContent = 'Сохранение...';
            this._handleFormSubmit(this._inputsCollection);
        });
    }

    close() { 
        //this._submitButton.textContent = 'Сохранить';
        super.close();
        // в дополнение к вызову родительского метода, форма сбрасывается  
        this._form.reset();
    }
}