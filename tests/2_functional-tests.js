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
var server = require('../server');
let objectID = require('mongodb').ObjectID;

let testThreadID = new objectID(`5ca43bfdfe8be10821ffbfa2`);
let testReplyID = new objectID(`5ca470fab1d1c701c70161af`);

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {

    this.timeout(5000);
    
    suite('POST', function() {
      test(`Add thread redirects correctly`, function(done) {
        chai.request(server)
          .post(`/api/threads/test`)
          .send({
            text: `test`,
            delete_password: `delete`
          })
          .end(function(err, res) {
            assert.lengthOf(res.redirects, 1, `Length of redirects is 1`);
            assert.include(res.redirects[0], '/b/test', `Redirect includes correct path`);
            done();
          })
      });
    });
    
    suite('GET', function() {
      test(`Get (10) threads`, function(done) {
        chai.request(server)
          .get(`/api/threads/test`)
          .end(function(err, res) {
            assert.isArray(res.body);
            assert.isAtMost(res.body.length, 10);
            done();
          })
      })
    });
    
    suite('DELETE', function() {
      test('Test for incorrect delete password', function(done) {
        chai.request(server)
          .delete(`/api/threads/test`)
          .send({
            thread_id: testThreadID,
            delete_password: `wrong`
          })
          .end(function(err, res) {
            assert.equal(res.text, `incorrect password`);
            done();
          })
      })
    });
    
    suite('PUT', function() {
      test('Test reported thread', function(done) {
        chai.request(server)
          .put(`/api/threads/test`)
          .send({
            thread_id: testThreadID,
          })
          .end(function(err, res) {
            assert.equal(res.text, `success`);
            done();
          })
      })
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('Post a new reply', function(done) {
        chai.request(server)
          .post(`/api/replies/test`)
          .send({
            text: `test reply`,
            delete_password: `delete`,
            thread_id: testThreadID,
          })
          .end(function(err, res) {
            assert.lengthOf(res.redirects, 1, `Length of redirects is 1`);
            assert.include(res.redirects[0], `/b/test/${testThreadID}`, `Redirect includes correct path`);
            done();
          })
      })
    });
    
    suite('GET', function() {
      test('Get thread with replies', function(done) {
        chai.request(server)
          .get(`/api/replies/test?thread_id=${testThreadID}`)
          .end(function(err, res) {
            assert.isObject(res.body);
            assert.isArray(res.body.replies);
            done();
          })
      })
    });
    
    suite('PUT', function() {
      test('Report a reply', function(done) {
        chai.request(server)
          .put(`/api/replies/test`)
          .send({
            thread_id: testThreadID,
            reply_id: testReplyID
          })
          .end(function(err, res) {
            assert.equal(res.text, 'success');
            done();
          })
      })
    });
    
    suite('DELETE', function() {
      test('Delete a post, incorrect password', function(done) {
        chai.request(server)
          .delete(`/api/replies/test`)
          .send({
            thread_id: testThreadID,
            reply_id: testReplyID,
            delete_password: `wrong`
          })
          .end(function(err, res) {
            assert.equal(res.text, 'incorrect password');
            done();
          })
      })
    });
    
  });

});
