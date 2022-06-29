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
        pool.query(`SELECT * FROM public.users WHERE name ='${authParams[0]}'`).then(res => {
            if (res.rowCount > 0) {
                return false;
            }
            pool
                .query(`INSERT INTO public.users(name, role, password) VALUES ('${authParams[0]}', '1', '${authParams[1]}') RETURNING *;`)
                .then(res2 => {
                    socket.emit("loadAuth", {
                        result: res2.rows
                    });
                });
        });

    })

    //авторизация
    socket.on("getMessages", roomId => {
        const queryText = `SELECT public.messages.*, public.users.name FROM public.messages LEFT JOIN public.users ON public.messages.owner = public.users.id WHERE room = ${roomId}`
        pool.query(queryText, (err, res) => {
            socket.emit("loadMessages", {
                result: res.rows
            });
            // pool.end(() => { })
        });
    })


    //отправка сообщений
    socket.on("sendMsg", msgParams => {
        const queryText = `INSERT INTO public.messages (owner, room, "textMessage", "sendDate") VALUES (${msgParams.userId}, ${msgParams.roomId}, '${msgParams.message}', NOW()) RETURNING "sendDate"`
        pool.query(queryText, (err, res) => {
            io.emit("newMessage", {
                result: [{
                    owner: msgParams.userId,
                    room: msgParams.roomId,
                    textMessage: msgParams.message,
                    sendDate: res.rows[0].sendDate
                }]
            });
        });
    })

    //создание комнаты
    socket.on("createRoom", roomParams => {
        const queryText = `INSERT INTO public.rooms (owner, name, active) VALUES (${roomParams.userId}, '${roomParams.roomName}', true)`
        pool.query(queryText, (err, res) => {
            pool.query('SELECT * FROM public.rooms', (err2, res2) => {
                socket.emit("loadRooms", {
                    rooms: res2.rows
                });
                // pool.end(() => { })
            });
        });
    })

    //создание комнаты
    socket.on("createVoting", votingParams => {
        const queryText = `INSERT INTO public.votings ("nameVote", "roomId") VALUES ('${votingParams.voteName}', '${votingParams.roomName}')`
        pool.query(queryText, (err, res) => {
            const queryText = `INSERT INTO public.answers ("answerValue", "idVote") VALUES ('${answerParams.answerName}', ${answerParams.voteId})`
        pool.query(queryText, (err, res) => {
            socket.emit("loadMessages", {
                result: res.rows
            });
        });
            socket.emit("loadMessages", {
                result: res.rows
            });
        });
    })

    //выбор пользователем пункта голосования
    socket.on("setAnswer", setAnswerParams => {
        const queryText = `INSERT INTO public.votes ("userId", "idVote", "idAnswer") VALUES (${setAnswerParams.userId}, ${setAnswerParams.voteId}, ${setAnswerParams.answerId})`
        pool.query(queryText, (err, res) => {
            socket.emit("loadMessages", {
                result: res.rows
            });
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