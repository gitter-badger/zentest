#zentest

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

See [specs](specs.js)

#License
[MIT](http://opensource.org/licenses/MIT)
