Sume = {
  start: function() {
    new Sume.SearchRouter();
  }
}

Sume.SearchController = {
  search: function(term) {

  }
}


Sume.SearchRouter = Backbone.Router.extend({
  routes: {
    'search/:term' : 'search'
  },

  initialize: function() {
    console.log(this);
    new Sume.SearchView({router: this})
  },

  search: function(term) {
    Sume.SearchController.search(term)
  }
})

Sume.SearchView = Backbone.View.extend({
  autocomplete_data: ["ActiveSupport::Concern"],

  el: '#search',
  events: {
    'keypress' : 'search'
  },

  initialize: function() {
    this.router = this.options.router;
    $(this.el).focus()
  },

  search: function() {
    this.router.navgiate('/search/' + $('#search').val())
  }
})

$(document).ready(function (e) {
  Sume.start();
})
