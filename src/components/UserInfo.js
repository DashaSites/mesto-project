export default class UserInfo {
    constructor( { userNameSelector, userJobSelector, userAvatarSelector, userIdSelector } ) {
        this._userNameElement = document.querySelector(userNameSelector);
        this._userJobElement = document.querySelector(userJobSelector);
        this._userAvatarElement = document.querySelector(userAvatarSelector);
        this._userIdElement = document.querySelector(userIdSelector);
    }


    // Устанавливает данные пользователя, получая их от сервера
    setUserInfo( { name, about, avatar, _id } ) {
      this._name = name;
      this._about = about;
      this._avatar = avatar;
      this._id = _id;

      this._userNameElement.textContent = this._name;
      this._userJobElement.textContent = this._about;
      this._userAvatarElement.style.backgroundImage = `url(${this._avatar})`
    }


    // Возвращает данные пользователя 

    getUserInfo() {
      return {
        name: this._userNameElement.textContent,
        about: this._userJobElement.textContent
      }
    }

    // Записываю передаваемые данные пользователя в соответствующие селекторы
    /*
    getUserInfo( { name, about } ) { 
      this._userNameElement.textContent = name;
      this._userJobElement.textContent = about;

      //this._userAvatarElement.style.backgroundImage = avatar;

      // Сохраняю эти значения в свойства объекта this, чтобы к ним можно было отдельно обратиться
      this._name = this._userNameElement.textContent;
      this._about = this._userJobElement.textContent;
    }
    */

    getUserName() {
      return this._userNameElement.textContent;
    }

    getUserAbout() {
      return this._userJobElement.textContent
    }
}
