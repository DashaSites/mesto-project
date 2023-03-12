import { handlerImageClick, renderInitialCards } from '../index.js'
import { deleteCardOnServer, likeCard, unlikeCard } from './api.js';

// ФУНКЦИИ ДЛЯ РАБОТЫ С КАРТОЧКАМИ

// Ставим/убираем лайк 
const toggleLike = (event) => {
    event.target.classList.toggle('element__like-button_active');
}


// Создаем карточку
const createCard = (link, name, likes, ownerId, _id, currentUserId) => {
    const cardTemplate = document.querySelector('.element-template').content;
    const cardElement = cardTemplate.querySelector('.element').cloneNode(true);
    const cardImage = cardElement.querySelector('.element__image');
  
    cardImage.src = link;
    cardImage.alt = name;
    cardElement.querySelector('.element__caption').textContent = name;

    const likeButton = cardElement.querySelector('.element__like-button'); // Сердечко данной карточки
    const likeCounterElement = cardElement.querySelector('.element__like-counter'); // Элемент счетчика лайков
    likeCounterElement.textContent = likes.length; // Записали длину массива лайков данной карточки в счетчик ее лайков в DOM

    // Проверка, сколько лайков у карточки, и если их > 0, отображаем счетчик лайков
    /*
    if (likes.length > 0) {
            likeCounterElement.classList.add('element__like-counter_active');
            likeCounterElement.textContent = likes.length;
        } else {
            likeCounterElement.classList.remove('element__like-counter_active');
            likeCounterElement.textContent = '';
        }
        */
    
    // Проверяю, есть ли уже мой лайк в массиве лайков карточки. Если да, то сердечко будет уже черное
    const isLiked = Boolean(likes.find(user => user._id === currentUserId));
    if (isLiked) {
        likeButton.classList.add('element__like-button_active');
    } 

    likeButton.addEventListener('click', (event) => {
        if (event.target.classList.contains('element__like-button_active')) { // Если карточка уже была лайкнута
            unlikeCard(_id)
            .then((res) => {
                event.target.classList.remove('element__like-button_active');
                likeCounterElement.textContent = res.likes.length;
            })
            .catch((err) => console.log(err));

        } else { // Если карточка не была лайкнута
            likeCard(_id) 
            .then((res) => {
                event.target.classList.add('element__like-button_active');
                likeCounterElement.textContent = res.likes.length;
            })
            .catch((err) => console.log(err));
        }
    })

    const deleteButton = cardElement.querySelector('.element__delete-button'); // кнопка удаления данной карточки
    const isOwner = ownerId === currentUserId; // проверяем: владелец данной карточки и текущий юзер - это один и тот же юзер?
    deleteButton.classList.add(isOwner ? 'element__delete-button_visible' : 'element__delete-button_hidden'); // если это один и тот же юзер, то показываем кнопку удаления карточки

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
  
  
    
export { toggleLike, createCard }; 