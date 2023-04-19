import { 
  buttonEditProfileOpen, 
  buttonAddCardOpen, 
  buttonEditAvatar, 
  formEditProfile, 
  formAddCard, 
  formEditAvatar, 
  validationConfig,  
  popupEditProfile,
  popupAddCard,
  popupEditAvatar,
  imagePopup
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
  userJobSelector: '.profile__occupation',
  userAvatarSelector: '.profile__avatar'
});


let cardSection;


///// РАБОТА С ПОПАПАМИ /////

// Слушатель кликов по кнопке редактирования профиля
buttonEditProfileOpen.addEventListener('click', () => {
  popupToEditProfile.open();
  popupToEditProfile.setInputValues(userInfo.getUserInfo());  
});

// Попап редактирования профиля
const popupToEditProfile = new PopupWithForm(popupEditProfile, {
  handleFormSubmit: (user) => {
    popupToEditProfile.renderLoading(true);
    api.updateUserInfo(user) // Рендерим ответ, который мы получили от сервера, заменив на нем методом PATCH данные пользователя 
    // (мы вставляем эти данные в шапку из попапа)
    .then((user) => {
      userInfo.setUserInfo(user);
      popupToEditProfile.close();
    })
    .catch((err) => console.log(err))
    .finally(() => {
      popupToEditProfile.renderLoading(false);
    });
  }
}); 
popupToEditProfile.setEventListeners();


// Слушатель кликов по кнопке добавления новой карточки
buttonAddCardOpen.addEventListener('click', () => {
  popupToAddCard.open(); 
});

// Попап добавления новой карточки
const popupToAddCard = new PopupWithForm(popupAddCard, {
  handleFormSubmit: (data) => {
    popupToAddCard.renderLoading(true);

    api.createCardOnServer(data) // Получаю с сервера новую карточку, которая вдобавок к двум имеющимся свойствам получает и другие из стандартного набора свойств
    .then((data) => {
        cardSection.renderItems([data]);
        popupToAddCard.close();
    })
    .catch((err) => console.log(err))
    .finally(() => {
      popupToAddCard.renderLoading(false);
    });
  }
});
popupToAddCard.setEventListeners();


// Слушатель кликов по кнопке, открывающей попап редактирования аватара
buttonEditAvatar.addEventListener('click', () => {
  popupToEditAvatar.open();
});

// Попап для смены аватара
const popupToEditAvatar = new PopupWithForm(popupEditAvatar, {
  handleFormSubmit: (data) => {
    popupToEditAvatar.renderLoading(true);
    api.updateAvatar(data.link)
    // В случае положительного ответа с сервера содержимое этого ответа кладем в нужное место в DOM
    .then((data) => {
      userInfo.setUserInfo(data);
      popupToEditAvatar.close();
    })
    .catch((err) => console.log(err))
    .finally(() => {
      popupToEditAvatar.renderLoading(false);
    });
  }
});
popupToEditAvatar.setEventListeners();


// Запишем в переменную id текущего пользователя, чтобы использовать его позже при создании карты 
let currentUserId; 


const createCard = (cardData) => {
  const card = new Card(cardData, currentUserId, handlerImageClick, api, '.element-template');
  const cardElement = card.generateCard();
  return cardElement;
}

// Выкладываем начальный массив карт и забираем с сервера информацию о пользователе
const renderInitialData = (cards) => {
  // Вызываем функцию, которая делает запрос к серверу на получение 
  // начальной информации о пользователе и начального массива карточек
  api.getInitialData()
  .then(([user, cards]) => {
    // 1) Берем с сервера и выкладываем в шапку сайта начальную информацию о пользователе:
    userInfo.setUserInfo(user);

    currentUserId = user._id; // Определяем id текущего пользователя

    // 2) Вызываем экземпляры класса Card для каждой карточки из массива  
    cardSection = new Section(
      (cardData) => {
        const cardElement = createCard(cardData)
        return cardElement;
      },
    '.elements'
  )
    cardSection.renderItems(cards);
  })
  .catch(err => console.log(err));
}
 

// Вызываем функцию, которая выкладывает начальный массив карт
renderInitialData();


// Обработчик, который по клику по картинке открывает попап с картинкой
const handlerImageClick = (link, name) => {
  popupWithImage.open(link, name);
} 


const popupWithImage = new PopupWithImage(imagePopup);
popupWithImage.setEventListeners();


///// ВАЛИДАЦИЯ /////
const formEditProfileValidation = new FormValidator(validationConfig, formEditProfile);
formEditProfileValidation.enableValidation();

const formAddCardValidation = new FormValidator(validationConfig, formAddCard);
formAddCardValidation.enableValidation();

const formEditAvatarValidation = new FormValidator(validationConfig, formEditAvatar);
formEditAvatarValidation.enableValidation();


export { currentUserId, handlerImageClick };












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
