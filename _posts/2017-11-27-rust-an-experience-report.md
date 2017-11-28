---
layout: post
title: Rust: An experience report

excerpt: Rust is very promising but easy to bounce off.
         I've decided to start logging my attempts to use it here.
---

# Learning rust: an experience report

## Installing

Installing the latest version of rust via `brew` worked correctly first time.

## Finding a tutorial

Searched for "getting started with rust".

 * [Google for 'getting started rust'](https://doc.rust-lang.org/book/first-edition/getting-started.html)
 * [DuckDuckGo for 'getting started rust'](https://doc.rust-lang.org/book/getting-started.html)

Google found the first edition of the tutorial.
DuckDuckGo found the tutorial landing page, which suggested I used the second edition but anyone on google would've been unaware it existed.

I used [the second edition](https://doc.rust-lang.org/book/second-edition/).

## Using the tutorial

The tutorial suggested using rustup to install, using `curl | sh`.
I decide it's probably safe to ignore that advice and use the version from my package manager (`rustc 1.21.0`).

The first example (hello world) works fine.
The second example (guessing game) doesn't compile.
The error linked me to issue #27703.

I manage to figure out that rust issues are tracked on github (the error just has an issue number), and find that issue.
It's clearly related, but tells me nothing I can use to get my code compiling.

A bit of searching turns up [a stackoverflow question on the topic](https://stackoverflow.com/questions/19671845/how-can-i-generate-a-random-number-within-a-range-in-rust#19674981);
the top answer is outdated, but a comment tells me
to check a different answer, which tells me to
use `extern crate rand;` and add dependencies to cargo.toml.

After reading up how to add dependencies to cargo.toml, I update the file and try again.
Cargo spends twenty-four minutes 'updating registry' (I want one small dependency and have specified the exact version!). My connection is slow, but it's not *that* slow.
Activity monitor confirms it's downloading at 20kb/s - everything else is fine).
Perhaps it would help if the default registry were installed at the same time as cargo?

Now the guessing game example runs - great!
I test out the example and it works.
In doing so, I (incidentally) notice that backtraces don't have line numbers (!). Close enough for now - I'll have another look next week or something.


