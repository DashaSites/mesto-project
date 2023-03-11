import { enableValidation } from './components/validate.js';
import { toggleLike, deleteCard, createCard } from './components/card.js';
import { handleButtonEditProfileOpen, handleButtonAddCardOpen, submitFormEditProfile, submitFormAddCard, handlerImageClick, closePopupByEsc } from './components/modal.js';
import { openPopup, closePopup } from './components/utils.js';
import { getInitialData, getCurrentUser, getInitialCards } from './components/api.js';
import nairobi from './images/nairobi.jpg';
import stonetown from './images/stonetown.jpg';
import hiddenLeopard from './images/hidden-leopard.jpg';
import serengeti from './images/serengeti.jpg';
import kilwa from './images/kilwa.jpg';
import hippos from './images/hippos.jpg';
import './pages/index.css';

// ПЕРЕМЕННЫЕ

const buttonEditProfileOpen = document.querySelector('.profile__edit-button'); // Кнопка, открывающая попап редактирования профиля
const buttonAddCardOpen = document.querySelector('.profile__add-button'); // Кнопка, открывающая попап добавления новой карточки 
const buttonEditAvatar = document.querySelector('.profile__avatar'); // Кнопка, открывающая попап редактирования аватара
const popupEditProfile = document.querySelector('.popup_type_edit-profile'); // Попап редактирования профиля
const popupAddCard = document.querySelector('.popup_type_add-card'); // Попап добавления новой карточки
const imagePopup = document.querySelector('.popup_type_large-image'); // Попап-3
const popupEditAvatar = document.querySelector('.popup_type_edit-avatar'); // Попап редактирования аватара
const buttonEditProfileClose = document.querySelector('.popup__close-button-edit-profile'); // Кнопка, закрывающая попап редактирования профиля
const buttonAddCardClose = document.querySelector('.popup__close-button-add-card'); // Кнопка, закрывающая попап добавления карточки
const buttonLargeImageClose = document.querySelector('.popup__close-button-large-image'); // Кнопка, закрывающая попап с большой картинкой
const nameInput = popupEditProfile.querySelector('.popup__form-input-item_type_name'); // Имя в поле попапа профиля
const jobInput = popupEditProfile.querySelector('.popup__form-input-item_type_occupation'); // Род занятий в поле попапа профиля
const profileName = document.querySelector('.profile__name'); // Имя пользователя в шапке
const profileOccupation = document.querySelector('.profile__occupation'); // Род занятий в шапке
const formEditProfile = document.forms['edit-profile-form']; // Форма в попапе редактирования профиля
const formAddCard = document.forms['add-card-form']; // Форма в попапе добавления новой карточки
const cardsContainer = document.querySelector('.elements'); // Контейнер для всех карточек
const closeButtons = document.querySelectorAll('.popup__close-button'); // Все крестики попапов
const popupInputTitle = formAddCard.querySelector('.popup__form-input-item_type_title'); // Инпут подписи в попапе-2
const popupInputLink = formAddCard.querySelector('.popup__form-input-item_type_link'); // Инпут ссылки в попапе-2
const popupImage = imagePopup.querySelector('.popup__image'); // Картинка в попапе-3
const popupCaption = imagePopup.querySelector('.popup__caption'); // Подпись в попапе-3
const popupElements = document.querySelectorAll('.popup'); // Все попапы

// Массив с 6 карточками "из коробки"
const initialCards = [
    {
      name: 'Найроби',
      link: nairobi
    },
    {
      name: 'Занзибар',
      link: stonetown
    },
    {
      name: 'Серенгети',
      link: hiddenLeopard
    },
    {
      name: 'Где-то',
      link: serengeti
    },
    {
      name: 'Килва-Кисивани',
      link: kilwa
    },
    {
      name: 'Тарангире',
      link: hippos
    }
  ];


// ФУНКЦИИ

// Слушатель кликов по кнопке редактирования профиля
buttonEditProfileOpen.addEventListener('click', handleButtonEditProfileOpen);


// Слушатель кликов по кнопке добавления новой карточки
buttonAddCardOpen.addEventListener('click', handleButtonAddCardOpen);

// Слушатель кликов по кнопке, открывающей попап редактирования аватара
//buttonEditAvatar.addEventListener('click', handleButtonEditAvatar);


// Единый слушатель кликов по крестикам попапов + обработчик кликов по соответствующему крестику
closeButtons.forEach((button) => {
  // находим 1 раз ближайший к крестику попап 
  const popup = button.closest('.popup');
  // устанавливаем обработчик закрытия на крестик
  button.addEventListener('click', () => closePopup(popup));
});


// Функция закрытия попапов по оверлею
popupElements.forEach((popupElement) => {
  popupElement.addEventListener('click', (event) => {
    if (event.target.classList.contains('popup')) { // Проверяем, по какому именно элементу произошел клик
      closePopup(popupElement); // Если был кликнут верхний слой (с классом popup), то закрываем попап
    }
  });
});


// Слушатель кликов по кнопке "Сохранить" в попапе редактирования профиля
formEditProfile.addEventListener('submit', submitFormEditProfile);


// Слушатель кликов по кнопке "Создать" в попапе добавления новой карточки
formAddCard.addEventListener('submit', submitFormAddCard);



// ВАЛИДАЦИЯ ФОРМ: ЗДЕСЬ ТОЛЬКО ОБЪЕКТ С НАСТРОЙКАМИ И ВЫЗОВ ФУНКЦИИ ENABLEVALIDATION
// Создаем объект конфига, в который собираем все для валидации форм
const validationConfig = {
  formSelector: '.popup__form', // Форма в попапе
  inputSelector: '.popup__form-input-item', // Любой инпут в любой форме
  submitButtonSelector: '.popup__submit-button', // Кнопка сабмита формы в попапе
  disabledButtonClass: 'popup__submit-button_disabled', // Модификатор, дизейблящий кнопку сабмита формы
  inputErrorClass: 'popup__form-input-item_type_error', // Модификатор для невалидного инпута
  errorClass: 'error_visible' // Модификатор, показывающий сообщение об ошибке
}

let currentUserId; // Запишем в эту переменную id текущего пользователя, чтобы использовать его позже при создании карты 
// Выкладываем начальный массив карт и берем с сервера информацию о пользователе
const renderInitialCards = (cards) => {
  // Вызываем функцию, которая делает запрос к серверу на получение 
  // начальной информации о пользователе и начального массива карточек
  getInitialData()
  .then(([user, cards]) => {

    // Берем с сервера и отрисовываем (выкладываем) начальную информацию о пользователе
    profileName.textContent = user.name;
    profileOccupation.textContent = user.about;
    currentUserId = user._id; // определяем id текущего пользователя

    // Выкладываем начальный массив карточек, берем его с сервера
    cards.forEach((initialCard) => {
       cardsContainer.append(createCard(initialCard.link, initialCard.name, initialCard.likes, initialCard.owner._id, initialCard._id));
    });
  })
  .catch(err => console.log(err));
}
 

////////// ОБРАТАТЫВАЕМ ЗАПРОСЫ С СЕРВЕРА!!!!!!!!!!
// Выводим в консоль разом и начальное юзеринфо, и карточки, которые получили с сервера
getInitialData()
.then(([user, cards]) => {
  console.log(user, cards);
})
.catch(err => console.log(err));







///////////////
// ВЫЗОВЫ ФУНКЦИЙ

// Вызываем функцию выкладывания начального массива
renderInitialCards(initialCards);

// Вызов функции для включения валидации всех форм (передаем ей параметром необходимый объект настроек)
enableValidation(validationConfig);

export { popupEditProfile, popupAddCard, imagePopup, popupEditAvatar, nameInput, jobInput, profileName, profileOccupation, popupImage, popupCaption, popupInputTitle, popupInputLink, cardsContainer, handlerImageClick, currentUserId };