Sume = {
  start: function() {
    new Sume.SearchRouter();
  }
}

Sume.SearchController = {
 search: function(term) {

 }
}

Sume.SearchResult = Backbone.Model.extend({})
Sume.SearchResultList = Backbone.Collection.extend({
  model: Sume.SearchResult
})
Sume.searchResults = new Sume.SearchResultList()

Sume.SearchController = {
  search: function(term) {
  }
}

Sume.AutoCompleteController = {
  locations: { "ActiveSupport::Concern": "ActiveSupport/Concern.html" },
  autocomplete_data: ["ActiveSupport::Concern",
                      "distance_of_time_in_words",
                      "dandilions"],

  search: function(term) {
    $('#search_autocomplete').empty()
    var results = $.grep(this.autocomplete_data, function(element) {
      return element.indexOf(term) != -1;
    })


    $.each(results, function (index, term) {
      Sume.searchResults.add({term : term})
    })
  }
}

Sume.SearchResultsView = Backbone.View.extend({
  el: '#search_autocomplete',

  initialize: function() {
    Sume.searchResults.bind('add', this.renderItem, this)
  },

  renderItem: function(model) {

    var view = new Sume.SearchResultView({model : model})
    $(this.el).append(view.el)
  }
})

Sume.SearchResultView = Backbone.View.extend({
  tagName: 'li',

  events: {
    'hover': 'makeActive'
  },

  initialize: function() {
    this.template = _.template($('#autocompleteTemplate').html())
    this.render()
  },

  render: function() {
    var html = this.template({model : this.model.toJSON()})
    $(this.el).append(html)
  },

  makeActive: function() {
    $(this.el)
  }
})

Sume.SearchRouter = Backbone.Router.extend({

  routes: {
    'search/:term' : 'search',
    'autocomplete/:part' : 'autocomplete'
  },

  initialize: function() {
    new Sume.SearchView({router : this})
    new Sume.SearchResultsView();
  },

  search: function(term) {
    Sume.SearchController.search(term)
  },

  autocomplete: function(term) {
    Sume.AutoCompleteController.search(term)
  }
})

Sume.SearchView = Backbone.View.extend({

  el: '#search',
  events: {
    'keyup' : 'autocomplete',
  },

  initialize: function() {
    $(this.el).focus()
    this.router = this.options.router
  },

  autocomplete: function(e) {
    this.router.navigate('autocomplete/' + $(this.el).val(), true)
    if (e.keycode == 13) {
      this.router.navigate('search/' + $(this.el).val(), true);
    }
  }
})

$(document).keydown(function(e){
  if (e.keyCode == 38) {
    element = $('ul#search_autocomplete .active')
    if (element.length > 0) {
      previous = element.prev('li')
      if (previous.length > 0) {
        element.removeClass('active')
        previous.addClass('active')
      }
    }
    else {
      console.log($('ul#search_autocomplete li').first())
      $('ul#search_autocomplete li').first().addClass('active')
    }
    return false;
  }
  else if (e.keyCode == 40) {
    element = $('ul#search_autocomplete .active')
    if (element.length > 0) {
      next = element.next('li')
      if (next.length > 0) {
        element.removeClass('active')
        element.next('li').addClass('active')
      }
    }
    else {
      console.log($('ul#search_autocomplete li').first())
      $('ul#search_autocomplete li').first().addClass('active')
    }
    return false;
  }
});

$(document).ready(function (e) {
  Sume.start();
})
