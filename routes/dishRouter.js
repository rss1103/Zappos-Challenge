var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Dishes = require('../models/restaurant');
var restarauntRouter = require('restarauntRouter');
restaurantRouter.route('/:restaurantId/:menuId/dish')
.get(function(req,res,next){
       Dishes.find(req.query)
        .populate('comments.postedBy')
        .exec(function (err, dish) {
        if (err) return next(err);
        res.json(dish);
    });
})

.post(function(req, res, next){
    Dishes.create(req.body,function(err,dish){
        if (err) throw err;
        var id = dish._id;
        console.log("Dish Created !");
        res.writeHead(200,{
            'Content-Type':'text/plain'
        });
        res.end('Added the dish with id: '+id);
    });    
})

.delete(function(req, res, next){
        Dishes.remove({},function(err,resp){
            if(err) throw err;
            res.json(resp);
        });
});
dishRouter.route('/:restaurantId/:menuId/dish/:dishId')
.get(function(req,res,next){
       Dishes.findById(req.params.dishId)
        .populate('comments.postedBy')
        .exec(function (err, dish) {
         if (err) return next(err);
        res.json(dish);
    });
})

.put(function(req, res, next){
       Dishes.findByIdAndUpdate(req.params.dishId,{
           $set:req.body
       },{
           new:true
       },function(err,dish){
            if (err) throw err;
            res.json(dish);
       });
})

.delete(function(req, res, next){
       Dishes.findByIdAndRemove(req.params.dishId,function(err,resp){
           if (err) throw err;
           res.json(resp);
       });
});

dishRouter.route('/:restaurantId/:menuId/dish/:dishId/comments')
.get(function (req, res, next) {
    Dishes.findById(req.params.dishId)
        .populate('comments.postedBy')
        .exec(function (err, dish) {
         if (err) return next(err);
        res.json(dish.comments);
    });
})
.post(function (req, res, next) {
      Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) return next(err);
        req.body.postedBy = req.decoded._id;
        dish.comments.push(req.body);
        dish.save(function (err, dish) {
             if (err) return next(err);
            console.log('Updated Comments!');
            res.json(dish);
        });
    });
})
.delete(function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) throw err;
        for (var i = (dish.comments.length - 1); i >= 0; i--) {
            dish.comments.id(dish.comments[i]._id).remove();
        }
        dish.save(function (err, result) {
            if (err) throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all comments!');
        });
    });
});
dishRouter.route('/:restaurantId/:menuId/dish/:dishId/comments/:commentId')
.get(function (req, res, next) {
      Dishes.findById(req.params.dishId)
        .populate('comments.postedBy')
        .exec(function (err, dish) {
        if (err) return next(err);
        res.json(dish.comments.id(req.params.commentId));
    });
})
.put(function (req, res, next) {
    // We delete the existing commment and insert the updated
    // comment as a new comment
   Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) return next(err);
        dish.comments.id(req.params.commentId).remove();
        req.body.postedBy = req.decoded._id;
        dish.comments.push(req.body);
        dish.save(function (err, dish) {
            if (err) return next(err);
            console.log('Updated Comments!');
            res.json(dish);
        });
    });
})
.delete(function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
        dish.comments.id(req.params.commentId).remove();
        dish.save(function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });
});

