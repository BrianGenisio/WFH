#<< app/models/*

class DaysAtHome extends Parse.Collection
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
  add_unique: (item) ->
    existing_items = @where objectId: item.objectId
    return if existing_items.length
    @add item

  fetch_today: =>
    @query = new Parse.Query app.models.DayAtHome
    @query.greaterThanOrEqualTo "start", @start_of_today()
    @query.lessThanOrEqualTo "start", @start_of_tomorrow()
    @fetch()