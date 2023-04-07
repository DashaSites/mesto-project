import { buttonEditProfileOpen, buttonAddCardOpen, buttonEditAvatar, popupElements, formEditProfile, formAddCard, formEditAvatar, profileName, profileOccupation, userAvatar, initialCards, validationConfig, nameInput, jobInput, imagePopup, cardsContainer, popupInputTitle, popupInputLink } from './components/constants.js'
import { handleButtonEditAvatar, submitFormEditAvatar } from './components/modal.js';
//import { openPopup, closePopup } from './components/utils.js';
import Api from './components/Api.js';
import FormValidator from './components/FormValidator.js';
import Card from './components/Card.js';
import Section from './components/Section.js';
import Popup from './components/Popup.js';
import PopupWithImage from './components/PopupWithImage.js';
import PopupWithForm from './components/PopupWithForm.js';

const api = new Api({
  baseUrl: 'https://nomoreparties.co/v1/plus-cohort-20',
  headers: {
      authorization: '267cd1fa-32e1-4a1f-90f0-4ec82620b415',
      'Content-Type': 'application/json'
  }
});

///// РАБОТА С ПОПАПАМИ /////

// Слушатель кликов по кнопке редактирования профиля
buttonEditProfileOpen.addEventListener('click', () => {
  handleButtonEditProfileOpen();
});

// Открываем попап редактирования профиля
const handleButtonEditProfileOpen = () => {
  const popupToEditProfile = new PopupWithForm('.popup_type_edit-profile', submitFormEditProfile); 
  popupToEditProfile.open();
  popupToEditProfile.setEventListeners();

  nameInput.value = profileName.textContent;
  jobInput.value = profileOccupation.textContent; 
}

// 1) ЗДЕСЬ ИСПОЛЬЗУЕМ РЕЗУЛЬТАТ ПРОМИСА
// Обработчик отправки формы редактирования профиля
const submitFormEditProfile = (event) => {

  const user = {};
  user.name = nameInput.value;
  user.about = jobInput.value;

  api.updateUserInfo(user) // Рендерим ответ, который мы получили от сервера, заменив на нем методом PATCH данные пользователя 
  // (мы вставляем эти данные в шапку из попапа)
  .then((user) => {
      profileName.textContent = user.name;
      profileOccupation.textContent = user.about;
  })
  .catch((err) => console.log(err));
}


// Слушатель кликов по кнопке добавления новой карточки
buttonAddCardOpen.addEventListener('click', () => {
  handleButtonAddCardOpen();
});

const handleButtonAddCardOpen = () => {
  const popupToAddCard = new PopupWithForm('.popup_type_add-card', submitFormAddCard);
  popupToAddCard.open();
  popupToAddCard.setEventListeners();
}

// 3) ЗДЕСЬ ИСПОЛЬЗУЕМ РЕЗУЛЬТАТ ПРОМИСА
// Обработчик сабмита формы с новой карточкой
const submitFormAddCard = (event) => {
  // ГДЕ-ТО ЗДЕСЬ ПРОБЛЕМА, ИЗ-ЗА КОТОРОЙ ГРУЗЯТСЯ СРАЗУ 2 КАРТОЧКИ
  const newCard = {}; // Создаю объект для передачи на сервер двух его свойств
  newCard.name = popupInputTitle.value;
  newCard.link = popupInputLink.value;

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

/*
// ТАК КУСОК ВЫШЕ РАБОТАЛ ДО ООП:
      const addedCard = new Card(res, currentUserId, handlerImageClick);
      const addedCardElement = addedCard.generateCard();
      cardsContainer.prepend(addedCardElement); // добавляю в DOM
*/
  })
  .catch((err) => console.log(err));
}






// Слушатель кликов по кнопке, открывающей попап редактирования аватара
buttonEditAvatar.addEventListener('click', handleButtonEditAvatar);


// Обработчики одновременно оверлея и крестиков всех попапов:
// Используя универсальные классы этих элементов, пробегаемся по ним всем, 
// навешиваем обработчики и закрываем тот попап, на который нажали 
/*
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
*/

// Слушатель кликов по кнопке "Сохранить" в попапе редактирования профиля
//formEditProfile.addEventListener('submit', submitFormEditProfile);


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

    // 1) Берем с сервера и отрисовываем (выкладываем) начальную информацию о пользователе:
    profileName.textContent = user.name; // имя
    profileOccupation.textContent = user.about; // род занятий
    currentUserId = user._id; // определяем id текущего пользователя
    userAvatar.style.backgroundImage = `url(${user.avatar})`; // аватар текущего пользователя


    // 2) ВЫЗЫВАЕМ ЭКЗЕМПЛЯРЫ КЛАССА CARD ДЛЯ КАЖДОЙ КАРТОЧКИ ИЗ МАССИВА

    /*
    ТАК РАБОТАЛО ДО ООП:
    // 2) Выкладываем начальный массив карточек, берем его с сервера
    cards.forEach((initialCard) => {
       cardsContainer.append(createCard(initialCard.link, initialCard.name, initialCard.likes, initialCard.owner._id, initialCard._id, currentUserId, toggleLike ));
    });
    */
    
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
 

////////// ВЫЗОВЫ ФУНКЦИЙ //////////

// Вызываем функцию выкладывания начального массива
renderInitialCards();


// Обработчик, который по клику по картинке открывает попап с картинкой
const handlerImageClick = (link, name) => { 
  // Вместо вот этого кода ниже — вызвать экземпляр класса PopupWithImage
  const popupWithImage = new PopupWithImage('.popup_type_large-image', link, name);
  popupWithImage.open();
  popupWithImage.setEventListeners();
}



// ВАЛИДАЦИЯ:
const formEditProfileValidation = new FormValidator(validationConfig, formEditProfile);
formEditProfileValidation.enableValidation();

const formAddCardValidation = new FormValidator(validationConfig, formAddCard);
formAddCardValidation.enableValidation();

const formEditAvatarValidation = new FormValidator(validationConfig, formEditAvatar);
formEditAvatarValidation.enableValidation();


export { currentUserId, api, handlerImageClick };