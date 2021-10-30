const express=require('express')
const router=express.Router()
const passport=require('passport')
const User=require('../models/user')

router.route('/register')
    .get((req,res)=>{
        return res.json('This will be a register form.😅')
    })
    .post(async (req,res,next)=>{
        try {
            const {email,username,password}=req.body
            const user=new User({email,username})
            const registeredUser=await User.register(user,password)
            req.login(registeredUser,err=>{
                if(err) return next(err)
                // req.flash('success','Welcome to Yelp camp!')
                console.log(`🙍🏼‍♂️:${req.user}`)
                return res.redirect('/campgrounds')      
            })  
        } catch (error) {
            next(error)
            // req.flash('error',error.message)
            return res.redirect('/register')
        }
    })

    router.route('/login')
    .get((req,res)=>{
        return res.json('This will be a login form.😅')
    })
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
        // req.flash('success','welcome back!')
        const redirectUrl=req.session.returnTo || '/campgrounds'
        delete req.session.returnTo
        console.log(`🙍🏼‍♂️:${req.user} isAuthenticated👉🏼${req.isAuthenticated()}`)
        return res.redirect(redirectUrl)
    })

router.get('/logout',(req,res)=>{
    req.logout();
    // req.flash('success','Logged out!')
    res.redirect('/campgrounds')
})

module.exports=router;