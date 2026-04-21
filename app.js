if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const session = require("express-session")
const { MongoStore } = require('connect-mongo')
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")

const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    touchAfter: 24 * 60 * 60
});

store.on("error", () => {
    console.log("Session store error", err);
})
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}
main().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));



app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// Root route
app.get("/", (req, res) => {
    console.log("Root route hit");
    res.redirect("/listings");
});

// app.get("/fakeUser",async(req,res)=>{
//     const user=new User({
//     email:"naveen@123gamil.com",
//     username:"naveen"});

//     const newUser=await User.register(user,"Hello@123");
//     res.send(newUser);
// });


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter);
// Handle all unknown routes
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Central error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error", { message });
});

app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is listening on port ${process.env.PORT || 8080}`);
});
