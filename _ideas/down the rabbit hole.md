If you `set -o pipefail` in a bash script and then attempt to pipe
anything into the command `true`, you get a SIGPIPE (if you've
`set -e` the script now halts), because `true` doesn't open stdin.

I discovered this because I was piping some commands into an `sftp`
CLI (with different options in different environments) and wanted
to use something that couldn't fail when testing other parts of the script.

If you use `echo <ftp command> | sftp <options>`, errors are silently
discarded (it will exit 0, and run subsequent sftp commands if there's
more than one) unless you use `sftp -b -`. There's no longopt for this;
have fun figuring out what it means.

If you write your code on OSX, any codebase older than a few weeks has
bugs on case sensitive filesystems.
