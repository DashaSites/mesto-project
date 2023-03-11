import { handlerImageClick, renderInitialCards, currentUserId } from '../index.js'
import { deleteCardOnServer } from './api.js';

// ФУНКЦИИ ДЛЯ РАБОТЫ С КАРТОЧКАМИ

// Ставим/убираем лайк 
const toggleLike = (event) => {
    event.target.classList.toggle('element__like-button_active');
}
 

// Удаляем карточку - так работало до подключения к серверу
/*
const deleteCard = (event) => {
    event.target.closest('.element').remove();
} 
*/


// Создаем карточку
const createCard = (link, name, likes, ownerId, _id) => {
    const cardTemplate = document.querySelector('.element-template').content;
    const cardElement = cardTemplate.querySelector('.element').cloneNode(true);
    const cardImage = cardElement.querySelector('.element__image');
  
    cardImage.src = link;
    cardImage.alt = name;

    cardElement.querySelector('.element__like-counter').textContent = likes.length;
    cardElement.querySelector('.element__caption').textContent = name;
    
    const deleteButton = cardElement.querySelector('.element__delete-button'); // кнопка удаления данной карточки
    const isOwner = ownerId === currentUserId; // проверяем: владелец данной карточки и текущий юзер - это один и тот же юзер?
    
    deleteButton.classList.add(isOwner ? 'element__delete-button_visible' : 'element__delete-button_hidden'); // если это один и тот же юзер, то показываем кнопку удаления карточки

    cardElement.querySelector('.element__like-button').addEventListener('click', toggleLike);
    //deleteButton.addEventListener('click', deleteCard); // Работало до подключения к серверу
 
    // Удаляем карточку по клику на урну, используя запрос к серверу
    deleteButton.addEventListener('click', (event) => {
        deleteCardOnServer(_id)
        .then(() => {
            event.target.closest('.element').remove();
        })
        .catch((err) => console.log(err));
    });



    //cardImage.addEventListener('click', handlerImageClick);
    cardImage.addEventListener('click', () => handlerImageClick({link, name}));
  
    return cardElement;
}
  
  
    
export { toggleLike, createCard }; // deleteCard 