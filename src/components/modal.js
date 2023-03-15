import { popupEditProfile, popupAddCard, imagePopup, popupEditAvatar, nameInput, jobInput, profileName, profileOccupation, userAvatar, popupImage, popupCaption, popupInputTitle, popupInputLink, popupEditAvatarLink, cardsContainer, buttonSubmitEditProfile, buttonSubmitEditAvatar, buttonSubmitAddCard } from './constants.js';
import { openPopup, closePopup } from './utils.js';
import { createCard } from './card.js';
import { updateUserInfo, createCardOnServer, updateAvatar } from './api.js';
import { currentUserId } from '../index.js';

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


// ЗДЕСЬ ИСПОЛЬЗУЕМ РЕЗУЛЬТАТ ПРОМИСА
// Обработчик отправки формы редактирования профиля
const submitFormEditProfile = (event) => {
    event.preventDefault();

    const user = {};
    user.name = nameInput.value;
    user.about = jobInput.value;

    
    buttonSubmitEditProfile.textContent = 'Сохранение...';

    updateUserInfo(user) // Рендерим ответ, который мы получили от сервера, заменив на нем методом PATCH данные пользователя 
    // (мы вставляем эти данные в шапку из попапа)
    .then((user) => {
        profileName.textContent = user.name;
        profileOccupation.textContent = user.about;
        closePopup(popupEditProfile);
    })
    .catch((err) => console.log(err))
    .finally(() => {
        buttonSubmitEditProfile.textContent = 'Сохранить';
      }); 
}


// ЗДЕСЬ ИСПОЛЬЗУЕМ РЕЗУЛЬТАТ ПРОМИСА
// Обработчик отправки формы редактирования аватара
const submitFormEditAvatar = (event) => {
    event.preventDefault();

    buttonSubmitEditAvatar.textContent = 'Сохранение...';

    // Получим результат промиса (делаем замену методом PATCH)
    updateAvatar(popupEditAvatarLink.value)
    // В случае положительного ответа с сервера, содержимое этого ответа кладем в нужное место в DOM
    .then((res) => {
        userAvatar.style.backgroundImage = `url(${res.avatar})`;
        closePopup(popupEditAvatar);
    })
    .catch((err) => console.log(err))
    .finally(() => {
        buttonSubmitEditAvatar.textContent = 'Сохранить';
    });
    //userAvatar.style.backgroundImage = `url(${popupEditAvatarLink.value})`;
}


// ЗДЕСЬ ИСПОЛЬЗУЕМ РЕЗУЛЬТАТ ПРОМИСА
// Обработчик сабмита формы с новой карточкой
const submitFormAddCard = (event) => {
    event.preventDefault();
  
    const newCard = {}; // Создаю объект для передачи на сервер двух его свойств
    newCard.name = popupInputTitle.value;
    newCard.link = popupInputLink.value;

    buttonSubmitAddCard.textContent = 'Сохранение...';
    // Перед вызовом createCard сделать проверку: моя/не моя карточка

    createCardOnServer(newCard) // Получаю с сервера новую карточку, которая вдобавок к двум имеющимся свойствам получает и другие из стандартного набора свойств
    .then((res) => {
        cardsContainer.prepend(createCard(res.link, res.name, res.likes, res.owner._id, res._id, currentUserId));
        event.target.reset();
        closePopup(popupAddCard);
    })
    .catch((err) => console.log(err))
    .finally(() => {
        buttonSubmitAddCard.textContent = 'Создать';
    });
}


// Обработчик клика по картинке (чтобы открыть попап-3)
/*
const handlerImageClick = ({link, name}) => { 
    openPopup(imagePopup);
  
    popupImage.src = link;
    popupImage.alt = name;
    popupCaption.textContent = name;
}
*/


// Функция закрытия любого попапа нажатием на Esc
const closePopupByEsc = (event) => {
    if (event.key === 'Escape') {
      closePopup(document.querySelector('.popup_opened'));
    }
}



export { handleButtonEditProfileOpen, handleButtonAddCardOpen, submitFormEditProfile, submitFormEditAvatar, handleButtonEditAvatar, submitFormAddCard, closePopupByEsc };