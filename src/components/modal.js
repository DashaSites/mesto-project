import { popupEditProfile, popupAddCard, imagePopup, nameInput, jobInput, profileName, profileOccupation, popupImage, popupCaption, popupInputTitle, popupInputLink, cardsContainer } from '../index.js';
import { openPopup, closePopup } from './utils.js';
import { createCard } from './card.js';

// ФУНКЦИИ, СВЯЗАННЫЕ С РАБОТОЙ ПОПАПОВ

// Обработчик кликов по кнопке редактирования профиля
const handleButtonEditProfileOpen = () => {
    openPopup(popupEditProfile);
    nameInput.value = profileName.textContent;
    jobInput.value = profileOccupation.textContent; 
}


// Обработчик кликов по кнопке добавления новой карточки
const handleButtonAddCardOpen = () => {
    openPopup(popupAddCard);
}


// Обработчик отправки формы редактирования профиля
const submitFormEditProfile = (event) => {
    event.preventDefault();
  
    profileName.textContent = nameInput.value;
    profileOccupation.textContent = jobInput.value;

    closePopup(popupEditProfile);
}


// Обработчик сабмита формы с новой карточкой
const submitFormAddCard = (event) => {
    event.preventDefault();
  
    const newCard = {};
    newCard.caption = popupInputTitle.value;
    newCard.image = popupInputLink.value;
    cardsContainer.prepend(createCard(newCard));
  
    event.target.reset();
    
    closePopup(popupAddCard);
}


// Обработчик клика по картинке (чтобы открыть попап-3)
const handlerImageClick = ({image, caption}) => { 
    openPopup(imagePopup);
  
    popupImage.src = image;
    popupImage.alt = caption;
    popupCaption.textContent = caption;
}


// Функция закрытия любого попапа нажатием на Esc
const closePopupByEsc = (event) => {
    if (event.key === 'Escape') {
      closePopup(document.querySelector('.popup_opened'));
    }
}



export { handleButtonEditProfileOpen, handleButtonAddCardOpen, submitFormEditProfile, submitFormAddCard, handlerImageClick, closePopupByEsc };