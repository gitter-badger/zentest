'use strict';

var _=require('lodash');
var request=require('supertest');
var Promise=require('promise');

var zentest=function(app){
  
  if(!(this instanceof zentest))
    return new zentest(app);
  this._app=app;
};

zentest.prototype={

  asrt:function(prop,val){
    return function(res){
      if(_.result(res.body,prop)!==val)
        throw Error(prop+' should be '+val+' not '+_.result(res.body,prop));
    };
  },

  req:function(act,pth,bod,opts){
    return new Promise(function(resolve){
      var _req=request(this._app)[act](pth)
      .expect(200);
      if(this._header)
        _.map(this._header,function(obj){_req.set(obj.header,obj.value);});
      if(this._tok)
        _req
        .set('Authorization',this._tok);
      if(bod)
        _req.send(bod);
      opts = (opts) ? opts : [];
      if((!Array.isArray(opts)))
        opts=[opts];
      for(var i=0;i<opts.length;i++){
        for(var p in opts[i]){
          if(opts[i].hasOwnProperty(p)){
            opts[i][p]=(Array.isArray(opts[i][p])) ? opts[i][p] : [opts[i][p]];
            _req[p].apply(_req,opts[i][p]);
          }
        }
      }
      _req.end(function(e,r){
        if(e)
          throw Error(r.req.method+' '+r.req.path+': '+e);
        else{
          if (/application\/json/.test(r.res.headers['content-type']))
            resolve(JSON.parse(r.text));
          else
            resolve(r.text);
        }
      });
    }.bind(this));
  },

  set:function(header,value){
    this._header=[];
    this._header.push({header:header,value:value});
  },

  auth:function(tok){
    this._tok=tok;
  },

  unauth:function(){
    this._tok=undefined;
  },

  push:function(key,val){
    this.dict=(this.dict) ? this.dict : {};
    this.dict[key]=val;
  },

  get:function(key){
    return this.dict[key];
  },

  db:function(db,clean,fixt){
    var promises=_.map(clean,function(obj){return db.models[obj].remove({});});
    return Promise.all(promises)
    .then(function(){
      var models=[];
      _.map(fixt,function(obj){
        if(obj.parent)
          _.merge(obj.sample,obj.parent);
        if(obj.count){
          for(var i=0;i<obj.count;i++){
            models.push(db.models[obj.model].create(JSON.parse(JSON.stringify(obj.sample))));
          }
        }else{
          models.push(db.models[obj.model].create(obj.sample));
        }
      });
      return Promise.all(models);
    }).then(function(){
      console.log('seeded database');
    }).then(null,function(err){
      throw err;
    });
  },

  end:function(){
    console.log('finished tests');
    process.exit();
  },

};

module.exports=zentest;
