---
layout: post
title: Tools for building web applications

excerpt: A few tools I've found useful developing web applications.
---

I've been building web applications for a year or so now.
In this article I plan to share a few tools I've found useful.

## Have a solid asset pipeline
In development, assets should be served via something that compiles them on-the-fly.
Compilation failures need to be really obvious.
You should never have to worry about whether you're looking at the latest version.

Being stuck on rails 2.3.x for the moment, I am using [Barista](https://github.com/Sutto/barista) (gem install barista).
Note that this solution can often end up serving outdated files (in development; production has been rock solid)

The sprockets-based pipeline in Rails 3.1beta is a far superior solution if you have the option of running the latest version.

## Frameworks can save you a lot of time
I use and recommend [coffeescript](http://jashkenas.github.com/coffee-script/), [jQuery](http://jquery.com/), [underscore.js](http://documentcloud.github.com/underscore/), [backbone.js](http://documentcloud.github.com/backbone/) and [haml.js](https://github.com/creationix/haml-js/).

For example (using all of them at once):

    class BB.views.RichText extends Backbone.View
      template: JST['rich_text_editing']

      initialize: (options) ->
        @model.bind "change", @render
        _.extend(BB.Wysiwyg) # Import rich text editing module

      render: =>
        e = $(@el)
        e.html @template(this)
        e.data('view', this)
        this

## Testing
I plan to write an entire post on how I approach testing this kind of app.
For the moment let me say that having a solid test suite will save you a heap of time.
I use [jasmine.js](http://pivotal.github.com/jasmine/) for my suite, along with the matchers from the [jQuery-jasmine](https://github.com/velesin/jasmine-jquery) plugin.

For example:
    describe "PhoneNumber", ->
      beforeEach ->
        @phone = new BB.models.PhoneNumber

      describe "isBlank", ->
        it "is true if text and number are blank", ->
          @phone.set(text: "", number: "")
          expect(@phone.isBlank()).toEqual true

## Use JSON for transport
There are a few ways to get data from a server to a client:

#### HTML
It's really convenient for the first week or three, but it gets very, very painful as complexity grows. Don't do it.

#### XML
You'll have to write something to serialize/deserialize your data on the client, which is extra maintenance effort.
Not bad otherwise.

Our apps used to do this - there was pages of dense parsing code.

#### JSON
This is really the best way to go - most of the strengths of XML without writing a line of code.
The general pattern is:

    updateContentFromUrl:(url) ->
      self = this
      @get(url, (parsedJsonForContent) ->
        model = new BB.models.Content(parsedJsonForContent)
        view = new BB.views.ContentView(model: model)
        self.element.find(".results").append view.render().el
      )

