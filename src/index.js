import { buttonEditProfileOpen, buttonAddCardOpen, buttonEditAvatar, popupElements, formEditProfile, formAddCard, formEditAvatar, profileName, profileOccupation, userAvatar, initialCards, validationConfig, cardsContainer } from './components/constants.js'
//import { enableValidation } from './components/FormValidator.js';
import { toggleLike, deleteCard, handlerImageClick, createCard } from './components/card.js';
import { handleButtonEditProfileOpen, handleButtonAddCardOpen, handleButtonEditAvatar, submitFormEditProfile, submitFormEditAvatar, submitFormAddCard, closePopupByEsc } from './components/modal.js';
import { openPopup, closePopup } from './components/utils.js';
import Api from './components/Api.js';
import FormValidator from './components/FormValidator.js';

const api = new Api({
  baseUrl: 'https://nomoreparties.co/v1/plus-cohort-20',
  headers: {
      authorization: '267cd1fa-32e1-4a1f-90f0-4ec82620b415',
      'Content-Type': 'application/json'
  }
});


// ФУНКЦИИ

// Слушатель кликов по кнопке редактирования профиля
buttonEditProfileOpen.addEventListener('click', handleButtonEditProfileOpen);

// Слушатель кликов по кнопке добавления новой карточки
buttonAddCardOpen.addEventListener('click', handleButtonAddCardOpen);

// Слушатель кликов по кнопке, открывающей попап редактирования аватара
buttonEditAvatar.addEventListener('click', handleButtonEditAvatar);


// Обработчики одновременно оверлея и крестиков всех попапов. Используя универсальные классы этих элементов, пробегаемся по ним всем, навешиваем обработчики и закрываем тот попап, на который нажали 
popupElements.forEach((popup) => {
  popup.addEventListener('mousedown', (event) => {
    if (event.target.classList.contains('popup_opened')) {
      closePopup(popup);
    }
    if (event.target.classList.contains('popup__close-button')) {
      closePopup(popup);
    }
  })
})


// Слушатель кликов по кнопке "Сохранить" в попапе редактирования профиля
formEditProfile.addEventListener('submit', submitFormEditProfile);


// Слушатель кликов по кнопке "Создать" в попапе добавления новой карточки
formAddCard.addEventListener('submit', submitFormAddCard);


// Слушатель кликов по кнопке "Сохранить" в попапе редактирования аватара
formEditAvatar.addEventListener('submit', submitFormEditAvatar);


////////// ОБРАТАТЫВАЕМ ЗАПРОСЫ С СЕРВЕРА!!! //////////

let currentUserId; // Запишем в эту переменную id текущего пользователя, чтобы использовать его позже при создании карты 

// Выкладываем начальный массив карт и забираем с сервера информацию о пользователе
const renderInitialCards = (cards) => {
  // Вызываем функцию, которая делает запрос к серверу на получение 
  // начальной информации о пользователе и начального массива карточек
  api.getInitialData()
  .then(([user, cards]) => {

    // Берем с сервера и отрисовываем (выкладываем) начальную информацию о пользователе:
    profileName.textContent = user.name; // имя
    profileOccupation.textContent = user.about; // род занятий
    currentUserId = user._id; // определяем id текущего пользователя
    userAvatar.style.backgroundImage = `url(${user.avatar})`; // аватар текущего пользователя

    // Выкладываем начальный массив карточек, берем его с сервера
    cards.forEach((initialCard) => {
       cardsContainer.append(createCard(initialCard.link, initialCard.name, initialCard.likes, initialCard.owner._id, initialCard._id, currentUserId, toggleLike ));
    });
  })
  .catch(err => console.log(err));
}
 

////////// ВЫЗОВЫ ФУНКЦИЙ //////////

// Вызываем функцию выкладывания начального массива
renderInitialCards();


// Раньше тут был вызов функции для включения валидации всех форм (передаем ей параметром необходимый объект настроек)
//enableValidation(validationConfig);
// А теперь ее надо переписать: сделать какой-то цикл, в котором провалидировать по очереди все формы
const formEditProfileValidation = new FormValidator(validationConfig, formEditProfile);
formEditProfileValidation.enableValidation();

const formAddCardValidation = new FormValidator(validationConfig, formAddCard);
formAddCardValidation.enableValidation();

const formEditAvatarValidation = new FormValidator(validationConfig, formEditAvatar);
formEditAvatarValidation.enableValidation();

export { currentUserId, api };