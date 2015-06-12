'use strict';

var express=require('express');
var app=express();
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/zentest');
var Model=mongoose.model('Model',{name:String,pwd:String});

var bear='Bearer234234ABC';
app.get('/',function(req,res){
  res.status(200).send('OK');
});
app.get('/login',function(req,res){
  res.status(200).json({auth:bear});
});
app.get('/receive',function(req,res){
  res.status(200).json({data:'abc'});
});
app.post('/send',function(req,res){
  if(req.headers.authorization!==bear)
    return res.status(401).json({message:'Unauthorized'});
  res.status(200).json({message:'OK'});
});
app.get('/error',function(req,res){
  res.status(500).json({message:'Error'});
});
app.get('/data',function(req,res){
  res.status(200).json({items:[{qty:3}]});
});
app.listen(3000);

var z=require('./zentest')(app);
var assert=require('assert');
var fixture={sample:{name:'abc'},parent:{pwd:'def'}};

return z.db(mongoose,['Model'],[{model:'Model',sample:fixture.sample,count:50,parent:fixture.parent}])
.then(function(){
  return mongoose.models.Model.find({});
}).then(function(docs){
  assert.equal(docs.length,50);
  z.set('Accept','application/json');
  return z.req('get','/',{},{});
}).then(function(r){
  assert.equal(r,'OK');
  return z.req('get','/login');
}).then(function(r){
  z.auth(r.auth);
  assert.equal(z._tok,r.auth);
  return z.req('get','/receive');
}).then(function(r){
  z.push('data',r.data);
  assert.equal(z.get('data'),'abc');
  z.req('get','/error',{},{expect:500});
  z.req('get','/data',{},{expect:z.asrt('items[0].qty',3)});
  z.unauth();
  z.req('post','/send',{a:'abc'},{expect:401});
  z.end();
}).done();
