const express = require('express');
const router= express.Router();
const catchAsync = require('../utils/catchAsync');
const {campgroundSchema}= require('../schemas.js')
const {isLoggedIn} = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const campground = require('../models/campground');



const validateCampground = (req, res, next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        console.log(req.body);
        const msg = error.details.map(el=> el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else 
    {
        next();
    }
    //console.log(result);
}

router.get('/',catchAsync(async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))

router.get('/new',isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/',isLoggedIn, validateCampground,catchAsync(async (req, res, next) => {
    //   if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    const Campground = new campground(req.body.campground);
    Campground.author = req.user._id;
    await Campground.save();
    req.flash('success','successfully made a new campground!')
    res.redirect(`/campgrounds/${Campground._id}`)
}))
router.get('/:id', catchAsync(async (req, res) => {
    const campgrounds = await campground.findById(req.params.id).populate('reviews').populate('author');
    console.log(campgrounds)
    //console.log(campgrounds);
    if(!campgrounds)
    {
       req.flash('error','Cannot find that campground!');
       return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campgrounds, })
}))

router.get('/:id/edit',isLoggedIn,catchAsync(async (req, res) => {
    const campgrounds = await campground.findById(req.params.id)
    if(!campgrounds)
    {
       req.flash('error','Cannot find that campground!');
       return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campgrounds});
}))

router.put('/:id',isLoggedIn,validateCampground,catchAsync( async (req, res) => {
    const { id } = req.params;
    const campgrounds = await campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success','successfully updated campground!')
    res.redirect(`/campgrounds/${campgrounds._id}`)

}))

router.delete('/:id',catchAsync( async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success','successfully deleted campground!');
    res.redirect('/campgrounds');
}))

module.exports = router;
