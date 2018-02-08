var express = require('express');
var Restaurants = require('../models/restaurant');
var bodyParser = require('body-parser');
var restaurantRouter = express.Router();
restaurantRouter.use(bodyParser.json());
restaurantRouter.route('/')
.get(function(req,res,next){
     Restaurants.find({},function(err,restaurant){
         if (err) throw err;
         res.json(restaurant);
     });  
})
.post(function(req, res, next){
    Restaurants.create(req.body,function(err,restaurant){
        if (err) throw err;
        var id = restaurant._id;
        console.log("Restaurant information Created !");
        res.writeHead(200,{
            'Content-Type':'text/plain'
        });
        res.end("Added the restaurant information with id: "+id);
    });  
})

.delete(function(req, res, next){
       Restaurants.remove({},function(err,resp){
           if (err) throw err;
           res.json(resp);
       })
});
restaurantRouter.route('/:restaurantId')
.get(function(req,res,next){
      Restaurants.findById(req.params.restaurantId,function(err,restaurant){
          if (err) throw err;
          res.json(restaurant);
      });
})

.put(function(req, res, next){
       Restaurants.findByIdAndUpdate(req.params.restaurantId,{
           $set:req.body
       },{
           new:true
       },function(err,restaurant){
           if (err) throw err;
           res.json(restaurant);
       })
})

.delete(function(req, res, next){
        Restaurants.findByIdAndRemove(req.params.restaurantId,function(err,resp){   
           if (err) throw err;
           res.json(resp);
       });
});

module.exports = restaurantRouter;