'use strict';

function $(id) {
  return document.getElementById(id);
}

Object.prototype.hide = function () {
  this.style.display = "none";
}

Object.prototype.show = function () {
  this.style.display = "inherit";
}

var Category = function (id, name, description) {
  this.id = id;
  this.name = name;
  this.description = description;

  this.getName = function() {
  	return this.name;
	}

	this.getDescription = function() {
  	return this.description;
	}

	this.getId = function () {
  	return this.id;
	}
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

  this.getId = function() {
    return this.id;
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
      if (this.container[i][subject] == value) {
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
	  document.getElementById('preContent').style.display = "none";
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
  new User(1, [{id: 1, progress: 50}, {id: 2, progress: 30}], 'qwerty', '123456'),
  new User(2, [{id: 2, progress: 60}, {id: 3, progress: 90}], 'login', '123456'),
  new User(3, [{id: 1, progress: 20}, {id: 3, progress: 30}], 'qazwsx', '123456')
]);

var LoginInitialization = function(loggedUser) {
  this.user = loggedUser;

  this.initialize = function() {
    this.setWelcomeLabel(this.user);
    this.showDashboard();
  }

  this.setWelcomeLabel = function(user) {
    WELCOME_PANEL.getElementsByTagName('span')[0].textContent = 'Welcome, ' + user.login + '!';
    WELCOME_PANEL.show();
  }

  this.showDashboard = function () {
    DASHBOARD_TAB.show();
  }
}

var CoursesHandler = function() {
  this.generateCoursesOverview = function(user, callback) {
    COURSES_TAB.innerHTML = "";

    var categories = user.getUserCategories();
    var coursesBlock = document.createElement('div');
    for (var i = 0 ; i < categories.length; i++) {
      coursesBlock.appendChild(this.createNodeForCategory(CategoriesCollection.findBy('id', categories[i].id), callback));
    }

    COURSES_TAB.appendChild(coursesBlock);
  }

  this.createNodeForCategory = function(category, callback) {
    var listElement = document.createElement('div');
    listElement.className = 'category';
    listElement.dataset.categoryId = category.getId();
    listElement.textContent = category.getName();
    listElement.addEventListener('click', callback);
    listElement.className = 'clickable';
    return listElement;
  }
}


var CategoryHandler = function (category) {
  this.category = category;

  this.createCategoryPage = function (user) {
    var categoryTab = document.createElement('div');
    var header = document.createElement('h2');
    header.textContent = this.category.getName();
    var description = document.createElement('p');
    description.textContent = this.category.getDescription();

    var progress = document.createElement('progress');
    progress.max = 100;
    var userCategories = user.getUserCategories();
    for (var i = 0; i < userCategories.length; i++) {
      if (this.category.getId() === userCategories[i].id) {
        progress.value = userCategories[i].progress;
      }
    }

    categoryTab.appendChild(header);
    categoryTab.appendChild(description);
    categoryTab.appendChild(progress);

    return categoryTab;
  }
}

var BackArrowManager = function (backArrowNode) {
  this.backArrow = backArrowNode;
  this.history = [];

  this.addToHistory = function (callback) {
    if (callback !== this.history[this.history.length - 1]) {
      this.history.push(callback);
    }
    this.checkState();
  }

  this.goBack = function () {
    if (this.history.length) {
      var callback = this.history.pop();
      callback();
    }
    this.checkState();
  }

  this.checkState = function () {
    if (this.history.length) {
      backArrowNode.show();
    } else {
      backArrowNode.hide();
//	document.getElementById('notLoggedYet').style.display = "block";
//	document.getElementById('notLoggedYet').style.visibility = "visible";
    }
  }

  this.checkState();
}

function hideTabs() {
  var contentElements = CONTENT_BLOCK.querySelectorAll('#content > *:not([id=back_arrow])')
  contentElements.forEach(function (elem) {
    elem.hide();
  });
}

//GLOBAL DOM ELEMENTS
var LOGIN_FORM = $('logForm');
var WELCOME_PANEL = $('welcomePanel');
var DASHBOARD_TAB = $('mainshit');
var TEAM_TAB = $('teamPage');
var ABOUT_TAB = $('aboutPage');
var COURSES_TAB = $('coursesPage');
var CONTENT_BLOCK = $('content');
var BACK_ARROW = $('back_arrow');
var COURSES_BUTTON = $('courses');
var TEAM_BUTTON = $('team');
var ABOUT_BUTTON = $('about');
var LOGOUT_BUTTON = $('signOut');
var MENU_COURSES = $('coursesSide');
var MENU_TEAM = $('teamSide');
var MENU_ABOUT = $('aboutSide');
var NOT_LOGGED_YET = $('notLoggedYet');

showDashboard();
function showDashboard () {
  hideTabs();
  DASHBOARD_TAB.show();
}

var backArrowManager = new BackArrowManager(BACK_ARROW);
var loggedUser = null;
(function (){
  var loggedUserId = localStorage.getItem('loggedUserId');
  if (null !== loggedUserId) {
    loggedUser = usersCollection.findBy('id', loggedUserId);
  }

  if (null !== loggedUser) {
    LOGIN_FORM.hide();
    var loginInitialization = new LoginInitialization(loggedUser);
    loginInitialization.initialize();
  } else {
	document.getElementById('preContent').style.visibility = "visible";
    hideTabs();
  }
})();

LOGOUT_BUTTON.addEventListener('click', function () {
  localStorage.removeItem('loggedUserId');
  location.reload();
});

BACK_ARROW.addEventListener('click', function() {
  backArrowManager.goBack();
});

LOGIN_FORM.addEventListener('submit', function(event) {
  event.preventDefault();

  var login = this.login.value,
    password = this.password.value;

  if (usersCollection.login(login, password)) {
    var user = usersCollection.findBy('login', login);
    loggedUser = user;
    var loginInitialization = new LoginInitialization(user);
    loginInitialization.initialize();
    localStorage.setItem('loggedUserId', loggedUser.getId());

    this.hide();
  } else {
	document.getElementById('notLoggedYet').style.display = "block";
	document.getElementById('notLoggedYet').style.visibility = "visible";
    alert('Provided credentials are incorrect');
  }
});

COURSES_BUTTON.addEventListener('click', function() {
	var coursesHandler = new CoursesHandler();
	coursesHandler.generateCoursesOverview(loggedUser, function() {
    var categoryId = this.dataset.categoryId;
    var category = CategoriesCollection.findBy('id', categoryId);

    if (null !== category) {
      var categoryHandler = new CategoryHandler(category);
      var categoryTab = categoryHandler.createCategoryPage(loggedUser);
      hideTabs();
      categoryTab.show();
      CONTENT_BLOCK.appendChild(categoryTab);
      backArrowManager.addToHistory(function () {COURSES_BUTTON.click()});
    }
  });
	hideTabs();
  COURSES_TAB.show();
	backArrowManager.addToHistory(showDashboard);
  document.getElementById('preContent').style.display = "none";
});

TEAM_BUTTON.addEventListener('click', function() {
  hideTabs();
  TEAM_TAB.show();
  document.getElementById('preContent').style.display = "none";
  backArrowManager.addToHistory(showDashboard);
});

ABOUT_BUTTON.addEventListener('click', function() {
  hideTabs();
  ABOUT_TAB.show();
  backArrowManager.addToHistory(showDashboard);
  document.getElementById('preContent').style.display = "none";
});

MENU_ABOUT.addEventListener('click', function () {
  ABOUT_BUTTON.click();
});

MENU_TEAM.addEventListener('click', function () {
  TEAM_BUTTON.click();
});

MENU_COURSES.addEventListener('click', function () {
  COURSES_BUTTON.click();
});