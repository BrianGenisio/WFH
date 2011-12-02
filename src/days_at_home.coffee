class app.models.DayAtHome extends Backbone.ParseModel
  urlRoot: "/data/DayAtHome"
  
class app.collections.DaysAtHome extends Backbone.ParseCollection
  model: app.models.DayAtHome
  url: "/data/DayAtHome"

  start_of_today: ->
    now = new Date()
    new Date(now.getFullYear(), now.getMonth(), now.getDate())

  start_of_tomorrow: ->
    today = @start_of_today()
    oneDay = 24 * 60 * 60 * 1000
    new Date(today.getTime() + oneDay)

  at_home_today: (name) =>
    @create name: name, start: @start_of_today()

  fetch_today: =>
    @fetch query: 
      start: 
        "$gte": @start_of_today()
        "$lte": @start_of_tomorrow()


  

  