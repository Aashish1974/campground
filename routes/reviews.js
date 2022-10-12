const express = require('express');
const router= express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');

const campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema }= require('../schemas.js');


const validateReview = (req, res, next)=>{
    const {error}= reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message)
        throw new ExpressError(msg, 400)
    }
    else 
    {
        next();
    }
}

router.post('/',validateReview, catchAsync(async(req, res)=>{
    console.log(req.params);
    const Campground= await campground.findById(req.params.id);
    const review = new Review(req.body.review);
    Campground.reviews.push(review);
    await review.save();
    await Campground.save();
    req.flash('success','Created new review')
    res.redirect(`/campgrounds/${Campground._id}`);
 }))
 
 router.delete('/:reviewId',catchAsync(async(req, res)=>{
     const {id, reviewId} = req.params;
     await campground.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
     await Review.findByIdAndDelete(reviewId);
     req.flash('success','Review deleted Successfully');
     res.redirect(`/campgrounds/${id}`);
 }))

 module.exports = router;