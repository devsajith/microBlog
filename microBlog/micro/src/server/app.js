require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const LOGGER = require('./logger/logger.util');
// eslint-disable-next-line no-undef
const url = process.env.API_URL;
const app = express();
// eslint-disable-next-line no-undef
const port = process.env.PORT;

const cors = require('cors')
const webSocketPort=process.env.WEB_SOCKET_PORT_NEW
const io = require("socket.io")(webSocketPort, {
  cors: {
    orgin: "*",
  },
});
require("./webSocket").connect(io);
dbConnect()
function dbConnect() {
    mongoose
        .set("strictQuery", false)
        .set('strictPopulate', false)
        .connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            LOGGER.info('Connected')

        })
        .catch(error => {
            LOGGER.error("Error connecting to DB: ", error)
            dbConnect()
        });
}

app.use(express.json());

app.use(cors({ origin: "*", }));

const userRouter = require('./routers/users');
const pageRouter = require('./routers/pages');
const friendsRouter = require('./routers/friends');
const postRouter = require('./routers/post');
const authRouter = require('./routers/authentication');
const commentsRouter = require('./routers/comments');
const notificationRouter = require('./routers/notification');
const groupRouter = require('./routers/groups')


app.use(friendsRouter)
app.use(postRouter);
app.use(userRouter);
app.use(authRouter);
app.use(commentsRouter);
app.use(pageRouter)
app.use(notificationRouter)
app.use(groupRouter);



// eslint-disable-next-line no-unused-vars
app.use(function (req, res, next) {
    res.status(404).send({ errorCode: 4040, message: "Api not found!" });
});


app.listen(port, () => {
    LOGGER.info(`server started on port\t${port}`)
});