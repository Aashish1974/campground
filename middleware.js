module.exports.isLoggedIn = (req, res, next)=>{
    // console.log("REQ.USER...", req.user);
    if(!req.isAuthenticated()){
        // console.log(req.originalUrl);
        req.session.returnTo = req.originalUrl;
        //console.log(req.session.returnTo);
        req.flash('error','you must be signed in first');
        return res.redirect('/login');
    }
    next();
}