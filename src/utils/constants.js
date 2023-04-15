// КОНСТАНТЫ

const buttonEditProfileOpen = document.querySelector('.profile__edit-button'); // Кнопка, открывающая попап редактирования профиля
const buttonAddCardOpen = document.querySelector('.profile__add-button'); // Кнопка, открывающая попап добавления новой карточки 
const buttonEditAvatar = document.querySelector('.profile__avatar'); // Кнопка, открывающая попап редактирования аватара
const profileName = document.querySelector('.profile__name'); // Имя пользователя в шапке
const profileOccupation = document.querySelector('.profile__occupation'); // Род занятий в шапке
const formEditProfile = document.forms['edit-profile-form']; // Форма в попапе редактирования профиля
const formAddCard = document.forms['add-card-form']; // Форма в попапе добавления новой карточки
const formEditAvatar = document.forms['edit-avatar-form']; // Форма в попапе редактирования аватара
const cardsContainer = document.querySelector('.elements'); // Контейнер для всех карточек
const popupInputTitle = formAddCard.querySelector('.popup__form-input-item_type_title'); // Инпут подписи в попапе-2
const popupInputLink = formAddCard.querySelector('.popup__form-input-item_type_link'); // Инпут ссылки в попапе-2
const popupImage = document.querySelector('.popup__image'); // Картинка в попапе-3
const popupCaption = document.querySelector('.popup__caption'); // Подпись в попапе-3
const popupElements = document.querySelectorAll('.popup'); // Все попапы
const popupEditProfile = '.popup_type_edit-profile'; // селектор попапа редактирования профиля
const popupAddCard = '.popup_type_add-card'; // селектор попапа добавления новой карточки
const popupEditAvatar = '.popup_type_edit-avatar'; // селектор попапа редактирования аватара
const imagePopup = '.popup_type_large-image'; // селектор попапа с большой картинкой


import nairobi from '../images/nairobi.jpg';
import stonetown from '../images/stonetown.jpg';
import hiddenLeopard from '../images/hidden-leopard.jpg';
import serengeti from '../images/serengeti.jpg';
import kilwa from '../images/kilwa.jpg';
import hippos from '../images/hippos.jpg';
import '../pages/index.css';


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


// Объект конфига, в котором собрано все для валидации форм
const validationConfig = {
    formSelector: '.popup__form', // Форма в попапе
    inputSelector: '.popup__form-input-item', // Любой инпут в любой форме
    submitButtonSelector: '.popup__submit-button', // Кнопка сабмита формы в попапе
    disabledButtonClass: 'popup__submit-button_disabled', // Модификатор, дизейблящий кнопку сабмита формы
    inputErrorClass: 'popup__form-input-item_type_error', // Модификатор для невалидного инпута
    errorClass: 'error_visible' // Модификатор, показывающий сообщение об ошибке
  }


  export { 
    buttonEditProfileOpen, 
    buttonAddCardOpen, 
    buttonEditAvatar, 
    popupElements, 
    formEditProfile, 
    formAddCard, 
    formEditAvatar, 
    initialCards, 
    validationConfig, 
    cardsContainer, 
    popupEditProfile, 
    popupAddCard, 
    imagePopup, 
    popupImage, 
    popupEditAvatar, 
    profileName, 
    profileOccupation, 
    popupCaption, 
    popupInputTitle, 
    popupInputLink
  };