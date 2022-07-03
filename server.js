const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
const { Pool, Client } = require('pg');

const dev = process.env.NODE_ENV != 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

let port = process.env.PORT || 3000;;

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
        console.log(authParams)
        const queryText = 'SELECT id, name, role FROM public.users WHERE name = $1 AND password = $2'
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
        const queryText = `SELECT public.messages.*, \
        public.users.name FROM public.messages \
        LEFT JOIN public.users \
        ON public.messages.owner = public.users.id WHERE room = ${roomId}\
        ORDER BY "sendDate" ASC`
        pool.query(queryText, (err, res) => {
            socket.emit("loadMessages", {
                result: res.rows
            });
            // pool.end(() => { })
        });
    })


    //отправка сообщений
    socket.on("sendMsg", msgParams => {
        const queryText = `INSERT INTO public.messages (owner, room, "textMessage", "sendDate") VALUES (${msgParams.userId}, ${msgParams.roomId}, '${msgParams.message}', NOW()) RETURNING *`
        pool.query(queryText, (err, res) => {
            io.emit("newMessage", {
                result: [{
                    id: res.rows[0].id,
                    name: msgParams.name,
                    textMessage: msgParams.message,
                    owner: msgParams.userId,
                    room: msgParams.roomId,
                    sendDate: res.rows[0].sendDate,
                    type: 0
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
        let queryText = `INSERT INTO public.votings ("nameVote", "roomId") \
        VALUES ('${votingParams.name}', '${votingParams.roomId}') RETURNING *;`;
        pool.query(queryText)
            .then(res => {
                queryText = `INSERT INTO public.answers ("answerValue", "idVote") \
                                VALUES `;
                let str = "";
                votingParams.answers.forEach(el => {
                    str += `('${el.text}', ${res.rows[0].id})`;
                    str += ", ";
                });
                str = str.substring(0, str.length - 2);
                str += ";";
                queryText += str;
                console.log(queryText);
                pool.query(queryText).then(res2 => {
                })
                queryText = `INSERT INTO public.messages (owner, room, "textMessage", type, "sendDate") \
                VALUES (${votingParams.userId}, ${votingParams.roomId}, '${res.rows[0].id}', 1, NOW()) RETURNING "sendDate"`
                pool.query(queryText).then(res2 => {
                    io.emit("newMessage", {
                        result: [{
                            owner: votingParams.userId,
                            room: votingParams.roomId,
                            type: 1,
                            textMessage: res.rows[0].id,
                            sendDate: res2.rows[0].sendDate
                        }]
                    });
                })
            })
    })

    //выбор пользователем пункта голосования
    socket.on("setAnswer", setAnswerParams => {
        const queryText = `INSERT INTO public.votes ("userId", "idVote", "idAnswer") \
        VALUES (${setAnswerParams.userId}, ${setAnswerParams.voteId}, ${setAnswerParams.answerId})\
        RETURNING *;`
        pool.query(queryText).then(res => {
            getVoting(socket, {
                id: parseInt(res.rows[0].idVote),
                userId: parseInt(res.rows[0].userId)
            });
        })
    })
    socket.on("getVoting", data => {
        getVoting(socket, data);
    })

    socket.on("joinRoom", data => {
        let usersMap = allRooms.get(data.roomId);
        usersMap.set(data.userId, data.name);
        allRooms.set(data.roomId, usersMap);
        io.emit("updateRoom", {
            roomId: data.roomId,
            usersMap: usersMap
        })
        // arr.push({ userId: data.userId, name: data.name });
        // allRooms.set(data.roomId, arr);
        // io.emit("updateRoom", {
        //     roomId: data.roomId,
        //     arr: arr
        // })
        insertToLog(data.userId, data.roomId, "зашёл в комнату");
    })
    socket.on("leaveRoom", data => {
        let usersMap = allRooms.get(data.roomId);
        if (usersMap.has(data.userId)) {
            usersMap.delete(data.userId);
        }
        allRooms.set(data.roomId, usersMap);
        insertToLog(data.userId, data.roomId, "вышел из комнаты");

        io.emit("updateRoom", {
            roomId: data.roomId,
            usersMap: usersMap
        })
    })

    socket.on("getRoomUsers", data => {
        let usersMap = allRooms.get(data.roomId);
        socket.emit("loadRoomUsers", { users: Array.from(usersMap.values()) });
    })
    socket.on("getHistoryRoom", data => {
        pool.query(`SELECT us.name, lg.* FROM public.logs lg
        LEFT JOIN public.users us on lg."userId" = us.id
        WHERE "roomId" = ${data.roomId}
        ORDER BY id ASC`).then(res => {
            socket.emit("loadHistoryRoom", {
                result: res.rows
            })
        })
    })
})

function getVoting(socket, data) {
    pool.query(`\
    SELECT "userId" FROM public.votes \
    WHERE "userId" = ${data.userId} and "idVote" = ${data.id}
    `).then(res2 => {
        let voted = false;
        if (res2.rowCount > 0) voted = true;
        pool.query(`\
        SELECT vt.id as "votingId", ans.id, vt."nameVote", COUNT(vts.id), \
        ans."answerValue" FROM public.votings vt \
        LEFT JOIN public.answers ans ON vt.id = ans."idVote" \
        LEFT JOIN public.votes vts ON vt.id = vts."idVote" and ans.id = vts."idAnswer" \
        WHERE vt.id = ${data.id} \
        GROUP BY vt.id, ans.id, vt."nameVote", ans."answerValue" \
        `).then(res => {
            socket.emit("loadVoting", {
                voted: voted,
                rows: res.rows
            })
        })
    })
}

function insertToLog(userId, roomId, text) {
    pool.query(`INSERT INTO public.logs ("userId", "roomId", text, date) \
    VALUES (${userId}, ${roomId}, '${text}', NOW())`).then(res => {

    });
}

const pool = new Pool({
    user: 'rxnmtfiqesasji',
    host: 'ec2-52-19-96-181.eu-west-1.compute.amazonaws.com',
    database: 'd1gkcohs4hvmon',
    password: '466004336e1915dde763ab6ce4b9dcaf11584f02f211bb7a55b92356f6857890',
    port: 5432,
})
// Rooms

pool.query(`SELECT * FROM public.rooms`).then(res => {
    if (!res.rowCount) return false;
    res.rows.forEach((el) => {
        allRooms.set(el.id, new Map());
    })
})

let allRooms = new Map();

// 


nextApp.prepare().then(() => {
    app.get('*', (req, res) => {
        return nextHandler(req, res);
    })
    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`Server started on localhost:${port}`);
    })
});