export default class UserInfo {
    constructor( { userNameSelector, userJobSelector } ) {
        this._userNameElement = document.querySelector(userNameSelector);
        this._userJobElement = document.querySelector(userJobSelector);
    }

    // Записываю передаваемые данные пользователя в соответствующие селекторы
    getUserInfo( { name, about } ) { 
      this._userNameElement.textContent = name;
      this._userJobElement.textContent = about;

      // Сохраняю эти значения в свойства объекта this, чтобы к ним можно было отдельно обратиться
      this._name = this._userNameElement.textContent;
      this._about = this._userJobElement.textContent;
    }

    getUserName() {
      return this._name;
    }

    getUserAbout() {
      return this._about;
    }
}
