(function () {

  var sections = document.querySelectorAll('.form__section');
  var app = document.querySelector('.app');
  var appHeading = app.querySelector('.app__heading');
  var appNavigation = app.querySelector('.app__navigation');
  var resultSections = appNavigation.querySelectorAll('.js-from-section-result');

  var Label = {
    'city': 'Your city',
    'home-type': 'Home type',
    'move-in': 'Move-in',
    'duration': 'Lease term',
    'budget': 'Budget'
  };

  var Active = {
    'city': 'Find another home',
    'home-type': 'Select home type',
    'move-in': 'Change move-in date',
    'duration': 'Change stay time',
    'budget': 'Vary budget limits'
  };

  var June = {

    currentIndex: 0,
    nextIndex: 0,
    activeResult: null,
    clickFromResult: false,
    errorMessage: null,

    nextButton: app.querySelector('.js-btn-next'),

    nextButtonClickHandler: function (evt) {

      evt.preventDefault();

      // Current Section Index
      var i = June.currentIndex;

      // If validation passed get Current Section input with value
      var el = June.validateInputs(sections[i]);

      if (el) {
        var inputObj = June.makeResultObject(el);

        // Checks if result of current section already exists
        if (!June.isResultExists(i)) {

          // Make a readonly input with value of current section data
          var result = June.renderResult(inputObj);

            // Show element if form
          June.showResult(result, i);

          June.resultButtonClickHandler(result, i);

        } else {
          // If result exists
          // Update changed values in results

          resultSections[i].querySelector('input').value = inputObj.value;
          June.removeActiveResult();
        }

        June.goToNextSection();
      }
      // If validation not passed
      return false;
    },

    makeResultObject: function (el) {
      var input = {
        name: el.name,
        id: el.id,
      }
      if (el.nodeName === 'SELECT') {
        input.value = el.selectedOptions[0].value;
      } else {
        input.value = el.value;
      }
      return input;
    },

    showResult: function (result, i) {
      resultSections[i].classList.add('fade-in');
      resultSections[i].appendChild(result);
    },

    getErrorMsg: function () {
      if(!this.errorMessage) {
        var el = document.createElement('p');
        el.style.color = 'red';
        el.textContent = 'Please, select something';
        el.classList.add('form__error');
        this.errorMessage = el;
      }
      return this.errorMessage;
    },

    showNavigation: function() {
      appNavigation.classList.remove('u-hidden');
      appNavigation.classList.add('fade-in');
    },

    validateInputs: function(section) {
      var errorMessage = this.getErrorMsg();
      var currentError = section.querySelector('.form__error');
      if (currentError) {
        section.removeChild(currentError);
      }

      var inputs = section.querySelectorAll('.js-input');

      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type === 'radio' && inputs[i].checked) {
          return inputs[i];
        }
        if ((inputs[i].type === 'text' || inputs[i].type === 'date'
        || inputs[i].type === 'email') && inputs[i].value) {
          return inputs[i];
        }

        if (inputs[i].nodeName === 'SELECT' && inputs[i].selectedOptions[0].value) {
          return inputs[i];
        }
      }

      section.appendChild(errorMessage);
      return false;
    },

    goToNextSection: function () {

      var i = this.currentIndex;

      console.log('this.currentIndex: ' + this.currentIndex);
      console.log('this.nextIndex: ' + this.nextIndex);

      console.log('this.clickFromResult: ' + this.clickFromResult);

      if (i === 0 && appNavigation.classList.contains('u-hidden')) {
        this.showNavigation();
      }

      if (i === sections.length - 2) {
        this.goToFinalSection();
      }

      this.hideCurrentSection();

      if (!this.clickFromResult) {
        this.nextIndex = this.currentIndex + 1;
      } else {
        this.clickFromResult = false;
        // this.currentIndex = this.nextIndex;
      }

      this.showSection(this.nextIndex);

      this.currentIndex = this.nextIndex;
    },

    hideCurrentSection: function () {
      sections[this.currentIndex].classList.add('u-hidden');
    },

    showSection: function (index) {
      setTimeout (function () {
        sections[index].classList.remove('u-hidden');
        sections[index].classList.add('fade-in');
      }.bind(this), 300);
    },

    goToSection: function(index) {

      this.currentIndex = index;

      // If current section has not passed validation, return to it on next hop
      if (!this.validateInputs(sections[this.currentIndex])) {
        this.nextIndex = this.currentIndex;
      }

      sections[this.currentIndex].classList.add('u-hidden');

      setTimeout (function () {
        sections[index].classList.remove('u-hidden');
        sections[index].classList.add('fade-in');
      }, 300);

    },

    goToFinalSection: function () {
      app.classList.add('fade-out');

      setTimeout(function () {
        June.nextButton.classList.add('u-hidden');
        appHeading.classList.add('u-hidden');
        app.classList.add('u-hidden');
        appNavigation.querySelector('.form__legend').classList.remove('u-hidden');

        // Clone navigation to remove all handlers

        var newAppNavigation = appNavigation.cloneNode(true);
        app.removeChild(appNavigation);
        app.appendChild(newAppNavigation);
      }, 100);

      setTimeout(function () {
        app.classList.add('fade-in');
        app.classList.remove('fade-out');
        app.classList.remove('u-hidden');
      }, 300);

    },

    renderResult: function (obj) {
      var template = document.querySelector('#js-field-result').content.querySelector('.form__field-chosen');
      var el = template.cloneNode(true);
      var label = el.querySelector('label');
      var input = el.querySelector('input');
      label.textContent = Label[obj.name];
      label.htmlFor = obj.id + '-result';
      input.name = obj.name;
      input.value = obj.value;
      input.id = obj.id + '-result';
      return el;
    },

    isResultExists: function (index) {
      var result = appNavigation.querySelectorAll('.form__field-chosen')[index];
      return result;
    },

    setActiveResult: function (button, index) {
      button.classList.add('form__field-chosen--active');
      var span = document.createElement('span');
      span.classList.add('form__field-chosen-span');
      var type = button.querySelector('input').name;
      span.textContent = Active[type];
      button.appendChild(span);

      // if(this.clickFromResult) {
      //   resultSections[index].querySelector('input').value = input.value;
      // }

      this.activeResult = button;
      this.currentIndex = index;
      this.clickFromResult = true;
    },

    removeActiveResult: function () {
      var active = this.activeResult;
      if (active) {
        var span = active.querySelector('.form__field-chosen-span');
        active.removeChild(span);
        active.classList.remove('form__field-chosen--active');
        this.activeResult = null;
        sections[this.currentIndex].classList.add('u-hidden');
      }
    },

    resultButtonClickHandler: function (button, index) {
      button.addEventListener('click', function (evt) {
        evt.preventDefault();

        if (index === June.currentIndex) {
          return false;
        }

        June.hideCurrentSection();

        if (June.activeResult) {
          June.removeActiveResult();
        }
        June.setActiveResult(button, index);
        June.goToSection(index);
      });
    }
  };

  window.onload = function () {
    June.nextButton.addEventListener('click', June.nextButtonClickHandler);
  };

})();
