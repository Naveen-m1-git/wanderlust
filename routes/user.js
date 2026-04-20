const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveRedirectTo } = require("../middleware.js");
const controllerUser = require("../controller/user.js");
const user = require("../models/user.js");
 
router.route("/signup").get(controllerUser.signupuser).post(wrapAsync(controllerUser.registerUser));

router.route("/login").get(controllerUser.loginuser).post(saveRedirectTo
    ,passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),wrapAsync(controllerUser.login));             


router.get("/logout",controllerUser.logoutuser);
module.exports=router;