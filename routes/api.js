/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const COLLECTION_NAME = 'project-messageboard';

var expect = require('chai').expect;
let objectID = require('mongodb').ObjectID;

module.exports = function (app) {

  app.route('/api/threads/:board')
    // post a thread
    .post(function (req, res) {
      let board = req.params.board;
      let thread = {};
      let db = req.db;
      let collection = db.collection(COLLECTION_NAME);
      let createdOn = new Date();
      thread.board = board;
      thread.created_on = createdOn;
      thread.bumped_on = createdOn;
      thread.text = req.body.text;
      thread.reported = false;
      thread.delete_password = req.body.delete_password;
      thread.replies = [];
      collection.insertOne(thread);
      res.redirect(`/b/${board}`);
    })

    .get(function (req, res) {
      let board = req.params.board;
      let collection = req.db.collection(COLLECTION_NAME);
      collection.find({})
        .filter({ board: board })
        .sort({ bumped_on: -1 })
        .limit(10)
        .project({
          reported: false,
          delete_password: false,
          replies: { $slice: -3 },
          'replies.reported': false,
          'replies.delete_password': false
        })
        .toArray(function (err, docs) {
          if (err) res.send(`DB Error: ${err}`);
          else res.send(docs);
        })
    })

    .delete(function(req, res) {
      let board = req.params.board;
      let collection = req.db.collection(COLLECTION_NAME);
      let o_id = new objectID(req.body.thread_id);
      let deletePassword = req.body.delete_password;
      collection.findOne({_id: o_id}).then(doc => {
          if (doc.delete_password === deletePassword) {
            collection.deleteOne({_id: o_id});
            res.send(`success`)
          }
          else res.send(`incorrect password`)
        })
        .catch(err => {
          res.send(`DB Error: ${err}`)
        })
    })
    ;

  app.route('/api/replies/:board')
    .post(function (req, res) {
      let board = req.params.board;
      let reply = {};
      reply.text = req.body.text;
      reply.delete_password = req.body.delete_password;
      reply._id = new objectID();
      reply.reported = false;
      let collection = req.db.collection(COLLECTION_NAME);
      let threadID = new objectID(req.body.thread_id);
      let bumpedOn = new Date();
      reply.created_on = bumpedOn;
      collection.findOneAndUpdate({ _id: threadID },
        {
          $set: { bumped_on: bumpedOn },
          $push: { replies: reply }
        });
      res.redirect(`/b/${board}/${req.body.thread_id}`)
    })

    .get(function (req, res) {
      let collection = req.db.collection(COLLECTION_NAME);
      let board = req.params.board;
      let threadID = new objectID(req.query.thread_id);
      collection.findOne({ _id: threadID },
        {fields: {
          reported: false,
          delete_password: false,
          'replies.reported': false,
          'replies.delete_password': false
        }},
        function (err, result) {
          if (err) res.send(`DB Error: ${err}`)
          else res.send(result);
        })
    })

    .delete(function(req, res) {
      let board = req.params.board;
      let collection = req.db.collection(COLLECTION_NAME);
      let threadID = new objectID(req.body.thread_id);
      let replyID = new objectID(req.body.reply_id);
      let deletePassword = req.body.delete_password;
      collection.findOne({_id: threadID, 'replies._id':replyID}, {'replies.$':1}).then(doc => {
        if (doc.replies[0].delete_password === deletePassword) {
          collection.updateOne({_id: threadID, 'replies._id':replyID},
            {$set: {'replies.$.text': `[deleted]`}})
          res.send(`success`);
        }
        else res.send(`incorrect password`);
      })
      .catch(err => {
        res.send(`DB Error: ${err}`);
      })
    })
    ;

};
