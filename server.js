const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
const { Pool, Client } = require('pg')

const dev = process.env.NODE_ENV != 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

let port = 3000;

io.on('connect', socket =>{
    console.log("User connected!");
    socket.emit('now', {
        message: "you connected"
    })
})

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'zernjchat',
    password: 'postgrespw',
    port: 49153,
})

 pool.query('SELECT * FROM public.rooms', (err, res) => {
   console.log(err, res)
   pool.end()
 })

nextApp.prepare().then(()=>{
    app.get('*', (req, res) => {
        return nextHandler(req, res);
    })
    server.listen(port, (err)=>{
        if(err)throw err;
        console.log(`Server started on localhost:${port}`);
    })
});