import { popupEditProfile, popupAddCard, imagePopup, popupEditAvatar, nameInput, jobInput, profileName, profileOccupation, popupImage, popupCaption, popupInputTitle, popupInputLink, cardsContainer } from '../index.js';
import { openPopup, closePopup } from './utils.js';
import { createCard } from './card.js';
import { updateUserInfo, createCardOnServer } from './api.js';

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

// Обработчик кликов по кнопке открытия попапа для редактирования аватара
const handleButtonEditAvatar = () => {
    openPopup(popupEditAvatar);
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

    createCardOnServer(newCard)
    .then((newCard) => {
        cardsContainer.prepend(createCard(newCard));
    })
    .catch((err) => console.log(err));

    //cardsContainer.prepend(createCard(newCard)); Это работало до подключения к серверу. Стояло вместо вызова функции createCardOnServer(newCard), что выше
  
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



export { handleButtonEditProfileOpen, handleButtonAddCardOpen, submitFormEditProfile, handleButtonEditAvatar, submitFormAddCard, handlerImageClick, closePopupByEsc };