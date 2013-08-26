---
layout: post
title: Learning Go

excerpt: Musings on a new language
---

I've been using Go fulltime for ~9 months now.

The big differences I've noticed coming from Ruby:

## Imports

Imports can't clobber the global namespace or change the behavior of other packages (unless those packages were designed to allow it).

Only types/methods that are exported by a package are available when you import it.

## Static language
There's no monkey patching.
When writing packages, export interfaces, not types (to make testing possible).

## Composition, not inheritance
Go has no classes. Group data together using structs.

Any type can have methods. E.G.

 	type Foo string
 	func(f Foo) Print() { fmt.Println(f) }
 	Foo("a string").Print() # Prints "a string"

 	type Bar struct { str string }
 	func(b Bar) Print() { fmt.Println(b.str) }
 	Bar{"A different string"}.Print() # Prints "A different string"

Important differences moving from ruby to go:
* Code re-use via composition feels very natural coming from ruby.
 * Where you would have used a module Foo in ruby, embed an interface Foo in go.

* Because imports can't interfere with one another, many small dependencies is not a problem. Compose your app from many small frameworks rather than using one large one.

* Monitoring is back in the dark ages (No newrelic). Plan accordingly.
