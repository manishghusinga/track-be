var MongoClient = require('mongodb').MongoClient;

var state = {
  db: null,
  dbInstance: null
};

exports.connect = function(url, done) {
  if (state.db) {
      console.log("db: already connected");
      return done();
  }


  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
    if (err) {
        console.log("db: " + err);
        return done(err);
    }
    state.db = client.db("truckx");
    state.dbInstance = client;
//    done();
  });
};

exports.get = function() {
  return state.db;
};

exports.getCollection = function(name) {

    return state.db.collection(name);
};

exports.close = function(done) {
  if (state.dbInstance) {
    state.dbInstance.close(function (err, result) {
      state.dbInstance = null;
      state.db = null;
      state.mode = null;
      done(err);
    });
  }
};
