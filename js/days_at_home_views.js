(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  app.templates.add_me = '\n<a href="#" id="working_from_home"><%= name ? name + " is" : "I am" %> working from home</a><br>\n<% if(name) { %><a href="#" id="not_me">(Not <%= name %>?)</a><% } %>\n';

  app.templates.show_record = '\n<%= name %>\n<a href="#">X</a>\n';

  app.templates.who_are_you = '\n<p>Wait.  Who are you?\n<input type="text"></input>\n<input type="submit"></input></p>\n';

  app.views.AddMe = (function() {

    __extends(AddMe, Backbone.View);

    function AddMe() {
      this.working_from_home = __bind(this.working_from_home, this);
      this.set_user = __bind(this.set_user, this);
      this.user = __bind(this.user, this);
      this.render_who_are_you = __bind(this.render_who_are_you, this);
      this.not_me = __bind(this.not_me, this);
      this.i_am_working_from_home = __bind(this.i_am_working_from_home, this);
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      AddMe.__super__.constructor.apply(this, arguments);
    }

    AddMe.prototype.template = _.template(app.templates.add_me);

    AddMe.prototype.who_are_you_template = _.template(app.templates.who_are_you);

    AddMe.prototype.events = {
      "click #working_from_home": "i_am_working_from_home",
      "click #not_me": "not_me"
    };

    AddMe.prototype.initialize = function() {
      return this.render();
    };

    AddMe.prototype.render = function() {
      $(this.el).html(this.template({
        name: this.user()
      }));
      return this;
    };

    AddMe.prototype.i_am_working_from_home = function(e) {
      e.preventDefault();
      if (this.user()) {
        return this.working_from_home(this.user());
      } else {
        return this.render_who_are_you();
      }
    };

    AddMe.prototype.not_me = function(e) {
      e.preventDefault();
      this.set_user(null);
      return this.render();
    };

    AddMe.prototype.render_who_are_you = function() {
      var _this = this;
      $(this.el).html(this.who_are_you_template());
      return this.$(":submit").bind("click", function() {
        var name;
        name = _this.$(":input").val();
        _this.set_user(name);
        _this.working_from_home(name);
        return _this.render();
      });
    };

    AddMe.prototype.user = function() {
      return $.cookie("user");
    };

    AddMe.prototype.set_user = function(name) {
      return $.cookie("user", name, {
        expires: 365
      });
    };

    AddMe.prototype.working_from_home = function(name) {
      return this.model.at_home_today(name);
    };

    return AddMe;

  })();

  app.views.ListRecords = (function() {

    __extends(ListRecords, Backbone.View);

    function ListRecords() {
      this.render_record = __bind(this.render_record, this);
      this.render = __bind(this.render, this);
      ListRecords.__super__.constructor.apply(this, arguments);
    }

    ListRecords.prototype.tagName = 'ul';

    ListRecords.prototype.className = "recordList";

    ListRecords.prototype.initialize = function() {
      this.model.bind("reset", this.render);
      this.model.bind("add", this.render_record);
      return this.render;
    };

    ListRecords.prototype.render = function() {
      $(this.el).html("");
      this.model.each(this.render_record);
      return this;
    };

    ListRecords.prototype.render_record = function(record) {
      var new_item, new_view;
      new_view = new app.views.ShowRecord({
        model: record
      });
      new_item = new_view.render().el;
      $(this.el).append(new_item);
      $(new_item).hide();
      return $(new_item).fadeIn();
    };

    return ListRecords;

  })();

  app.views.ShowRecord = (function() {

    __extends(ShowRecord, Backbone.View);

    function ShowRecord() {
      this.remove = __bind(this.remove, this);
      this.render = __bind(this.render, this);
      ShowRecord.__super__.constructor.apply(this, arguments);
    }

    ShowRecord.prototype.tagName = 'li';

    ShowRecord.prototype.template = _.template(app.templates.show_record);

    ShowRecord.prototype.events = {
      "click a": "remove"
    };

    ShowRecord.prototype.initialize = function() {
      return this.model.bind("change", this.render);
    };

    ShowRecord.prototype.render = function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    };

    ShowRecord.prototype.remove = function() {
      var _this = this;
      this.model.destroy({
        success: function() {
          return _this.model.unbind();
        }
      });
      return $(this.el).fadeOut();
    };

    return ShowRecord;

  })();

}).call(this);