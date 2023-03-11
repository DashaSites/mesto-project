import { handlerImageClick, renderInitialCards } from '../index.js'
import { deleteCardOnServer, likeCard } from './api.js';

// ФУНКЦИИ ДЛЯ РАБОТЫ С КАРТОЧКАМИ

// Ставим/убираем лайк 
const toggleLike = (event) => {
    event.target.classList.toggle('element__like-button_active');
}


// Создаем карточку
const createCard = (link, name, likes, ownerId, _id, currentUserId, toggleLike) => {
    const cardTemplate = document.querySelector('.element-template').content;
    const cardElement = cardTemplate.querySelector('.element').cloneNode(true);
    const cardImage = cardElement.querySelector('.element__image');
  
    cardImage.src = link;
    cardImage.alt = name;
    cardElement.querySelector('.element__caption').textContent = name;

    const likeButton = cardElement.querySelector('.element__like-button');
    const likeCounterElement = cardElement.querySelector('.element__like-counter');


    // Записываю длину массива лайков карточки в строковый формат, чтобы отобразить ее в карточке 
    likeCounterElement.textContent = likes.length.toString();

    // Проверяю, есть ли мой лайк в массиве лайков карточки
    const isLiked = Boolean(likes.find(user => user._id === currentUserId));
    
    // Функция изменения состояния кнопки лайка (когда я лайкнула или отлайкнула карточку)
    likeButton.addEventListener('click', (event) => {
        if (!isLiked) { // Проверяю, есть ли мой лайк уже в массиве лайков, и если нет,
            likeCard(_id) // Вызываю через сервер функцию "лайкнуть"
            .then((res) => {
                likeCounterElement.textContent = res.likeCounterElement;
                likeButton.classList.add('element__like-button_active');
            })
            .catch((err) => console.log(err));
        } else { // Если, наоборот, мой лайк уже есть
            unlikeCard(_id) // То вызываю функцию "отлайкнуть"
            .then((res) => {
                likeCounterElement.textContent = res.likeCounterElement;
                likeButton.classList.remove('element__like-button_active');
            })
            .catch((err) => console.log(err));
        }
    });

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