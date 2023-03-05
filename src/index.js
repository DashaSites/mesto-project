import { enableValidation } from './validate.js'
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
const popupEditProfile = document.querySelector('.popup_type_edit-profile'); // Попап редактирования профиля
const popupAddCard = document.querySelector('.popup_type_add-card'); // Попап добавления новой карточки
const imagePopup = document.querySelector('.popup_type_large-image'); // Попап-3
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
      caption: 'Найроби',
      image: nairobi
    },
    {
      caption: 'Занзибар',
      image: stonetown
    },
    {
      caption: 'Серенгети',
      image: hiddenLeopard
    },
    {
      caption: 'Где-то',
      image: serengeti
    },
    {
      caption: 'Килва-Кисивани',
      image: kilwa
    },
    {
      caption: 'Тарангире',
      image: hippos
    }
  ];


// ФУНКЦИИ

// Функция открытия любого попапа (нужный попап передается сюда через аргумент)
const openPopup = (popup) => {
    popup.classList.add('popup_opened');

    document.addEventListener('keydown', closePopupByEsc);
}


// Обработчик кликов по кнопке редактирования профиля
const handleButtonEditProfileOpen = () => {
    openPopup(popupEditProfile);
    nameInput.value = profileName.textContent;
    jobInput.value = profileOccupation.textContent; 
}


// Слушатель кликов по кнопке редактирования профиля
buttonEditProfileOpen.addEventListener('click', handleButtonEditProfileOpen);


// Обработчик кликов по кнопке добавления новой карточки
const handleButtonAddCardOpen = () => {
  openPopup(popupAddCard);
}

// Слушатель кликов по кнопке добавления новой карточки
buttonAddCardOpen.addEventListener('click', handleButtonAddCardOpen);


// Единый слушатель кликов по крестикам попапов + обработчик кликов по соответствующему крестику
closeButtons.forEach((button) => {
  // находим 1 раз ближайший к крестику попап 
  const popup = button.closest('.popup');
  // устанавливаем обработчик закрытия на крестик
  button.addEventListener('click', () => closePopup(popup));
});


// Функция закрытия (любого) попапа
const closePopup = (popup) => {
    popup.classList.remove('popup_opened');

    document.removeEventListener('keydown', closePopupByEsc);
}


// Обработчик отправки формы редактирования профиля
const submitFormEditProfile = (event) => {
    event.preventDefault();
  
    profileName.textContent = nameInput.value;
    profileOccupation.textContent = jobInput.value;

    closePopup(popupEditProfile);
}


// Слушатель кликов по кнопке "Сохранить" в попапе редактирования профиля
formEditProfile.addEventListener('submit', submitFormEditProfile);


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


// Слушатель кликов по кнопке "Создать" в попапе добавления новой карточки
formAddCard.addEventListener('submit', submitFormAddCard);


// Ставим/убираем лайк 
const toggleLike = (event) => {
  event.target.classList.toggle('element__like-button_active');
}


// Удаляем карточку
const deleteCard = (event) => {
  event.target.closest('.element').remove();
}

/*
// Обработчик клика по картинке (чтобы открыть попап-3)
const handlerImageClick = (event) => {
  openPopup(imagePopup);
  const item = event.target;
  popupImage.src = item.src;
  popupImage.alt = item.alt;
  popupCaption.textContent = item.alt;
} 
*/

// Обработчик клика по картинке (чтобы открыть попап-3)
const handlerImageClick = ({image, caption}) => { 
  openPopup(imagePopup);

  popupImage.src = image;
  popupImage.alt = caption;
  popupCaption.textContent = caption;
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


// Выкладываем начальный массив карт
const renderInitialCards = (cards) => {

  cards.forEach((initialCard) => {
    cardsContainer.append(createCard(initialCard));
  });
}


// Вызываем функцию выкладывания начального массива
renderInitialCards(initialCards);


// Функция закрытия попапов по оверлею

popupElements.forEach((popupElement) => {
  popupElement.addEventListener('click', (event) => {
    if (event.target.classList.contains('popup')) { // Проверяем, по какому именно элементу произошел клик
      closePopup(popupElement); // Если был кликнут верхний слой (с классом popup), то закрываем попап
    }
  });
});


// Функция запрутия любого попапа нажатием на Esc
const closePopupByEsc = (event) => {
  if (event.key === 'Escape') {
    closePopup(document.querySelector('.popup_opened'));
  }
}



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



// Вызов функции для включения валидации всех форм (передаем ей параметром необходимый объект настроек)
enableValidation(validationConfig);
