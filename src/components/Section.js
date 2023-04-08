export default class Section {
    constructor(renderer, containerSelector) {
        this._renderer = renderer;
        this._containerElement = document.querySelector(containerSelector);
    }

    addItem(element) { // Вставляю в контейнер готовый DOM-элемент
        this._containerElement.prepend(element);
    }

    renderItems(items) { // Сюда передаю массив карточек, которые придут с сервера:
        // сырые карточки, которые надо преобразовать в объекты класса Card, а из них уже
        // получить DOM-элементы. И эти DOM-элементы последовательно передать в addItem
        items.reverse().forEach(item => {
            const element = this._renderer(item);
            this.addItem(element);
        });
    }
}