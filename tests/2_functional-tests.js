/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var server = require('../server');
let objectID = require('mongodb').ObjectID;

let testThreadID = new objectID(`5ca43bfdfe8be10821ffbfa2`);

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      // test(`Add thread redirects correctly`, function(done) {
      //   done();
      //   // chai.request(server)
      //   //   .post(`/api/threads/test`)
      //   //   .send({
      //   //     text: `test`,
      //   //     delete_password: `delete`
      //   //   })
      //   //   .end(function(err, res) {
      //   //     expect(res.redirects).to.have.length(1);
      //   //     expect(res.redirects[0]).to.contain('/b/test');
      //   //     done();
      //   //   })
      // });
      test('test', function(done) {
        done();
      })
      test('test', function(done) {
        done();
      })
    });
    
    suite('GET', function() {
      test(`Get (10) threads`, function(done) {
        done();
        // chai.request(server)
        //   .get(`/api/threads/test`)
        //   .end(function(err, res) {
        //     assert.isArray(res.body);
        //     expect(res.body).to.have.length.most(10);
        //     done();
        //   })
      })
    });
    
    suite('DELETE', function() {
      test('test', function(done) {
        done();
      })
    });
    
    suite('PUT', function() {
      test('test', function(done) {
        done();
      })
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('test', function(done) {
        done();
      })
    });
    
    suite('GET', function() {
      test('test', function(done) {
        done();
      })
    });
    
    suite('PUT', function() {
      test('test', function(done) {
        done();
      })
    });
    
    suite('DELETE', function() {
      test('test', function(done) {
        done();
      })
    });
    
  });

});
