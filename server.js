const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
const { Pool, Client } = require('pg');

const dev = process.env.NODE_ENV != 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

let port = 3000;

io.on('connect', socket => {
    console.log("User connected!");
    socket.on("getRooms", () => {
        pool.query('SELECT * FROM public.rooms', (err, res) => {
            socket.emit("loadRooms", {
                rooms: res.rows
            });
            // pool.end(() => { })
        });
    })

    //авторизация
    socket.on("auth", authParams => {
        const queryText = 'SELECT id, name FROM public.users WHERE name = $1 AND password = $2'
        pool.query(queryText, authParams, (err, res) => {
            socket.emit("loadAuth", {
                result: res.rows
            });
            // pool.end(() => { })
        });
    })

    //регистрация
    socket.on("registration", authParams => {
        const queryText = `DO \
        $do$ \
        BEGIN \
            IF EXISTS (SELECT FROM public.users WHERE name = '$1') THEN \
                INSERT INTO public.users(name, role, password) \
                    VALUES ('$1', '1', '$2'); \
            END IF; \
        END \
        $do$;`
        pool.query(queryText, authParams, (err, res) => {
            socket.emit("loadAuth", {
                result: res.rows
            });
            // pool.end(() => { })
        });
    })

    //авторизация
    socket.on("getMessages", roomId => {
        const queryText = `SELECT * FROM public.messages WHERE room = ${roomId}`
        pool.query(queryText, (err, res) => {
            socket.emit("loadMessages", {
                result: res.rows
            });
            // pool.end(() => { })
        });
    })

    socket.on("sendMsg", msgParams => {
        console.log(msgParams);
        const queryText = `INSERT INTO public.messages (owner, room, "textMessage", "sendDate") VALUES (${msgParams.userId}, ${msgParams.roomId}, '${msgParams.message}', NOW())`
        console.log(queryText);
        pool.query(queryText, (err, res) => {
            console.log(err);
            // socket.emit("loadMessages", {
            //     result: res.rows
            // });
            // pool.end(() => { })
        });
    })
})

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'zernjchat',
    password: 'postgrespw',
    port: 49153,
})



nextApp.prepare().then(() => {
    app.get('*', (req, res) => {
        return nextHandler(req, res);
    })
    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`Server started on localhost:${port}`);
    })
});