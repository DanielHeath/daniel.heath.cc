# Intro
So, postgres is a database that does SQL.
I'm talking about it because it adds a huge amount of useful stuff
on top of SQL and knowing about it can save you heaps of work.

I'm going to start with things which lots of databases do and then
move into the really amazing stuff.

# Basic expectations of a database

## Transaction
You can start doing something, then decide that
it's a bad idea and roll back your changes.
Either everything works or nothing works (no partial changes).
This makes your system easier to reason about.

## Atomic (updates can't fail part-way through & leave data broken)
Mongo & MyISAM both fail at this

## Consistent (I can't commit changes which aren't valid)
Postgres lets you make something invalid as long as it's fixed before you commit.

## Isolated (I won't see partly-finished changes from someone else)
Mongo & MyISAM both fail at this

## Durable (Once I insert something it's not going to vanish)
Mongo guarantees nothing

## Referential integrity
You can setup pg so it refuses to insert child records for a
has_many relationship unless the master record exists.
This is handy because then you know that data can *never* break
your expectations, even after it's been running for years.

# Convenient stuff

Next I'm going to talk about things which you could do long-hand
but postgres provides convenience methods for.

## Delayed constraints
You can temporarily break the rules you've set inside a transaction
as long as you stop breaking them before you `commit`

## UUID columns
Sometimes you want to use a UUID (big, random number) as an ID
instead of using a counter. Usually that means generating your
own UUIDs in your app; postgres can do it for you.

## Arrays and hashes in your columns
Sometimes you don't want to use a 'proper' schema; maybe
you're still experimenting to find out what works. Postgres
lets you create array and hash columns so you can store (e.g.) tags
without having to create a separate table.

    A @> B   A contains all of B
    A && B   A overlaps any of B
    can use to indicate entire hierarchy
    Rails 4+ convert array columns to ruby arrays correctly
    Rails 4+ convert hstore to hash correctly

## XML in your columns
It'll refuse to insert anything which isn't valid XML.
Bonus: You can use XPATH in your queries to find records
which contain certain XML content.
I've found this handy when writing a CMS.

# Indexing, Lookup & Performance

## 'find similar' indexing (nearest-neighbor)
If there's a way to describe how similar two things are as a number,
like points on a map, or words ('eggs' and 'legs' are more similar
than 'eggs' and 'booze'), postgres can be setup to find the most
similar items *really fast*
<-> | GIN | GIST

## Fulltext search
Some apps need fulltext search but running a separate search engine
is hard. You can use TO_TSVECTOR and TO_TSQUERY to run reasonably
good quality text search.
Create a GIN index on TO_TSVECTOR() to make it super fast.

## Indexes on function results
Other databases don't do this. It's basically the best thing ever.

## Partial / where indexes
You can create an index with a where constraint (which can make the
index really small / efficient).

## Extensions
There are lots of postgres extensions to add handy stuff.

### V8
Write queries in javascript, run them on the database server.
I take no responsibility for this having terrible results.

Javascript isn't even the only language; you can run ruby or
python in postgres if you're keen.

### Postgis
If you need to do anything relating to lat/lng or geographical areas,
postGIS is not only the best free tool, it's better than most of the
paid ones.

## Replication
If your database server is having trouble handling the load
you need, postgres has really high-quality replication.
This lets you run lots of database servers to off-load some processing.

## Child tables
create table parentTable (id varchar);
create table childTable (childField text) inherits (parentTable);
insert into childTable(id, childField) values ('child 1', 'hi there');
select * from parentTable
-> 'child 1'
select * from childTable
-> 'child 1', 'hi there'

## Partitioning
If you're doing multitenancy and have loads of data
you can make a child table which is just for one client.
If you have a check constraint the query planner will only search that table.

## Extensible types
Writing new types is actually pretty easy.
This lets you do things like define how comparisons should work.

## Foreign tables
You can query (and join to) tables that aren't even in postgres
by telling postgres how to connect to another database server.

## RDS & Heroku
Amazon offer hosted postgres now, so you get backups & admin handled for you.
