
const express = require("express")

const cors = require("cors")

require("dotenv").config()

const http = require("http")

const {Server} = require("socket.io")

const cookieParser = require('cookie-parser')


const dbConnect = require('./config/dbConnect')

// * Routes import


const authRouter = require('./routes/auth.router')

const userRouter = require('./routes/user.router')

const messagesRouter = require('./routes/messages.router')

const chatRouter = require("./routes/chat.router")

const port = process.env.PORT || 3000

const colors = require("colors")

dbConnect()  

const app = express()

app.use(express.json())

app.use(cors())

app.use(cookieParser())



// SocketIO & Server 


const server = http.createServer(app)

const io = new Server(server, {
    pingTimeout : 60000,
    cors: {
        origin: "*"
    }
})


//Test cookie route

app.get('/', (req, res) => {

    console.log("COOKIE:",req.headers.cookie)

    res.send({
        cookie: req.cookies,
        message: 'working'
    })

})




app.post('/', (req, res) => {

    let exp = new Date()
    exp.setDate(exp.getDate() + 2)

    res.setHeader(
        'Set-Cookie',
        `testCookie=aar; Expires=${exp}; HttpOnly; Domain=.vercel.app ; SameSite=none; Secure;`
    );
   
    res.send("cookie created")
})



app.get('/logout', (req, res) => {

    res.clearCookie("testCookie")

    res.clearCookie("weConnectUserCookie")

    res.send("Logged out")

})




// Routes


app.use('/auth', authRouter)

app.use('/user', userRouter)

app.use('/messages', messagesRouter)

app.use('/chat', chatRouter)





io.on("connection", (conn) => {

    conn.on("new-user-setup", (userData) => {
       
        conn.join(userData._id)

        conn.emit("user connected")

    })

    conn.on("enter chat", (chat) => {
        console.log(chat, 'ENTER CHAT')
        conn.join('chat')
    })

    conn.on("new message", (newMsg) => {
        let chat = newMsg.chatWith
        if(!chat.users) return console.log("Chat not sent")
        
        chat.users.map((el) => {
            if(el._id == newMsg.sender._id) return // we don't want to see our own message

            console.log("NEW MESSAGE" , newMsg)
            conn.in(el._id)
            .emit("message received", newMsg)
        })
    })

    conn.on("typing" , (chat) => conn.in(chat).emit("typing"))

    conn.on("typing stop" , (chat) => conn.in(chat).emit("typing stop") )

    conn.off("new-user-setup" , () => {
        conn.leave(userData._id)
    })

})

// Listener

server.listen(port, async () => {
    console.log(`Server started `)
})