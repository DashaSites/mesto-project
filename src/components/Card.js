export default class Card {
    constructor(cardData, currentUserId, handlerImageClick, api, templateSelector) {
        this._link = cardData.link;
        this._name = cardData.name;
        this._likes = cardData.likes;
        this._ownerId = cardData.owner._id; // id владельца карточки
        this._id = cardData._id; // id карточки

        this._currentUserId = currentUserId; // текущий пользователь
        this._handlerImageClick = handlerImageClick; // открытие попапа по клику на картинку
        this._api = api;
        this._templateSelector = templateSelector;
    }


    // Проверяю, лайкала ли я данную карточку 
    // (есть ли мой id в массиве лайкавших)
    _isLiked() {
        return Boolean(this._likes.find(user => user._id === this._currentUserId));
    }

    // Проверяю, моя ли это карточка
    _isOwner() { 
        return this._ownerId === this._currentUserId; 
    }

    // Создаю DOM-элемент-заготовку для карточки, чтобы его потом наполнить данными, а потом отрендерить в верстке
    _getTemplate() {
        const cardElement = document
        .querySelector(this._templateSelector)
        .content
        .querySelector('.element')
        .cloneNode(true);

        return cardElement;
    }

    // Публичный метод, возвращающий готовый (наполненный всем содержимым и работоспособный) элемент карточки:
    generateCard() {
        this._element = this._getTemplate();

        this._element.querySelector('.element__caption').textContent = this._name;
        const cardImage = this._element.querySelector('.element__image');
        cardImage.src = this._link;
        cardImage.alt = this._name;
        this._cardImage = cardImage;
        this._likeButton = this._element.querySelector('.element__like-button'); // сердечко данной карточки
        this._likeCounterElement = this._element.querySelector('.element__like-counter'); // элемент счетчика лайков
        this._deleteButton = this._element.querySelector('.element__delete-button'); // кнопка удаления данной карточки

        // Отобразим в счетчике текущее количество лайков карточки
        this._likeCounterElement.textContent = this._likes.length; 

        // Отобразим, лайкал ли карточку текущий пользователь
        if(this._isLiked()) {
            this._likeButton.classList.add('element__like-button_active');
        } else {
            this._likeButton.classList.remove('element__like-button_active');
        }

        if (!this._isOwner()) { // Если карточка не моя, то прячу на ней кнопку удаления
            this._deleteButton.classList.add('element__delete-button_hidden');
       }

        // Вызываю обработчики:
        this._setEventListeners();

        return this._element;
    }


    // Объединяю обработчики всех кликов по карточке в общей фукнкции
    _setEventListeners() {
        
        // 1) Удаление карточки
        if (!this._isOwner()) { // Если карточка не моя, то прячем на ней кнопку удаления
            this._deleteButton.classList.add('element__delete-button_hidden');
        } else { // А если моя, то на кнопку удаления карточки навешивается слушатель кликов с колбэком для удаления карточки
            this._deleteButton.addEventListener('click', (event) => {
                this._api.deleteCardOnServer(this._id)
                .then(() => {
                    event.target.closest('.element').remove();
                })
                .catch((err) => console.log(err));
            });
        } 

        // 2) Слушатель кликов по лайку:
        this._likeButton.addEventListener('click', (event) => {
            if (event.target.classList.contains('element__like-button_active')) { // Если карточка уже была лайкнута
                this._api.unlikeCard(this._id)
                .then((res) => { // Деактивирую дайк
                    event.target.classList.remove('element__like-button_active');
                    this._likeCounterElement.textContent = res.likes.length;
                })
                .catch((err) => console.log(err));
    
            } else { // Если карточка раньше не была лайкнута
                this._api.likeCard(this._id) 
                .then((res) => { // Активирую лайк
                    event.target.classList.add('element__like-button_active');
                    this._likeCounterElement.textContent = res.likes.length;
                })
                .catch((err) => console.log(err));
            }
        })

        // 3) Слушатель клика по картинке c колбэком handlerImageClick
        this._cardImage.addEventListener('click', (event) => {
            this._handlerImageClick(this._link, this._name);
        })
    }
}

















/*
ТАК CARD РАБОТАЛ ДО ООП:

import { imagePopup, popupImage, popupCaption } from './constants.js'
import { openPopup } from './utils.js'

//import { api } from '../index.js';

// ФУНКЦИИ ДЛЯ РАБОТЫ С КАРТОЧКАМИ

// Ставим/убираем лайк 
const toggleLike = (event) => {
    event.target.classList.toggle('element__like-button_active');
}


// Обработчик клика по картинке (чтобы открыть попап-3)
const handlerImageClick = ({link, name}) => { 
    openPopup(imagePopup);
  
    popupImage.src = link;
    popupImage.alt = name;
    popupCaption.textContent = name;
}


// Создаем карточку
const createCard = (link, name, likes, ownerId, _id, currentUserId) => {
    const cardTemplate = document.querySelector('.element-template').content;
    const cardElement = cardTemplate.querySelector('.element').cloneNode(true);
    const cardImage = cardElement.querySelector('.element__image');
    const deleteButton = cardElement.querySelector('.element__delete-button'); // Кнопка удаления данной карточки
    
    cardImage.src = link;
    cardImage.alt = name;
    cardElement.querySelector('.element__caption').textContent = name;

    const likeButton = cardElement.querySelector('.element__like-button'); // Сердечко данной карточки
    const likeCounterElement = cardElement.querySelector('.element__like-counter'); // Элемент счетчика лайков
    likeCounterElement.textContent = likes.length.toString(); // Записала длину массива лайков данной карточки в счетчик ее лайков в DOM
    
    // Проверяю, есть ли уже мой лайк в массиве лайков карточки. Если да, то сердечко сразу при загрузке будет черное
    const isLiked = Boolean(likes.find(user => user._id === currentUserId));
    if (isLiked) {
        likeButton.classList.add('element__like-button_active');
    } 
    
    // !!! Проверяю, моя ли это карточка
    const isOwner = ownerId === currentUserId; 
    if (!isOwner) { // Если карточка не моя, то прячем на ней кнопку удаления
        deleteButton.classList.add('element__delete-button_hidden');
    } else { // А если моя, то на кнопку удаления карточки навешивается слушатель кликов с колбэком для удаления карточки
        deleteButton.addEventListener('click', (event) => {
            api.deleteCardOnServer(_id)
            .then(() => {
                event.target.closest('.element').remove();
            })
            .catch((err) => console.log(err));
        });
    }

    // !!! Слушатель кликов по сердечку
    likeButton.addEventListener('click', (event) => {
        if (event.target.classList.contains('element__like-button_active')) { // Если карточка уже была лайкнута
            api.unlikeCard(_id)
            .then((res) => {
                event.target.classList.remove('element__like-button_active');
                likeCounterElement.textContent = res.likes.length;
            })
            .catch((err) => console.log(err));

        } else { // Если карточка не была лайкнута
            api.likeCard(_id) 
            .then((res) => {
                event.target.classList.add('element__like-button_active');
                likeCounterElement.textContent = res.likes.length;
            })
            .catch((err) => console.log(err));
        }
    })
    
    // !!! Слушатель кликов по картинке для открытия попапа с большой картинкой
    //cardImage.addEventListener('click', handlerImageClick);
    cardImage.addEventListener('click', () => handlerImageClick({link, name}));
  
    return cardElement;
}
  
    */  
//export { handlerImageClick }; 
