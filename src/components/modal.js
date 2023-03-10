import { popupEditProfile, popupAddCard, imagePopup, nameInput, jobInput, profileName, profileOccupation, popupImage, popupCaption, popupInputTitle, popupInputLink, cardsContainer } from '../index.js';
import { openPopup, closePopup } from './utils.js';
import { createCard } from './card.js';
import { updateUserInfo } from './api.js';

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

// СЮДА ЗАСУНУЛИ РЕЗУЛЬТАТЫ ПРОМИСА
// Обработчик отправки формы редактирования профиля
const submitFormEditProfile = (event) => {
    event.preventDefault();

    const user = {};
    user.name = nameInput.value;
    user.about = jobInput.value;

    updateUserInfo(user) // Рендерим ответ, который мы получили от сервера, заменив на нем методом PATCH данные пользователя 
    // (мы вставляем эти данные в шапку из попапа)
    .then((user) => {
        profileName.textContent = user.name;
        profileOccupation.textContent = user.about;
    })
    .catch((err) => console.log(err));
  
    //profileName.textContent = nameInput.value; // Эта вставка данных работала до подключения к серверу
    //profileOccupation.textContent = jobInput.value; // Эта вставка данных работала до подключения к серверу

    closePopup(popupEditProfile);
}


// Обработчик сабмита формы с новой карточкой
const submitFormAddCard = (event) => {
    event.preventDefault();
  
    const newCard = {};
    newCard.name = popupInputTitle.value;
    newCard.link = popupInputLink.value;
    cardsContainer.prepend(createCard(newCard));
  
    event.target.reset();
    
    closePopup(popupAddCard);
}


// Обработчик клика по картинке (чтобы открыть попап-3)
const handlerImageClick = ({link, name}) => { 
    openPopup(imagePopup);
  
    popupImage.src = link;
    popupImage.alt = name;
    popupCaption.textContent = name;
}


// Функция закрытия любого попапа нажатием на Esc
const closePopupByEsc = (event) => {
    if (event.key === 'Escape') {
      closePopup(document.querySelector('.popup_opened'));
    }
}



export { handleButtonEditProfileOpen, handleButtonAddCardOpen, submitFormEditProfile, submitFormAddCard, handlerImageClick, closePopupByEsc };