var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var hbs = require("express-handlebars");
const mongoose = require("mongoose");
const Cart =require('./models/cart')
const dotenv = require("dotenv");
const session = require("express-session");
var userRouter = require("./routes/user");
var adminRouter = require("./routes/admin");


const Handlebars = require("handlebars");
// const {cartCountHelper}=require('./helpers/handleBarsHelpers')

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");


var app = express();
dotenv.config();
mongoose
  .connect(process.env.DATABASE, {
    // useCreateIndex: true,
    useNewUrlParser: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("server is connected");
  })
  .catch((err) => console.log(err, "server is not connected"));

  

// view engine setup
const exphbs = hbs.create({
  extname: "hbs",
  defaultLayout: __dirname + "/views/layout/layout",
  partialsDir: __dirname + "/views/partials/",
  handlebars: allowInsecurePrototypeAccess(Handlebars),

  //costume helpers
  helpers: {
    isSelected: function (ogValue,checkValue) {
     
      return ogValue==checkValue ? 'selected' : '';
     
    },
    formatString(data) {
      let newData = data.toUTCString();
      return newData.slice(0,16)
    }
    
    // cartCountHelper: (userId,cb) => {return cartCountHelper(userId) },
  }
});


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine("hbs", exphbs.engine);


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "fkgcdscb",
    cookie: { maxAge: 3600 * 24 * 60 * 60 * 1000 },
    saveUninitialized: false,
    resave: false,
  })
);
// app.use(formidable());

app.use("/", userRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
  res.redirect("/404error");
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
