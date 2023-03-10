import { handlerImageClick, renderInitialCards, currentUserId } from '../index.js'

// ФУНКЦИИ ДЛЯ РАБОТЫ С КАРТОЧКАМИ

// Ставим/убираем лайк 
const toggleLike = (event) => {
    event.target.classList.toggle('element__like-button_active');
}
  
  
// Удаляем карточку
const deleteCard = (event) => {
    event.target.closest('.element').remove();
}


// Создаем карточку
const createCard = ({link, name, likes, owner._id, _id}) => {
    const cardTemplate = document.querySelector('.element-template').content;
    const cardElement = cardTemplate.querySelector('.element').cloneNode(true);
    const cardImage = cardElement.querySelector('.element__image');
  
    cardImage.src = card.link;
    cardImage.alt = card.name;

    cardElement.querySelector('.element__like-counter').textContent = card.likes.length;
    cardElement.querySelector('.element__caption').textContent = card.name;
    cardElement.ownerId = card._id; // записываем в переменную id владельца данной карточки
    
    const deleteButton = cardElement.querySelector('.element__delete-button'); // кнопка удаления данной карточки
    const isOwner = cardElement.ownerId === currentUserId; // проверяем: владелец данной карточки и текущий юзер - это один и тот же юзер?
    
    deleteButton.classList.add(isOwner ? 'element__delete-button_visible' : 'element__delete-button_hidden'); // если это один и тот же юзер, то показываем кнопку удаления карточки


    cardElement.querySelector('.element__like-button').addEventListener('click', toggleLike);
    cardElement.querySelector('.element__delete-button').addEventListener('click', deleteCard);
    //cardImage.addEventListener('click', handlerImageClick);
    cardImage.addEventListener('click', () => handlerImageClick(card));
  
    return cardElement;
}
  
  
    
export { toggleLike, deleteCard, createCard };