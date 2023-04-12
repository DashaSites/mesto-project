import { 
  buttonEditProfileOpen, 
  buttonAddCardOpen, 
  buttonEditAvatar, 
  formEditProfile, 
  formAddCard, 
  formEditAvatar, 
  userAvatar, 
  validationConfig, 
  nameInput, 
  jobInput, 
  popupInputTitle, 
  popupInputLink, 
  popupEditAvatarLink,
  buttonSubmitEditProfile, 
  buttonSubmitEditAvatar, 
  buttonSubmitAddCard 
} from '../utils/constants.js';
import Api from '../components/Api.js';
import FormValidator from '../components/FormValidator.js';
import Card from '../components/Card.js';
import Section from '../components/Section.js';
import PopupWithImage from '../components/PopupWithImage.js';
import PopupWithForm from '../components/PopupWithForm.js';
import UserInfo from '../components/UserInfo.js';

const api = new Api({
  baseUrl: 'https://nomoreparties.co/v1/plus-cohort-20',
  headers: {
      authorization: '267cd1fa-32e1-4a1f-90f0-4ec82620b415',
      'Content-Type': 'application/json'
  }
});


const userInfo = new UserInfo({
  userNameSelector: '.profile__name', 
  userJobSelector: '.profile__occupation'
});


///// РАБОТА С ПОПАПАМИ /////
let popupToEditProfile;
let popupToAddCard;
let popupToEditAvatar;

// Слушатель кликов по кнопке редактирования профиля
buttonEditProfileOpen.addEventListener('click', () => {
  handleButtonEditProfileOpen();
});

// Функция открытия попапа редактирования профиля
const handleButtonEditProfileOpen = () => {
  popupToEditProfile = new PopupWithForm('.popup_type_edit-profile', submitFormEditProfile); 
  popupToEditProfile.open();
  popupToEditProfile.setEventListeners();

  nameInput.value = userInfo.getUserName();
  jobInput.value = userInfo.getUserAbout();

  //nameInput.value = profileName.textContent;
  //jobInput.value = profileOccupation.textContent; 
}

// Обработчик отправки формы редактирования профиля: использую здесь результат промиса
const submitFormEditProfile = (event) => {

  const user = {};
  user.name = nameInput.value;
  user.about = jobInput.value;

  popupToEditProfile.renderLoading(true);

  api.updateUserInfo(user) // Рендерим ответ, который мы получили от сервера, заменив на нем методом PATCH данные пользователя 
  // (мы вставляем эти данные в шапку из попапа)
  .then((user) => {
    userInfo.getUserInfo(user);
    popupToEditProfile.close();

      //profileName.textContent = user.name;
      //profileOccupation.textContent = user.about;
  })
  .catch((err) => console.log(err))
  .finally(() => {
    popupToEditProfile.renderLoading(false);
  });
}


// Слушатель кликов по кнопке добавления новой карточки
buttonAddCardOpen.addEventListener('click', () => {
  handleButtonAddCardOpen();
});

// Функция открытия попапа добавления карточки
const handleButtonAddCardOpen = () => {
  popupToAddCard = new PopupWithForm('.popup_type_add-card', submitFormAddCard);
  popupToAddCard.open();
  popupToAddCard.setEventListeners();
}

// Обработчик сабмита формы с новой карточкой: использую здесь результат промиса 
const submitFormAddCard = (event) => {
  const newCard = {}; // Создаю объект для передачи на сервер двух его свойств
  newCard.name = popupInputTitle.value;
  newCard.link = popupInputLink.value;

  popupToAddCard.renderLoading(true);

  api.createCardOnServer(newCard) // Получаю с сервера новую карточку, которая вдобавок к двум имеющимся свойствам получает и другие из стандартного набора свойств
  .then((res) => {
      const popupCardSection = new Section(
          (cardFromPopup) => {
            const card = new Card(cardFromPopup, currentUserId, handlerImageClick);
            const cardElement = card.generateCard();
            return cardElement;
          },
        '.elements'
      )
      popupCardSection.renderItems([res]);
      popupToAddCard.close();
  })
  .catch((err) => console.log(err))
  .finally(() => {
    popupToAddCard.renderLoading(false);
});
} 

// Слушатель кликов по кнопке, открывающей попап редактирования аватара
buttonEditAvatar.addEventListener('click', () => {
  handleButtonEditAvatar();
});

// Функция, которая открывает попап для смены аватара
const handleButtonEditAvatar = () => {
  popupToEditAvatar = new PopupWithForm('.popup_type_edit-avatar', submitFormEditAvatar);
  popupToEditAvatar.open();
  popupToEditAvatar.setEventListeners();
}

// Обработчик отправки формы редактирования аватара: использую здесь результат промиса
const submitFormEditAvatar = (event) => {

  popupToEditAvatar.renderLoading(true);

  // Получим результат промиса (делаем замену методом PATCH)
  api.updateAvatar(popupEditAvatarLink.value)
  // В случае положительного ответа с сервера содержимое этого ответа кладем в нужное место в DOM
  .then((res) => {
      userAvatar.style.backgroundImage = `url(${res.avatar})`;
      popupToEditAvatar.close();
  })
  .catch((err) => console.log(err))
  .finally(() => {
    popupToEditAvatar.renderLoading(false);
});
}


///// ОБРАБОТКА ЗАПРОСОВ С СЕРВЕРА /////

let currentUserId; // Запишем в переменную id текущего пользователя, чтобы использовать его позже при создании карты 

// Выкладываем начальный массив карт и забираем с сервера информацию о пользователе
const renderInitialCards = (cards) => {
  // Вызываем функцию, которая делает запрос к серверу на получение 
  // начальной информации о пользователе и начального массива карточек
  api.getInitialData()
  .then(([user, cards]) => {
    // 1) Берем с сервера и выкладываем в шапку сайта начальную информацию о пользователе:
    userInfo.getUserInfo(user);

    //profileName.textContent = user.name; 
    //profileOccupation.textContent = user.about;

    currentUserId = user._id; // Определяем id текущего пользователя
    userAvatar.style.backgroundImage = `url(${user.avatar})`; // И аватар текущего пользователя


    // 2) Вызываем экземпляры класса Card для каждой карточки из массива  
    const cardSection = new Section(
      (cardFromArray) => {
        const card = new Card(cardFromArray, currentUserId, handlerImageClick);
        const cardElement = card.generateCard();
        return cardElement;
      },
    '.elements'
  )
    cardSection.renderItems(cards);
  })
  .catch(err => console.log(err));
}
 

////////// ФУНКЦИИ //////////

// Вызываем функцию, которая выкладывает начальный массив карт
renderInitialCards();


// Обработчик, который по клику по картинке открывает попап с картинкой
const handlerImageClick = (link, name) => { 
  // Вместо вот этого кода ниже — вызвать экземпляр класса PopupWithImage
  const popupWithImage = new PopupWithImage('.popup_type_large-image', link, name);
  popupWithImage.open();
  popupWithImage.setEventListeners();
}


///// ВАЛИДАЦИЯ /////
const formEditProfileValidation = new FormValidator(validationConfig, formEditProfile);
formEditProfileValidation.enableValidation();

const formAddCardValidation = new FormValidator(validationConfig, formAddCard);
formAddCardValidation.enableValidation();

const formEditAvatarValidation = new FormValidator(validationConfig, formEditAvatar);
formEditAvatarValidation.enableValidation();


export { currentUserId, api, handlerImageClick };
















///// ПРОШЛАЯ ВЕРСИЯ ОБРАБОТКИ ЗАПРОСОВ САБМИТА ФОРМ



// ЗДЕСЬ ИСПОЛЬЗУЕМ РЕЗУЛЬТАТ ПРОМИСА
// Обработчик отправки формы редактирования профиля

/*
const submitFormEditProfile = (event) => {
  event.preventDefault();

  const user = {};
  user.name = nameInput.value;
  user.about = jobInput.value;

  
  buttonSubmitEditProfile.textContent = 'Сохранение...';

  api.updateUserInfo(user) // Рендерим ответ, который мы получили от сервера, заменив на нем методом PATCH данные пользователя 
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
  api.updateAvatar(popupEditAvatarLink.value)
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

  api.createCardOnServer(newCard) // Получаю с сервера новую карточку, которая вдобавок к двум имеющимся свойствам получает и другие из стандартного набора свойств
  .then((res) => {
      const popupCardSection = new Section(
          (cardFromPopup) => {
            const card = new Card(cardFromPopup, currentUserId, handlerImageClick);
            const cardElement = card.generateCard();
            return cardElement;
          },
        '.elements'
      )
      popupCardSection.renderItems([res]);

      event.target.reset();
      closePopup(popupAddCard);
  })
  .catch((err) => console.log(err))
  .finally(() => {
      buttonSubmitAddCard.textContent = 'Создать';
  });
}
*/
