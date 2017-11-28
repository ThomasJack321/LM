'use strict';

function $(id) {
  return document.getElementById(id);
}

function Category(id, name) {
  this.id = id;
  this.name = name;
}

var User = function (id, categories, login, password) {
  this.id = id;
  this.categories = categories;
  this.login = login;
  this.password = password;

  this.addCategory = function (categoryId, progress){
    this.categories.push({
      id: categoryId,
      progress: progress
    });
  };

  this.dumpObjectData = function() {
    return {
      id: this.id,
      categories: this.categories,
      login: this.login,
      password: this.password
    };
  };

  this.getUserCategories = function (){
    return this.categories;
  }
}

var Collection = function (itemCollection) {
  this.container = itemCollection;

  this.find = function (id) {
    for(var i = 0; i < this.container.length; i++) {
      if (this.container[i].id === id) {
        return this.container[i];
      }
    }
  }

  this.findBy = function (subject, value) {
    var item = null;
    for(var i = 0; i < this.container.length; i++) {
      if (this.container[i][subject] === value) {
        item = this.container[i];
        break;
      }
    }
    return item;
  }
}

var UsersCollection = function(itemCollection) {
  Collection.call(this, itemCollection);

  this.login = function (login, password) {
    var loggedIn = false;

    var user = this.findBy('login', login);
    if (null !== user && user.password === password) {
      loggedIn = true;
    }

    return loggedIn;
  }
}

var CategoriesCollection = new Collection([
  new Category(1, 'English'),
  new Category(2, 'Math'),
  new Category(3, 'Physics')
]);

var usersCollection = new UsersCollection([
  new User(1, [{id: 1, progress: 0.5}, {id: 2, progress: 0.3}], 'qwerty', '123456'),
  new User(2, [{id: 2, progress: 0.6}, {id: 3, progress: 0.9}], 'login', '123456'),
  new User(3, [{id: 1, progress: 0.2}, {id: 3, progress: 0.3}], 'qazwsx', '123456')
]);

var LOGIN_FORM = $('logForm');
var WELCOME_LABEL = $('welcomeLabel')
var loggedUser = null;

LOGIN_FORM.addEventListener('submit', function(event) {
  event.preventDefault();

  var login = this.login.value,
    password = this.password.value;

  if (usersCollection.login(login, password)) {
    var user = usersCollection.findBy('login', login);
    loggedUser = user;
    var userCategories = user.getUserCategories();

    console.log(user);
    for (var i = 0; i < userCategories.length; i++) {
      console.log(userCategories[i]);
    }
    var loginInitialization = new LoginInitialization(user);
    loginInitialization.initialize();

    this.style.visibility = 'hidden';
  } else {
    console.log('nieprawidlowe dane');
  }

});

var LoginInitialization = function(loggedUser) {
  this.user = loggedUser;

  this.initialize = function() {
    this.hideLoginForm();
    this.dumpWelcomeMessage();
    this.setWelcomeLabel(this.user);
  }

  this.hideLoginForm = function() {
    LOGIN_FORM.style.visibility = 'hidden';
  }

  this.dumpWelcomeMessage = function() {
    alert('You have been logged in.');
  }

  this.setWelcomeLabel = function(user) {
    WELCOME_LABEL.textContent = 'Welcome, ' + user.login + '!';
  }
}



