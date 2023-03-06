import { handlerImageClick } from '../index.js'

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
const createCard = (card) => {
    const cardTemplate = document.querySelector('.element-template').content;
    const cardElement = cardTemplate.querySelector('.element').cloneNode(true);
    const cardImage = cardElement.querySelector('.element__image');
  
    cardImage.src = card.image;
    cardImage.alt = card.caption;
  
    cardElement.querySelector('.element__caption').textContent = card.caption;
  
    cardElement.querySelector('.element__like-button').addEventListener('click', toggleLike);
    cardElement.querySelector('.element__delete-button').addEventListener('click', deleteCard);
    //cardImage.addEventListener('click', handlerImageClick);
    cardImage.addEventListener('click', () => handlerImageClick(card));
  
    return cardElement;
}
  
  
    
export { toggleLike, deleteCard, createCard };