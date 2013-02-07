---
layout: post
title: Testing web applications

excerpt: A description of how I test my work.
---

As a followup to my last post - a description of how I test my work.

## What do you need out of a webapp test suite

Must haves:

  * Run tests in a real browser
  * Inspect test state using a debugger to track down the reason for failures

Nice to have:

  * Run your entire suite fast (See next post)
  * When you save a spec file, it runs and pops up a notification with the result (See next post)
  * When you save a code file, it runs the associated test and pops up a notification with the result
  * Run specific tests

## Setting up the basics
To get started testing, I've found jasmine.js is pretty awesome.
You should be able to get up and running with it fairly quickly; I've found the following approach works well:

 * Write a hello world spec that has one failing and one passing test
 * Put it in `spec/jasmine/hello_world_spec.coffee`
 * I've got a very simple `spec_controller.rb`, which
   * Is only available when RAILS_ENV is development
   * Serves up [an html page](/examples/jasmine_runner.html.erb.txt) with
     * jasmine and jasmine-html
     * All the javascript for my app (except the application starter file)
     * Test-specific css styles
     * DOM fixtures
     * The actual test
  * Here's the html.erb template I use:

 * Serve spec files out of /spec when your app is in development mode.
 * Run specs by visiting `http://localhost/spec?spec_file=hello_world_spec`
 * You can now run the specs manually; a good start
 * I use [a capybara script](/examples/jasmine_runner.rake.txt) in a rake task to run the specs in CI.

## Next time
* How to set up phantomjs, autotest (with growl/libnotify) to run your tests
* My textmate bundle for jasmine / coffeescript development
