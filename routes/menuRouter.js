var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var restaurantRouter = require('restaurantRouter');
var Menu = require('../models/restaurant');
restaurantRouter.route('/:restaurantId/menu')
.get(function (req, res, next) {
    Menu.findbyId(req.params.restaurantId)
        .exec(function (err, rest) {
        if (err) throw err;
        res.json(rest);
    });
})

.post(function(req, res, next) {
  Menu.findById(req.params.restaurantId, function (err, rest) {
        if (err) return next(err);
        rest.menu.push(req.body);
        rest.save(function (err, rest) {
             if (err) return next(err);
            console.log('Updated Menu!');
            res.json(rest);
        });
    });
})

.delete(function(req, res, next){
    Menu.findById(req.params.restaurantId, function (err, rest) {
        if (err) return next(err);
        for (var i = (rest.menu.length - 1); i >= 0; i--) {
            rest.menu.id(rest.menu[i]._id).remove();
        }
        rest.save(function (err, result) {
             if (err) return next(err);
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all Menu Items!');
        });
    });
});


restaurantRouter.route('/:restaurantId/menu/:menuId')
.get(function (req, res, next) {
    Menu.findbyId(req.params.restaurantId)
        .exec(function (err, rest) {
        if (err) throw err;
        res.json(rest.menu.id(req.params.menuId));
    });
})
.put(function (req, res, next) {
    // We delete the existing commment and insert the updated
    // comment as a new comment
   Menu.findById(req.params.menuId, function (err, rest) {
        if (err) return next(err);
        rest.menu.id(req.params.menuId).remove();
        rest.menu.push(req.body);
        rest.save(function (err, rest) {
            if (err) return next(err);
            console.log('Updated Comments!');
            res.json(rest);
        });
    });
})
.delete(function (req, res, next) {
   Menu.findbyId(req.params.menuId, function (err, rest) {
        rest.save(function (err, resp) {
            if(err) throw err;
            res.json(resp);
        })
    })
});
