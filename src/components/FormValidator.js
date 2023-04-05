export default class FormValidator {
  constructor(config, formElement) {
    this._formSelector = config.formSelector;
    this._inputSelector = config.inputSelector;
    this._submitButtonSelector = config.submitButtonSelector;
    this._disabledButtonClass = config.disabledButtonClass;
    this._inputErrorClass = config.inputErrorClass;
    this._errorClass = config.errorClass;

    this._formElement = formElement;
    // Вынесла константу inputList из массива всех полей данной формы (раньше она определялась в функции setEventListeners) в конструктор:
    this._inputList = Array.from(this._formElement.querySelectorAll(this._inputSelector));
  }


  // Добавим невалидные стили и сообщение об ошибке (если инпут невалиден)
  _showInputError = (inputElement, errorElement) => {
    // Добавляем стили ошибки для инпута
    inputElement.classList.add(this._inputErrorClass);
    // В спан ошибки кладем сообщение об ошибке
    errorElement.textContent = inputElement.validationMessage;
    // Делаем спан ошибки видимым
    errorElement.classList.add(this._errorClass);
  };


  // Скроем сообщение об ошибке и невалидные стили
  _hideInputError = (inputElement, errorElement) => {
    // Убираем стили невалидного инпута
    inputElement.classList.remove(this._inputErrorClass);
    // Делаем спан с ошибкой невидимым
    errorElement.classList.remove(this._errorClass);
    // Вытираем сообщение об ошибке (если оно было)
    errorElement.textContent = '';
  };


  // Проверяем инпут на валидность. Эту функцию мы вызываем для каждого инпута в функции setEventListeners ниже
  _checkInputValidity = (inputElement) => {
  
    // Объявляем переменную, кладем в нее сообщение об ошибке и используем ее дальше:
    const errorElement = this._formElement.querySelector(`#${inputElement.id}-error`);

    if (inputElement.validity.patternMismatch) {
      // встроенный метод setCustomValidity принимает на вход value data-атрибута из инпута
      // это value мы вытаскиваем из html-атрибута, используя здесь ключевое слово dataset
      inputElement.setCustomValidity(inputElement.dataset.errorMessage);
    } else {
      // если передать пустую строку, то будут доступны
      // стандартные браузерные сообщения
      inputElement.setCustomValidity("");
    }


    // Прогонии инпут через условную конструкцию. Если он невалиден, то в специальной функции добавим ему стиль невалидного + покажем сообщение об ошибке
    if (!inputElement.validity.valid) {
      this._showInputError(inputElement, errorElement, this._inputErrorClass, this._errorClass);
      // Если жи инпут валиден, то вызовем другую функцию, где не будет невалидного стиля и сообщения об ошибке
    } else {
      this._hideInputError(inputElement, errorElement, this._inputErrorClass, this._errorClass);
    }
  };


  // Проверяем, есть ли в форме хотя бы один невалидный инпут
  _hasInvalidInput = () => {
    return this._inputList.some(inputElement => {
    // Пройдемся методом some по массиву инпутов и проверим, вернется ли хотя бы для одного инпута данной формы значение "невалидно":
    return !inputElement.validity.valid;
    });
  };


  // Дизейблим кнопку сабмита:
  _disableSubmitButton = (buttonElement) => {
    // Добавляем кнопке класс модификатора, который ее отключает
    buttonElement.classList.add(this._disabledButtonClass);
    buttonElement.disabled = true;
  };


  // Активируем кнопку сабмита:
  _enableSubmitButton = (buttonElement) => {
    // Удаляем с кнопки класс модификатора, который ее дизейблил
    buttonElement.classList.remove(this._disabledButtonClass);
    buttonElement.disabled = false;
  };


  // Переключатель состояния кнопки сабмита:
  _toggleButtonState = (buttonElement) => {

    // Если из всех полей данной формы какое-то сейчас невалидно - то дизейблим кнопку сабмита
    if (this._hasInvalidInput(this._inputList)) {
      this._disableSubmitButton(buttonElement, this._disabledButtonClass);
    } else {
    // В противном случае - активируем кнопку сабмита
      this._enableSubmitButton(buttonElement, this._disabledButtonClass);
    }
  };


  // Слушатель всех событий. В нем объявлены 2 функции, которые и исполняются:
  _setEventListeners = () => {

    // Сразу как попали в форму, создаем переменную для кнопки сабмита в ней (в той форме, с которой сейчас работаем):
    const buttonElement = this._formElement.querySelector(this._submitButtonSelector);

    // Деактивируем кнопку при 1й загрузке сайта
    this._disableSubmitButton(buttonElement, this._disabledButtonClass);

    // Обработчик события reset, которым я в index.js сбрасываю поля формы (formAddCard) при ее сабмите
    // А тут я при событии reset заодно дизейблю кнопку
    this._formElement.addEventListener('reset', () => {
      this._disableSubmitButton(buttonElement, this._disabledButtonClass);
    });

    // Слушатель сабмита формы
    this._formElement.addEventListener('submit', (event) => {
    // Отменяем действие сабмита по умолчанию
      event.preventDefault();
    });
    
    // Переберем массив инпутов методом forEach, и по каждому инпуту пройдемся слушателем события инпута:
    this._inputList.forEach(inputElement => {
      inputElement.addEventListener('input', () => {
      // Для каждого инпута вызовем функцию checkInputValidity (она объявлена выше),
      // и вызовем функцию-переключатель состояния кнопки сабмита формы (объявлена выше)
        this._checkInputValidity(inputElement);
        this._toggleButtonState(buttonElement);
      });
    });
  
    this._toggleButtonState(buttonElement);
  }


  // Создаем функцию, которая будет валидировать все формы. В объекте config передадим в нее все селекторы, которые потом будем использовать при валидации
  // После того как объявим ее и другие функции валидации, вызовем ее в файле index.js
  enableValidation = () => {
    this._setEventListeners(
      this._formElement,
      this._inputSelector,
      this._submitButtonSelector,
      this._inputErrorClass,
      this._errorClass,
      this._disabledButtonClass
    );
  }
}









/*

// ВАЛИДАЦИЯ ВСЕХ ФОРМ

// Добавим невалидные стили и сообщение об ошибке (если инпут невалиден)
const showInputError = (inputElement, errorElement, inputErrorClass, errorClass) => {
    // Добавляем стили ошибки для инпута
    inputElement.classList.add(inputErrorClass);
    // В спан ошибки кладем сообщение об ошибке
    errorElement.textContent = inputElement.validationMessage;
    // Делаем спан ошибки видимым
    errorElement.classList.add(errorClass);
  };
  
  
  // Скроем сообщение об ошибке и невалидные стили
  const hideInputError = (inputElement, errorElement, inputErrorClass, errorClass) => {
    // Убираем стили невалидного инпута
    inputElement.classList.remove(inputErrorClass);
    // Делаем спан с ошибкой невидимым
    errorElement.classList.remove(errorClass);
    // Вытираем сообщение об ошибке (если оно было)
    errorElement.textContent = '';
  };
  
  
  // Проверяем инпут на валидность. Эту функцию мы вызываем для каждого инпута в функции setEventListeners ниже
  const checkInputValidity = (formElement, inputElement, inputErrorClass, errorClass) => {
    
    // Объявляем переменную, кладем в нее сообщение об ошибке и используем ее дальше:
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);

    if (inputElement.validity.patternMismatch) {
        // встроенный метод setCustomValidity принимает на вход value data-атрибута из инпута
        // это value мы вытаскиваем из html-атрибута, используя здесь ключевое слово dataset
      inputElement.setCustomValidity(inputElement.dataset.errorMessage);
    } else {
        // если передать пустую строку, то будут доступны
        // стандартные браузерные сообщения
      inputElement.setCustomValidity("");
    }
  

    // Прогонии инпут через условную конструкцию. Если он невалиден, то в специальной функции добавим ему стиль невалидного + покажем сообщение об ошибке
    if (!inputElement.validity.valid) {
      showInputError(inputElement, errorElement, inputErrorClass, errorClass);
      // Если жи инпут валиден, то вызовем другую функцию, где не будет невалидного стиля и сообщения об ошибке
    } else {
      hideInputError(inputElement, errorElement, inputErrorClass, errorClass);
    }
  };
  
  
  // Проверяем, есть ли в форме хотя бы один невалидный инпут
  const hasInvalidInput = (inputList) => {
    return inputList.some(inputElement => {
      // Пройдемся методом some по массиву инпутов и проверим, вернется ли хотя бы для одного инпута данной формы значение "невалидно":
      return !inputElement.validity.valid;
    });
  };
  
  
  // Дизейблим кнопку сабмита:
  const disableSubmitButton = (buttonElement, disabledButtonClass) => {
    // Добавляем кнопке класс модификатора, который ее отключает
    buttonElement.classList.add(disabledButtonClass);
    buttonElement.disabled = true;
  };
  
  
  // Активируем кнопку сабмита:
  const enableSubmitButton = (buttonElement, disabledButtonClass) => {
    // Удаляем с кнопки класс модификатора, который ее дизейблил
    buttonElement.classList.remove(disabledButtonClass);
    buttonElement.disabled = false;
  };
  
  
  // Переключатель состояния кнопки сабмита:
  const toggleButtonState = (formElement, inputList, submitButtonSelector, disabledButtonClass, buttonElement) => {
    
    // Создадим переменную для кнопки сабмита в форме (в той форме, с которой сейчас работаем):
    //const buttonElement = formElement.querySelector(submitButtonSelector);
  
    // Если из всех полей данной формы какое-то сейчас невалидно - то дизейблим кнопку сабмита
    if (hasInvalidInput(inputList)) {
      disableSubmitButton(buttonElement, disabledButtonClass);
    } else {
    // В противном случае - активируем кнопку сабмита
      enableSubmitButton(buttonElement, disabledButtonClass);
    }
  };
  
  
  // Слушатель всех событий. В нем объявлены 2 функции, которые и исполняются:
  const setEventListeners = (formElement, inputSelector, submitButtonSelector, inputErrorClass, errorClass, disabledButtonClass) => {

    // Сразу как попали в форму, создаем переменную для кнопки сабмита в ней (в той форме, с которой сейчас работаем):
    const buttonElement = formElement.querySelector(submitButtonSelector);

    // Деактивируем кнопку при 1й загрузке сайта
    disableSubmitButton(buttonElement, disabledButtonClass);

    // Обработчик события reset, которым я в index.js сбрасываю поля формы (formAddCard) при ее сабмите
    // А тут я при событии reset заодно дизейблю кнопку
    formElement.addEventListener('reset', () => {
      disableSubmitButton(buttonElement, disabledButtonClass);
    });

    // Слушатель сабмита формы
    formElement.addEventListener('submit', (event) => {
      // Отменяем действие сабмита по умолчанию
      event.preventDefault();
    });

    // Создадим массив из коллекции всех полей формы, и запишем его в переменную inputList:
    const inputList = Array.from(formElement.querySelectorAll(inputSelector));
      
    // Переберем массив инпутов методом forEach, и по каждому инпуту пройдемся слушателем события инпута:
    inputList.forEach(inputElement => {
      inputElement.addEventListener('input', () => {
        // Для каждого инпута вызовем функцию checkInputValidity (она объявлена выше),
        // и вызовем функцию-переключатель состояния кнопки сабмита формы (объявлена выше)
        checkInputValidity(formElement, inputElement, inputErrorClass, errorClass);
        toggleButtonState(formElement, inputList, submitButtonSelector, disabledButtonClass, buttonElement);
      });
    });
    
    toggleButtonState(formElement, inputList, submitButtonSelector, disabledButtonClass, buttonElement);
  }
  
  
  // Создаем функцию, которая будет валидировать все формы. В объекте config передадим в нее все селекторы, которые потом будем использовать при валидации
  // После того как объявим ее и другие функции валидации, вызовем ее в файле index.js
  export const enableValidation = (config) => {
    // Найдем все формы на странице и соберем эту коллекцию в массив, сохранив его в переменную formList
    const formList = Array.from(document.querySelectorAll(config.formSelector));
    // Пройдем по массиву всех форм методом forEach:
    // Применительно к каждой форме вызовем функцию setEventListeners (то есть навесим на каждую форму обработчик событий)
    // Аргументами в нее передадим (прокинем дальше) все селекторы из конфига
    formList.forEach(formElement => {
      setEventListeners(
        formElement,
        config.inputSelector,
        config.submitButtonSelector,
        config.inputErrorClass,
        config.errorClass,
        config.disabledButtonClass
      );
    });
  }

  */