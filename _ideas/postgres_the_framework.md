# Intro

So, you've heard of postgres; it's broadly talked about as a transactional SQL datastore.

However, I think it's more accurately described as a framework for creating datastores.

# Postgres, the storage framework

The reason I make this distinction is that postgres is designed for extension developers to easily add new behavior.

There are several things PG does to make this easier, including:

 * Extension hooks at many different levels of abstraction
  * E.G. C, PL/SQL, V8, engines
  * Can trivially define (e.g.) a complex number type (the docs use C but inline SQL is also fine)
 * Referential transparency
  * Having defined a complex number type, we get array[complex] for free
  * We get hash indexes for free
  * Replication works normally
  * You can use it in an expression and index the result
  * Once we define (< = >) for the type we get btree indexing for free.
  * Define (compare extractValue extractQuery consistent) we get GIN indexes
  * If we define (same consistent union penalty picksplit compress decompress) we can use GIST indexes
  * If we define `distance` the GIST index can be used for sorting

The practical upshot of all this is that lots of extensions are available and there is not a huge barrier to writing your own.

# Postgres is amazing

I'm going to point to `postgres is your friend` here.
If you haven't read that you should go and read it first and then come back.

# Postgis

Postgis defines a suite of types and functions for spatial analysis.

The underlying implementations are drawn from open source libraries (primarily geos + gdal), which are also embedded in the RGeo gem (which means you can use ruby to do all the same calculations)
Spatial data can be expressed in many formats (e.g. WKT, GeoJson) and in many frames of reference (SRID).

# Spatial frames of reference

Not all spatial data is stored as lat/lng pairs.
As an example, 4326 is the 'australian mainland' SRID. (0,0) is in the NT.

This is important because many calculations treat the world as a flat surface.
Although this method is much faster, the results become increasingly distorted the closer they are to the north/south pole if you represent data as lat/lng pairs.

Representing data relative to the centre of Australia means that this distortion effect is significantly weakened (to about 5% between north QLD and south TAS, instead of 35%).

# Point distance - accuracy vs performance

So, there are several ways to calculate how far apart two lat/lng points are.
The simplest is to take the cartesian distance (via pythagoras).
This is inaccurate (the earth is curved, not flat) and gives results in a useless unit (radians around the earths surface).

A more accurate calculation is given by projecting the points onto the surface of a sphere, then finding the distance around the sphere.
This is mathematically more intensive, but for a single pair of points quite cheap.

Yet more accuracy is given by treating the earth as a bulging sphere (the spin of the earth causes the equator to be thicker). This is slower again.

# polygon distance

Polygon distance is similar to point distance except you have a lot more points.
This means that the more accurate (slower) methods of calculation are much slower.
How slow? Finding the closest 20 polygons to a point takes about 2 seconds on my computer.
I believe this is inherent to the problem (2nd order integrals performed over thousands of records)

# Putting it together

Postgis lets you slice & dice spatial data with methods like
`intersect`, `union`, `distance_between` and `buffer`. It also provides
conversion functions like `to_geojson`
