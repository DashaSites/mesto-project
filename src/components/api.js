import { nameInput, jobInput } from '../index.js';
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


// Получаем с сервера начальные данные о пользователе
export const getCurrentUser = () => {
    return fetch(`${config.baseUrl}/users/me`, {
        headers: config.headers
    })
    .then((res) => getResponseData(res))
    .catch((err) => console.log(err));
}


// Загружаем начальные карточки с сервера
export const getInitialCards = () => {
    return fetch(`${config.baseUrl}/cards`, {
        headers: config.headers
    })
    .then((res) => getResponseData(res))
    .catch((err) => console.log(err))
}

export const getInitialData = () => {
    return Promise.all([getCurrentUser(), getInitialCards()]);
}


// Сохраняем на сервере отредактированные данные профиля
export const updateUserInfo = (user) => {
    return fetch(`${config.baseUrl}/users/me`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            name: user.name,
            about: user.about
          })
    })
    .then((res) => getResponseData(res))
    .catch((err) => console.log(err));
}


// Добавляем на сервер новую карточку (загружаем ее из попапа-2)
export const createCardOnServer = (newCard) => {
    return fetch(`${config.baseUrl}/cards`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({
            name: newCard.name,
            link: newCard.link
          })
    })
    .then((res) => getResponseData(res))
    .catch((err) => console.log(err));
}


// Запрос на удаление карточки
export const deleteCardOnServer = (id) => {
    return fetch(`${config.baseUrl}/cards/${id}`, {
        method: 'DELETE',
        headers: config.headers
    })
    .then((res) => getResponseData(res))
    .catch((err) => console.log(err))
}


// Обновление аватара пользователя
export const updateAvatar = (link) => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            avatar: link
          })
    })
    .then((res) => getResponseData(res))
    .catch((err) => console.log(err));
}


// Поставить лайк карточке
export const likeCard = (id) => {
    return fetch(`${config.baseUrl}/cards/likes/${id}`, {
        method: 'PUT',
        headers: config.headers
    })
    .then((res) => getResponseData(res))
    .catch((err) => console.log(err));
}


// Убрать лайк с карточки
export const unlikeCard = (id) => {
    return fetch(`${config.baseUrl}/cards/likes/${id}`, {
        method: 'DELETE',
        headers: config.headers
    })
    .then((res) => getResponseData(res))
    .catch((err) => console.log(err));
}




