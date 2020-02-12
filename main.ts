import {Server} from "./server";


const server = new Server(3000);
server.start()
    .then(() => console.log("Server running"));