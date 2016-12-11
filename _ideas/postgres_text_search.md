# Introduction to text-search with postgres

## Glossary / examples

### Lexeme
A basic unit of meaning.

If your search term was `shopping`, the relevant lexeme would be `shop`.
Similarly, the lexeme for `skiing` is `ski`.

Postgres search works by converting your data into the TSVECTOR type (which is list of lexemes & the positions they appear in).

### TSQuery (Text Search Query)

An expression in the postgres text-search language.

For example, `fat & (rat | cat)` will match documents which refer to fat rats or fat cats.

These matches are scored for sorting (`fat foo bar rat` will match, but produce a lower score than `fat rat`).

### Stemming
Postgres assumes that anything ending in `-ing` is a verb.
If you search for `epping`, it assumes you want things related to `ep`.

The process of removing irrelevant parts of the word is called 'stemming'.

## Using text-search

* Create an index (using `GIST`) on `to_tsvector(your_textsearch_column)`
* Convert your search term to a TSQuery with `to_tsquery` (or `plainto_tsquery` if you don't want the query language)
* Filter results to 'things which match at all', then sort (don't sort the whole resultset!).

### Example:
~~~
select
  *,
  ts_rank_cd(my_vector, my_query)
from
  mytable
where
  my_vector @@ my_query
order by
  ts_rank_cd(my_vector, my_query) desc
limit 10
offset 10
~~~

### Proper Nouns

Sometimes (e.g. suburb names) you don't want postgres to stem the words (`epping` is not similar to `ep`).
To do this, you'll need to setup an alternative search configuration.

~~~
CREATE TEXT SEARCH DICTIONARY public.proper_noun (
    TEMPLATE = pg_catalog.simple
);
CREATE TEXT SEARCH CONFIGURATION proper_noun (
    COPY = simple
);

ALTER TEXT SEARCH CONFIGURATION proper_noun
ALTER MAPPING
REPLACE simple WITH proper_noun;

select to_tsvector('proper_noun', 'epping');
~~~

## Putting it all together

~~~
CREATE TABLE texts (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    description character varying(255) NOT NULL
);

CREATE INDEX fulltext
ON texts USING gin (to_tsvector('english', description));

insert into texts (description)
values ('the quick brown fox jumped over the lazy dog');

insert into texts (description)
values ('the early bird gets the worm');

insert into texts (description)
values ('not the bees!!!');

insert into texts (description)
values ('the birds and the bees');

insert into texts (description)
values ('beep... beep... beep... beep... - Sputnik');

select to_tsvector(description) from texts;
select to_tsquery('''bees'':*');

select
  description,
  ts_rank(to_tsvector('english', description), to_tsquery('''bees'':*'))
from texts
where
  to_tsvector('english', description) @@ to_tsquery('''bees'':*')
;

~~~
