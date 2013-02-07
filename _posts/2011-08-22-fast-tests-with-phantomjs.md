---
layout: post
title: Fast tests with PhantomJS

excerpt: My setup for running tests quickly
---

date: 22/08/2011

So, I write (and run) javascript tests a lot.

I run javascript specs by serving them as part of a page.
This lets me use the browser tools (debugger/inspector etc)
It also means that the specs are running on the same platform as the code (no bugs that only happen in the specs).

To run these in CI, I wrote a [script using capybara](/examples/jasmine_runner.rake.txt).
It visits the URL for each of the spec files and scrapes the pages to determine success/failure.
However, it was slow - the suite for our app took over 100 seconds.

So I sat down and hacked together [a faster script](/examples/jasmine_runner.coffee.txt).
Rather than completely replacing my CI script, I just got it running a single test file.
This individual specs running about 5 times faster.

Then I realised that without the overhead of loading a firefox instance, there was no reason not to run all the specs in parallel. Some quick shell scripting and I was there:

    find public/spec/integration -iname *.js | grep -v _spec_helper.js | sed s/^public.spec.//g | xargs -L1 -P30 ./lib/tasks/phantom_runner.coffee

Hey presto! the entire suite ran in under 7 seconds, even on my ancient, groaning hardware.

Next, I set up [a textmate bundle](https://github.com/DanielHeath/JasmineCoffee.tmbundle) so I could hit command-R to launch the spec in a browser, and command-D to run it using phantom.
Then, I set up a [Guardfile](/examples/jasmine_runner.guardfile.txt)

Now I'm wondering if I could fork from within PhantomJS to speed things up further - but that's a post for another day.
