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
  

  // Проверяем на всякий случай, вдруг все инпуты формы - пустые
  const hasNotInputValues = (inputList) => {
    return inputList.every(inputElement => {
      return inputElement.value.length === 0;
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
  const toggleButtonState = (formElement, inputList, submitButtonSelector, disabledButtonClass) => {
    
    // Создадим переменную для кнопки сабмита в форме (в той форме, с которой сейчас работаем):
    const buttonElement = formElement.querySelector(submitButtonSelector);
  
    // Если из всех полей данной формы какое-то сейчас невалидно или если все поля формы пустые - то дизейблим кнопку сабмита
    if (hasInvalidInput(inputList) || hasNotInputValues(inputList)) {
      disableSubmitButton(buttonElement, disabledButtonClass);
    } else {
    // В противном случае - активируем кнопку сабмита
      enableSubmitButton(buttonElement, disabledButtonClass);
    }
  };
  
  
  // Слушатель всех событий. В нем объявлены 2 функции, которые и исполняются:
  const setEventListeners = (formElement, inputSelector, submitButtonSelector, inputErrorClass, errorClass, disabledButtonClass) => {
    
    // Слушатель сабмита формы
    formElement.addEventListener('submit', (event) => {
      // Отменяем действие сабмита по умолчанию
      event.preventDefault();
  
      // Когда произошел сабмит формы, дизейблим кнопку сабмита
      toggleButtonState(formElement, inputList, submitButtonSelector, disabledButtonClass);
    });
  
    // Создадим массив из коллекции всех полей формы, и запишем его в переменную inputList:
    const inputList = Array.from(formElement.querySelectorAll(inputSelector));
      
    // Переберем массив инпутов методом forEach, и по каждому инпуту пройдемся слушателем события инпута:
    inputList.forEach(inputElement => {
      inputElement.addEventListener('input', () => {
        // Для каждого инпута вызовем функцию checkInputValidity (она объявлена выше),
        // и вызовем функцию-переключатель состояния кнопки сабмита формы (объявлена выше)
        checkInputValidity(formElement, inputElement, inputErrorClass, errorClass);
        toggleButtonState(formElement, inputList, submitButtonSelector, disabledButtonClass);
      });
    });
    
    toggleButtonState(formElement, inputList, submitButtonSelector, disabledButtonClass);
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