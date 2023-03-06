import { closePopupByEsc } from './modal.js';

// УТИЛИТАРНЫЕ ФУНКЦИИ, КОТОРЫЕ ИСПОЛЬЗУЮТСЯ В РАБОТЕ СРАЗУ НЕСКОЛЬКИХ ДРУГИХ ФУНКЦИЙ

// Функция открытия любого попапа (нужный попап передается сюда через аргумент)
const openPopup = (popup) => {
    popup.classList.add('popup_opened');

    document.addEventListener('keydown', closePopupByEsc);
}


// Функция закрытия любого попапа. Нужный попап передается сюда через аргумент
const closePopup = (popup) => {
    popup.classList.remove('popup_opened');

    document.removeEventListener('keydown', closePopupByEsc);
}


export { openPopup, closePopup };