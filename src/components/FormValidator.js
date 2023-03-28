export default class FormValidator {
  constructor(config, formElement) {
    this.formSelector = config.formSelector;
    this.inputSelector = config.inputSelector;
    this.submitButtonSelector = config.submitButtonSelector;
    this.disabledButtonClass = config.disabledButtonClass;
    this.inputErrorClass = config.inputErrorClass;
    this.errorClass = config.errorClass;

    this.formElement = formElement;
    // Вынесла константу inputList из массива всех полей данной формы (раньше она определялась в функции setEventListeners) в конструктор:
    this.inputList = Array.from(this.formElement.querySelectorAll(this.inputSelector));
  }


  // Добавим невалидные стили и сообщение об ошибке (если инпут невалиден)
  showInputError = (inputElement, errorElement) => {
    // Добавляем стили ошибки для инпута
    inputElement.classList.add(this.inputErrorClass);
    // В спан ошибки кладем сообщение об ошибке
    errorElement.textContent = inputElement.validationMessage;
    // Делаем спан ошибки видимым
    errorElement.classList.add(this.errorClass);
  };


  // Скроем сообщение об ошибке и невалидные стили
  hideInputError = (inputElement, errorElement) => {
    // Убираем стили невалидного инпута
    inputElement.classList.remove(this.inputErrorClass);
    // Делаем спан с ошибкой невидимым
    errorElement.classList.remove(this.errorClass);
    // Вытираем сообщение об ошибке (если оно было)
    errorElement.textContent = '';
  };


  // Проверяем инпут на валидность. Эту функцию мы вызываем для каждого инпута в функции setEventListeners ниже
  checkInputValidity = (inputElement) => {
  
    // Объявляем переменную, кладем в нее сообщение об ошибке и используем ее дальше:
    const errorElement = this.formElement.querySelector(`#${inputElement.id}-error`);

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
      this.showInputError(inputElement, errorElement, this.inputErrorClass, this.errorClass);
      // Если жи инпут валиден, то вызовем другую функцию, где не будет невалидного стиля и сообщения об ошибке
    } else {
      this.hideInputError(inputElement, errorElement, this.inputErrorClass, this.errorClass);
    }
  };


  // Проверяем, есть ли в форме хотя бы один невалидный инпут
  hasInvalidInput = () => {
    return this.inputList.some(inputElement => {
    // Пройдемся методом some по массиву инпутов и проверим, вернется ли хотя бы для одного инпута данной формы значение "невалидно":
    return !inputElement.validity.valid;
    });
  };


  // Дизейблим кнопку сабмита:
  disableSubmitButton = (buttonElement) => {
    // Добавляем кнопке класс модификатора, который ее отключает
    buttonElement.classList.add(this.disabledButtonClass);
    buttonElement.disabled = true;
  };


  // Активируем кнопку сабмита:
  enableSubmitButton = (buttonElement) => {
    // Удаляем с кнопки класс модификатора, который ее дизейблил
    buttonElement.classList.remove(this.disabledButtonClass);
    buttonElement.disabled = false;
  };


  // Переключатель состояния кнопки сабмита:
  toggleButtonState = (buttonElement) => {

    // Если из всех полей данной формы какое-то сейчас невалидно - то дизейблим кнопку сабмита
    if (this.hasInvalidInput(this.inputList)) {
      this.disableSubmitButton(buttonElement, this.disabledButtonClass);
    } else {
    // В противном случае - активируем кнопку сабмита
      this.enableSubmitButton(buttonElement, this.disabledButtonClass);
    }
  };


  // Слушатель всех событий. В нем объявлены 2 функции, которые и исполняются:
  setEventListeners = () => {

    // Сразу как попали в форму, создаем переменную для кнопки сабмита в ней (в той форме, с которой сейчас работаем):
    const buttonElement = this.formElement.querySelector(this.submitButtonSelector);

    // Деактивируем кнопку при 1й загрузке сайта
    this.disableSubmitButton(buttonElement, this.disabledButtonClass);

    // Обработчик события reset, которым я в index.js сбрасываю поля формы (formAddCard) при ее сабмите
    // А тут я при событии reset заодно дизейблю кнопку
    this.formElement.addEventListener('reset', () => {
      this.disableSubmitButton(buttonElement, this.disabledButtonClass);
    });

    // Слушатель сабмита формы
    this.formElement.addEventListener('submit', (event) => {
    // Отменяем действие сабмита по умолчанию
      event.preventDefault();
    });
    
    // Переберем массив инпутов методом forEach, и по каждому инпуту пройдемся слушателем события инпута:
    this.inputList.forEach(inputElement => {
      inputElement.addEventListener('input', () => {
      // Для каждого инпута вызовем функцию checkInputValidity (она объявлена выше),
      // и вызовем функцию-переключатель состояния кнопки сабмита формы (объявлена выше)
        this.checkInputValidity(this.formElement, inputElement, this.inputErrorClass, this.errorClass);
        this.toggleButtonState(this.formElement, this.inputList, this.submitButtonSelector, this.disabledButtonClass, buttonElement);
      });
    });
  
    this.toggleButtonState(this.formElement, this.inputList, this.submitButtonSelector, this.disabledButtonClass, buttonElement);
  }


  // Создаем функцию, которая будет валидировать все формы. В объекте config передадим в нее все селекторы, которые потом будем использовать при валидации
  // После того как объявим ее и другие функции валидации, вызовем ее в файле index.js
  enableValidation = () => {
    // Найдем все формы на странице и соберем эту коллекцию в массив, сохранив его в переменную formList
    //const formList = Array.from(document.querySelectorAll(config.formSelector));
    // Пройдем по массиву всех форм методом forEach:
    // Применительно к каждой форме вызовем функцию setEventListeners (то есть навесим на каждую форму обработчик событий)
    // Аргументами в нее передадим (прокинем дальше) все селекторы из конфига
    //formList.forEach(formElement => {
      this.setEventListeners(
        this.formElement,
        this.inputSelector,
        this.submitButtonSelector,
        this.inputErrorClass,
        this.errorClass,
        this.disabledButtonClass
      );
    //});
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