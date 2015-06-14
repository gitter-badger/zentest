[![Build Status](https://travis-ci.org/oceanhouse21/zentest.svg?branch=master)](https://travis-ci.org/oceanhouse21/zentest)
#zentest

[![Join the chat at https://gitter.im/oceanhouse21/zentest](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/oceanhouse21/zentest?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> zentest saves you some LOC when you're using supertet

```js
var app=...
var request=require('supertest');
request(app)
  .post('/user')
  .send({name:'user',pwd:'secret'})
  .expect(200)
  .end(function(err, res){
    if (err) throw err;
  });
```

becomes

```js
var app=...
var z=require('zentest')(app);
z.req({'post','/user',{name:'user',pwd:'secret'});
```

#Install

```js
npm install zentest
```

#Usage

##Express specs API

See [specs](specs.js)

##MongoDB seed API

signature: ```db(db,[clean],[fixt])```

- ```db``` (String)
Mongoose connection uri

- ```clean``` (Array of Strings)
Mongoose models to empty

- ```fixt``` (Array of 'Fixture' Objects)
Seeds for database

    - ```Fixture``` (Object)
    *Properties:*
        - ```model``` (String)
        Name of Mongo model

        - ```sample``` (String)
        Sample fixture

        - ```parent``` (String)
        Parent object to be merged

        - ```count``` (Number)
        How many objects to seed

#License
[MIT](http://opensource.org/licenses/MIT)
