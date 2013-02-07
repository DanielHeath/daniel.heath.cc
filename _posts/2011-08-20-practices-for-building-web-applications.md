---
layout: post
title: Practices for building web applications

excerpt: A few high-level points about the best ways I've found to do web development.
---

I've been building web applications for a year or so now.
In this article I plan to share a few high-level points about the best ways I've found to do it.

## Keep your tools up to date
When I started, the toolchain was crude; even basic things like asset packaging and testing were DIY.
In a stunningly short period, the space has grown like crazy.

This means that webapp development has (much) bigger rewards than other environments for upgrading regularly.

## It's still software development
Javascript is code. Markup is code. CSS is code. Keep your code well-factored.

## Quirks mode sucks
Make sure your html is valid - [quirks](https://developer.mozilla.org/en/mozilla_quirks_mode_behavior) mode introduces weird bugs and impacts rendering performance.

## Be aware of globals
I generally store all the classes in my app on one global (eg window.myApp.models.Blogs) to avoid namespace pollution.

## Encapsulate
It's really easy to end up with spaghetti code in a browser environment. Don't do it. Keep your html templates, css fragments and javascript classes as small as sensibly possible, then concatenate them programatically.

For example, the following dialog HAML gets its own file:
    .dialogHeader
      .header
        %span.close X
        %h3= heading()
    .content
      .places.column
        .filter
          %label Place
          %input{type: "text"}
          %button Search
        .results

All of these fragments are available to javascript code, which can add them to the DOM.

## Never store data in the DOM
Avoid using your view layer to store anything, or changes to the presentation will cause code elsewhere to break in unpredictable ways.

Easily broken code:
    reviewDroppedOn: (destination, draggedReview) ->
      review={}
      review.title = draggedReview.find(".name").html()
      review.detail = draggedReview.find(".detail").html()
      review.detail = draggedReview.find(".summary").html()
      review.type = draggedReview.find(".review_type").attr("class")
      review.href = draggedReview.data("href")
      @addNewItem(destination, @newReviewHtml(review))


One exception to this is storing references from a DOM node back to the object which generated it.
This is useful enough to be worth the risk.

A better version:
    reviewDroppedOn: (destination, draggedReview) ->
      review = $(draggedReview).data('view')?.model
      @addNewItem(destination, @newReviewHtml(review))
