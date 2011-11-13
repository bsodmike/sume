Sume = {
  start: function() {
    new Sume.SearchRouter();
  }
}

Sume.SearchResult = Backbone.Model.extend({})
Sume.SearchResultList = Backbone.Collection.extend({
  model: Sume.SearchResult
})
Sume.searchResults = new Sume.SearchResultList()

Sume.SearchEngine = {
  locations: { "ActiveSupport::Concern": "ActiveSupport/Concern.html",
               "distance_of_time_in_words": "ActionView/Helpers/DateHelper/distance_of_time_in_words.html",
               "find": "ActiveRecord/FinderMethods/find.html",
               "ActiveRecord::FinderMethods.find": "ActiveRecord/FinderMethods/find.html" },
  search: function() {
    $('#search_autocomplete').hide();
    term = $.trim($('#search_autocomplete li.active').text())
    $.get(this.locations[term], function(html) {
      $('#docs').html(html)
    })
  }
}

Sume.AutoCompleteController = {
  autocomplete_data: ["ActiveSupport::Concern",
                      "distance_of_time_in_words",
                      "find"],

  fuzzies: [/[A-Z]\w+\.find/],
  fuzzy_matches: ["ActiveRecord::FinderMethods.find"],

  search: function(term) {
    $('#search_autocomplete').show()
    $('#search_autocomplete').empty()
    var results = $.grep(this.autocomplete_data, function(element) {
      return element.search(new RegExp(term, "i")) != -1;
    })

    var fuzzy_results = $.grep(this.fuzzies, function(fuzzy_key) {
      return term.match(fuzzy_key)
    })

    for (var key in fuzzy_results) {
      index = $.inArray(fuzzy_results[key], this.fuzzies)
      fuzzy_results[key] = this.fuzzy_matches[index]
    }

    results = results.concat(fuzzy_results)


    $.each(results, function (index, term) {
      Sume.searchResults.add({term : term})
    })

    $('#search_autocomplete li').first().addClass('active')
  }
}

Sume.SearchResultsView = Backbone.View.extend({
  el: '#search_autocomplete',

  initialize: function() {
    Sume.searchResults.bind('add', this.renderItem, this)
  },

  renderItem: function(model) {
    var view = new Sume.SearchResultView({model : model, router: this.options.router})
    $(this.el).append(view.el)
  }
})

Sume.SearchResultView = Backbone.View.extend({
  tagName: 'li',

  events: {
    'hover': 'makeActive',
    'click': 'retrieve'
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
    $(this.el).siblings('.active').removeClass('active')
    $(this.el).addClass('active')
  },

  retrieve: function() {
    Sume.SearchEngine.search();
  }
})

Sume.SearchRouter = Backbone.Router.extend({

  routes: {
    'autocomplete/:term' : 'autocomplete'
  },

  initialize: function() {
    new Sume.SearchView({router : this})
    new Sume.SearchResultsView({router: this});
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
    if ($(this.el).val().length > 2) {
      this.router.navigate('autocomplete/' + $(this.el).val(), true)
    }
  }
})

$(document).keydown(function(e){
  if (e.keyCode == 13) {
    Sume.SearchEngine.search();
  }

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
