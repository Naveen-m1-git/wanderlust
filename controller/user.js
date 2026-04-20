const User=require("../models/user.js");

module.exports.signupuser=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.registerUser=async(req,res)=>{
    try{
         const {username,email,password}=req.body;   
        const user=new User({username,email});
        const registeredUser=await User.register(user,password);
        console.log(registeredUser);
        req.login(registeredUser,err=>{
            if(err){
                return next(err);
            }     
        req.flash("success","Welcome to Wanderlust!");
        res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("signup");
    }
       
}

module.exports.loginuser=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logoutuser=(req,res,next)=>{
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash("success","Logged you out!");
        res.redirect("/listings");
      });
}