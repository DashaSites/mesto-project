import { nameInput, jobInput } from './constants.js';
import { user } from '../index.js';

const config = {
    baseUrl: 'https://nomoreparties.co/v1/plus-cohort-20',
    headers: {
        authorization: '267cd1fa-32e1-4a1f-90f0-4ec82620b415',
        'Content-Type': 'application/json'
    }
}

// Проверяем в универсальной для всех промисов функции, что ответ успешный, и если да, то 
// вернем инфу, сконвертированную из JSON-строки в объект. Иначе отменим промис и покажем сообщение об ошибке
const getResponseData = (res) => {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
}

// Добавим универсальную функцию с проверкой ответа, чтоб не дублировать потом эту проверку в каждом фетче
function request(url, options) {
    // Принимает два аргумента: урл и объект опций, как и `fetch`
    return fetch(url, options).then(getResponseData)
  }


// Получаем с сервера начальные данные о пользователе
export const getCurrentUser = () => {
    return request(`${config.baseUrl}/users/me`, {
        headers: config.headers
    })
}


// Загружаем начальные карточки с сервера
export const getInitialCards = () => {
    return request(`${config.baseUrl}/cards`, {
        headers: config.headers
    })
}

export const getInitialData = () => {
    return Promise.all([getCurrentUser(), getInitialCards()]);
}


// Сохраняем на сервере отредактированные данные профиля - ФОРМА/ПОПАП
export const updateUserInfo = (user) => {
    return request(`${config.baseUrl}/users/me`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            name: user.name,
            about: user.about
          })
    })
}


// Добавляем на сервер новую карточку (загружаем ее из попапа-2) - ФОРМА/ПОПАП
export const createCardOnServer = (newCard) => { 
    return request(`${config.baseUrl}/cards`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({
            name: newCard.name,
            link: newCard.link
          })
    })
}


// Запрос на удаление карточки
export const deleteCardOnServer = (id) => {
    return request(`${config.baseUrl}/cards/${id}`, {
        method: 'DELETE',
        headers: config.headers
    })
}


// Обновление аватара пользователя - ФОРМА/ПОПАП
export const updateAvatar = (link) => {
    return request(`${config.baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            avatar: link
          })
    })
}


// Поставить лайк карточке
export const likeCard = (id) => {
    return request(`${config.baseUrl}/cards/likes/${id}`, {
        method: 'PUT',
        headers: config.headers
    })
}


// Убрать лайк с карточки
export const unlikeCard = (id) => {
    return request(`${config.baseUrl}/cards/likes/${id}`, {
        method: 'DELETE',
        headers: config.headers
    })
}




