# What is RGeo

RGeo is a rubygem, written as a native extension.

It depends on having the 'geos' package installed.

`require 'rgeo'` provides a ruby wrapper around
all the C methods in the 'geos' package.

# Ok, so what's geos?

[Geos](http://trac.osgeo.org/geos/) (Geometry Engine - Open Source) is an
open-source library in C++ which implements most of the spatial operations
in postgis.

In short, geos implements types which represent shapes/points/lines and
algorithms which calculate e.g. distance between two geometries.

# How is it used in Atlas?

Atlas uses it to support encoding/decoding data from the database, and to
generate geojson for the front-end.
