

/*
export default class Card {
    constructor({ cardData, handlerImageClick, toggleLike, deleteCardOnServer }, currentUserId, cardSelector) {
        this._link = cardData.link;
        this._name = cardData.name;
        this._likes = cardData.likes;
        this._ownerId = cardData.ownerId;
        this._id = cardData._id;

        this._currentUserId = currentUserId;
        
        this._cardSelector = cardSelector;

        this._handlerImageClick = handlerImageClick;
        this._toggleLike = toggleLike;
        this._deleteCardOnServer = deleteCardOnServer;
    }

    // Создаю DOM-элемент-заготовку для карточки, чтобы его потом наполнить данными, а потом отрендерить в верстке
    _getTemplate() {
        const cardElement = document
        .querySelector('.element-template')
        .content
        .querySelector('.element')
        .cloneNode(true);

        return cardElement;
    }

    // Возвращаю элемент карточки, наполненный всем содержимым:
    getFilledElement() {
        this._element = this._getTemplate();

        this._element.querySelector('.element__caption').textContent = this._name;
        const cardImage = this._element.querySelector('.element__image');
        cardImage.src = this._link;
        cardImage.alt = this._name;

        // Здесь же вызываю обработчики:
        this._setEventListeners();

        return this._element;
    }

    // Объединяю обработчики кликов по карточке в общей фукнкции
    _setEventListeners() {
        // 1 - Слушатель кликов по урне и условная конструкция с удалением 
        // 2 - Слушатель кликов по сердечку -> функция-тогл лайка
        // 3 - Слушатель клика по картинке -> колбэк handlerImageClick
    }
}

*/





import { renderInitialCards, imagePopup, popupImage, popupCaption } from './constants.js'
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
    
    // !!! Проверяю, есть ли уже мой лайк в массиве лайков карточки. Если да, то сердечко сразу при загрузке будет черное
    const isLiked = Boolean(likes.find(user => user._id === currentUserId));
    if (isLiked) {
        likeButton.classList.add('element__like-button_active');
    } 
    
    // !!! Проверяю, моя ли это карточка
    const isOwner = ownerId === currentUserId; 
    if (!isOwner) { // Если не моя, то кнопки удаления на ней не будет
        deleteButton.classList.add('element__delete-button_hidden');
    } else { // А если моя, то на нее навешивается слушатель кликов с колбэком удаления карточки
        deleteButton.addEventListener('click', (event) => {
            api.deleteCardOnServer(_id)
            .then(() => {
                event.target.closest('.element').remove();
            })
            .catch((err) => console.log(err));
        });
    }
    // !!!
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
    
    // !!!
    //cardImage.addEventListener('click', handlerImageClick);
    cardImage.addEventListener('click', () => handlerImageClick({link, name}));
  
    return cardElement;
}
  
      
export { toggleLike, createCard, handlerImageClick }; 
