same domain different ports
leaving off the path != 'Path=/'
browser behavior when domain is invalid (silently ignores cookie)
browser behavior when 'secure' is specified over insecure connection (does it silently ignore?)
browser behavior when 'expires' is invalid (hard to tell; webkit bug already shows expires as invalid, soon to be fixed)

webkit should log cookie errors to the console. Wonder if they're interested in a patch...

local ssl (can I write a vagrant-ssl gem? that'd be ace!)
