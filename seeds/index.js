
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>{
 console.log("connection open!!!")
})
.catch(err=>{
    console.log("OH NO ERROR!!!");
    console.log(err);
})

const sample = array => array[Math.floor(Math.random()* array.length)];

const seedDB = async() =>{
    await Campground.deleteMany({});
    for(let i=0; i< 50; i++)
    {
        const price = Math.floor(Math.random()*20) + 10;
        const random1000 = Math.floor(Math.random()* 1000);
        const camp = new Campground({ 
            author:'633bfd922a5adb340ff5b94b',
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
           title: `${sample(descriptors)} ${sample(places)}`,
           image: 'https://picsum.photos/200/300',
           description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum ea',
            price
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});