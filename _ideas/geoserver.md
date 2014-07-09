# What is Geoserver

Geoserver is a java webapp which implements a whole lot of
mapping functionality.

# In Atlas

We run Geoserver in Atlas to serve map tiles out of our postgis database.

## Configuration

Geoserver configuration is via a directory full of XML files.

Due to the complexity of this configuration, I've just jammed
the entire config directory into source control under config/geoserver.

## Running it

`brew install geoserver` && `bundle exec foreman start` are your friends.
