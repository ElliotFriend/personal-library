/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = process.env.LIVE_URL || require('../app');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .type('json')
          .send({ title: 'The Great Gatsby' })
          .end( function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            done();
          })
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .type('json')
          .end( function(err, res) {
            assert.equal(res.status, 400);
            assert.isString(res.body, 'response should be an object');
            assert.equal(res.body, 'missing required field title');
            done();
          })
      });

    });


    suite('GET /api/books => array of books', function(){

      test('Test GET /api/books',  function(done){
        chai.request(server)
         .get('/api/books')
         .end( function(err, res) {
           assert.equal(res.status, 200);
           assert.isArray(res.body, 'response should be an array');
           assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
           assert.property(res.body[0], 'comments', 'Books in array should contain comments')
           assert.isArray(res.body[0].comments, 'The comments field should be an array')
           assert.equal(res.body[0].comments.length, res.body[0].commentcount, 'The comments array should be the same length as the commentcount field')
           assert.property(res.body[0], 'title', 'Books in array should contain title');
           assert.notEmpty(res.body[0], 'title', 'The title field should have a value')
           assert.property(res.body[0], '_id', 'Books in array should contain _id');
           assert.notEmpty(res.body[0], '_id', 'The _id field should have a value')
           done();
         });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function(){

      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/5f665eb46e296f6b9b6a504d')
          .end( function(err, res) {
            assert.equal(res.status, 400, 'status should be 400');
            assert.isString(res.body, 'response should be a string')
            assert.equal(res.body, 'no book exists')
            done();
          })
      });

      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .post('/api/books')
          .type('json')
          .send({ title: 'A Test Title' })
          .end( function(err, res) {
            let data = res.body
            assert.equal(res.status, 200, 'status should be 200');
            chai.request(server)
              .get(`/api/books/${data._id}`)
              .end( function(err, res) {
                assert.equal(res.status, 200, 'status should be 200');
                assert.isObject(res.body, 'response should be an object')
                assert.property(res.body, 'commentcount', 'Books in array should contain commentcount');
                assert.property(res.body, 'comments', 'Books in array should contain comments')
                assert.isArray(res.body.comments, 'The comments field should be an array')
                assert.equal(res.body.comments.length, res.body.commentcount, 'The comments array should be the same length as the commentcount field')
                assert.property(res.body, 'title', 'Books in array should contain title');
                assert.notEmpty(res.body, 'title', 'The title field should have a value')
                assert.property(res.body, '_id', 'Books in array should contain _id');
                assert.notEmpty(res.body, '_id', 'The _id field should have a value')
                done();
              })
          })
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      test('Test POST /api/books/[id] with comment', function(done){
        // done();
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        // done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        // done();
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        // done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        // done();
      });

    });

  });

});
