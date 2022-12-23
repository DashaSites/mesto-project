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
const formEditProfile = document.querySelector('.popup__form_type_edit-profile'); // Форма в попапе редактирования профиля
const formAddCard = document.querySelector('.popup__form_type_add-card'); // Форма в попапе добавления новой карточки
const cardsContainer = document.querySelector('.elements');


// Массив с 6 карточками "из коробки"
const initialCards = [
    {
      caption: 'Найроби',
      image: './images/nairobi.jpg'
    },
    {
      caption: 'Занзибар',
      image: './images/stonetown.jpg'
    },
    {
      caption: 'Серенгети',
      image: './images/hidden-leopard.jpg'
    },
    {
      caption: 'Где-то',
      image: './images/serengeti.jpg'
    },
    {
      caption: 'Килва-Кисивани',
      image: './images/kilwa.jpg'
    },
    {
      caption: 'Тарангире',
      image: './images/hippos.jpg'
    }
  ];


// Функция открытия любого попапа (нужный попап передается сюда через аргумент)
const openPopup = (popup) => {
    popup.classList.add('popup_opened');
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


// Обработчик кликов по кнопке закрытия попапа добавления карточки
const handleButtonAddCardClose = () => {
  closePopup(popupAddCard);
}


// Слушатель кликов по кнопке закрытия попапа добавления новой карточки
buttonAddCardClose.addEventListener('click', handleButtonAddCardClose);


// Функция закрытия (любого) попапа
const closePopup = (popup) => {
    popup.classList.remove('popup_opened');
}


// Обработчик кликов по кнопке закрытия попапа редактирования профиля
const handleButtonEditProfileClose = () => {
    closePopup(popupEditProfile);
}


// Слушатель кликов по кнопке закрытия попапа редактирования профиля
buttonEditProfileClose.addEventListener('click', handleButtonEditProfileClose);


// Обработчик кликов по кнопке закрытия попапа с большой картинкой
const handleButtonLargeImageClose = () => {
  closePopup(imagePopup);
}


// Слушатель кликов по кнопке закрытия попапа с большой картинкой
buttonLargeImageClose.addEventListener('click', handleButtonLargeImageClose);


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
  newCard.caption = formAddCard.querySelector('.popup__form-input-item_type_title').value;
  newCard.image = formAddCard.querySelector('.popup__form-input-item_type_link').value;
  cardsContainer.prepend(createCard(newCard));
  
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


// Обработчик клика по картинке (чтобы открыть попап-3)
const handlerImageClick = (event) => {

  openPopup(imagePopup);

  const item = event.target;
  imagePopup.querySelector('.popup__image').src = item.src;
  imagePopup.querySelector('.popup__caption').textContent = item.closest('.element').querySelector('.element__caption').textContent;
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
  cardImage.addEventListener('click', handlerImageClick);

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