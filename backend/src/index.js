const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});
const createServer = require('./createServer');
const db = require('./db')

const server = createServer();

//Use express middleware to handle cookies (JWT)

server.express.use(cookieParser())

// Decode the JWT so we can get the user id on each request

server.express.use((req,res,next)=>{
    const { token } = req.cookies;
    if(token){
        const {userId} = jwt.verify(token, process.env.APP_SECRET);
        //put the userId on req for future requests to access
        req.userId = userId
    }
    next()
})

// Create another middleware in which populates the user in every request

server.express.use( async (req,res,next)=>{
    if(!req.userId) return next();

    const user = await db.query.user({
        where: {
            id: req.userId
        }
    }, '{id, permissions, email, name}')

    req.user = user
    next()

})

server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL
    }
}, deets =>{console.log(`server is running on port ${deets.port}`)})