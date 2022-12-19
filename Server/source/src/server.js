import express from 'express';
import configViewEngine from './configs/viewEngine';
import initWebRoute from './route/web';
import initAPIRoute from './route/api';
import connection from './configs/connectDB';
import session from 'express-session'
require('dotenv').config();

const app = express();
const port = process.env.PORT || 1111;

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000*60*60 }
}))
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//setup view engine
configViewEngine(app);

//init web route
initWebRoute(app);

initAPIRoute(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});