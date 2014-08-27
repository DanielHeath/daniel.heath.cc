---
layout: post
title: Postgres features for Ruby developers

excerpt: A quick run-through of postgres features for Ruby developers
---

## About postgres

Postgres is a relational database which is
widely used by Ruby developers.

For instance, it's the default database for Heroku (a popular
hosting provider for Ruby apps).

Like most databases, postgres uses standard SQL.
It also offers many features which
are not available in most other databases.

I'm going to provide a high-level overview of features
here without providing much detail.
If you have questions, the [online documentation for postgres](http://www.postgresql.org/docs/current/static/sql.html) is
comprehensive, useful, and up to date.

## Overview of Features

### UUID columns

By default, Rails gives you tables with an integer ID.
This ID is always generated when you create a new
record - you can't specify the value for a new records ID.

Postgres supports using a Universally Unique ID (UUID) instead.

UUIDs look like this: `93743318-67f4-4c29-8ba0-5ba4f667c7b2`.

This can be a useful alternative because it lets you specify
the ID, but will still generate an ID if you don't specify one.

### Text Search

Some apps need fulltext search, but running a separate search engine
is hard. Postgres has a reasonably good quality text-search engine built in.

You'll need to spend some time perusing the documentation to use this - every
app is different and you'll need to configure the search to suit your needs.

### Spatial data

One of the most commonly used extensions to postgres is called PostGIS.
This lets you store geographic data (e.g. points or areas on a map).

You can then write queries to find (e.g.) what's
within 10km of this point, with the closest points first.

### Scaling

Most web applications using postgres will have one server
dedicated to running postgres, with other servers running
the web application.

As the amount of data you're dealing with increases,
the database server can become overloaded.

There are three common approaches to avoiding this:

#### Throw money at it

The easiest answer is usually "buy more ram/CPU/disk".

#### Partitioning via Child Tables

Partitioning lets you use multiple servers, storing part of your data on each of them.

This technique helps you scale a database which is overloaded
due to too many `update`, `delete` & `insert` commands.

For instance, all records where the `name` field starts from A through F
will go to one server, G through P to a second, and the remainder to a third.

You can achieve this using a feature called child tables (the documentation has good examples).

#### Replication

Replication lets you use multiple servers, storing all of your data on each of them.
Only one of the servers is allowed to handle `update`, `insert` or `delete` queries.

This technique helps you scale a database which is overloaded
due to too many `select` queries running at once.

It is also good because each server has a full copy of the database,
meaning that if the primary database fails, you can
quickly switch to one of the replica servers.

Most modern databases, including Postgres, have good
support for replication.

### Arrays and Hashes and JSON, oh my! (XML too)

#### Arrays

A column in an SQL table has a type (e.g. string, integer, timestamp).
Postgres also lets you can create a column which stores an array of
strings, or timestamps, or any other type (even arrays of arrays!).

If you're using Rails with ActiveRecord, these arrays
work like normal Ruby arrays.

#### Hashes (via HSTORE)

Similarly to arrays, you can store hashes like `{'foo' => 'bar', 'k' => 'v'}`
This works like a normal Ruby hash through ActiveRecord, except you can
only use strings for the keys and values.

#### JSON

Postgres has a JSON type which can store any JSON value.
ActiveRecord makes this work nicely with Ruby (with caveats;
it can't tell that the JSON has changed when
you modify part of a nested structure).

You can query your JSON data using postgres built-in functions.

#### XML

The XML type will stop you from accidentally storing something which
is not valid XML. This is better than just using a string field, as
you can be sure that the data you have stored is valid XML.

You can query your XML data using XPATH selectors.

### Stored procedures

Postgres lets you create stored procedures (functions written in SQL).

You can write these functions in other languages if you have the right
extensions installed; for instance, the V8 Postgres extension lets you
write stored procedures in Javascript. There is also a Ruby extension.

Writing stored procedures in Javascript is clearly a good idea which
will not upset your teammates.

### Indexing

Big database tables can be hundreds of gigabytes, and it can take a long
time to scan through all that data to find the record you're looking for.

An index is a much smaller file which can be scanned quickly and tells
the database where to find the records which match a query.

Practically all databases support some kind of indexing.

#### Partial indexes

Unlike other databases, postgres lets you create an index with a
`where` condition (e.g. `create index (...) where (condition)`).

This means that the index file can be even smaller and quicker to use.

#### Expression indexes

Postgres also allows you to create an index on any expression (not just a column).
This means you can do things like `create index index_name on table_name ( to_uppercase(description) )`

### DDL Transactions

This feature protects you when running migrations.

In other databases, if a migration fails part-way through, the database
can be left half-way between the old state and the new state. Postgres
stops this from happening - migrations either succeed completely, or
do nothing at all.

### Constraints & Deferred constraints

Many databases support constraints (like validations built into the database).

However, they are often hard to use because they can't be broken, even temporarily.

Postgres supports `deferred` constraints, which only apply when you commit a transaction.
This makes constraints far more usable with Rails.

### Foreign Tables

Foreign tables let you run join queries against tables which are in
a totally different database (e.g. MySql or any JDBC database).

Handy when dealing with really big, organically grown systems.
