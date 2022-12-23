# denostaticwebserver
Deno static web server

## Development prerequisites:

* install trex `deno install -A --unstable https://deno.land/x/trex/Trex.ts`

To add a new standard deno dependency use:

    Trex i --map dependencyname

To add custom module use:

    Trex --custom React=https://dev.jspm.io/react/index.js

Run it through the command:

    deno run --allow-net --allow-read --allow-env  --importmap=import_map.json --unstable server.ts
