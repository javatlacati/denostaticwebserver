import {Application, send, isHttpError} from 'oak';
// import {walk} from 'https://deno.land/std/fs/walk.ts';
import {Config} from './Config.ts'


class Server {
    private _app: Application = new Application();

    async startup() {
        this.printCurrentCondiguration();

        await this.printFilesNames();

        this.configureMiddleWare();

        const server = await this._app.listen({port: Config.PORT_NUMBER});
        console.log("app listening on PORT_NUMBER " + Config.PORT_NUMBER);
    }

    private configureMiddleWare() {
        this._app.use(async (context) => {

            try {
                await send(context, context.request.url.pathname, {
                    root: Deno.cwd(),
                    index: Config.DEAFULT_FILE_TO_LOAD,
                })

            } catch (err) {
                console.log(`${context.request.url.pathname} - ${err}`)
                if (isHttpError(err)) {
                    switch (err.status) {
                        case 404: {
                            context.response.headers = new Headers({"Content-Type": "text/html"});
                            context.response.body = Config.HTTP404ERRORMESSAGE;
                            break;
                        }
                        default: {
                            console.log(err);
                            console.log(JSON.stringify(err))
                            break;
                        }
                    }
                } else {
                    if (err instanceof Deno.errors.NotFound) {
                        console.log("the specified resource could not be loaded")
                    }
                    // rethrow if you can't handle the error
                    console.log(JSON.stringify(err))
                    throw err;
                }
            }
        });

        // Middleware para Vue.js router modo history
        // const history = require('connect-history-api-fallback');
        // app.use(history());
    }

    private printCurrentCondiguration() {
        console.log(`PATH: ${Deno.env.get("PATH")}\n`);
        console.log(`Server root directory: ${Deno.cwd()}`);
        console.log(`starting at port ${Config.PORT_NUMBER}...\n\n`);
    }

    private async printFilesNames() {
        // const fileInfo = await Deno.lstat(Deno.cwd());
        // if(fileInfo.isDirectory){
        //   console.log(fileInfo.name)
        // }
        console.log('root files loaded')
        for await (const dirEntry of Deno.readDir(Deno.cwd())) {
            console.log(dirEntry.name);
        }
        console.log()

        // let files = walk(`${Deno.cwd()}/js/`);
        // if (files) {
        //     for await (const file of files) {
        //         let filteredEntry: string = file.path;
        //         if (/\.ts$/g.test(filteredEntry)) {
        //             console.log(`tsc ${filteredEntry}`);
        //         }
        //     }
        // }
    }
}

let server = new Server();
server.startup();
