import { data } from '/server/data.jsx';
import fs from 'fs';
import Future from 'fibers/future';

JsonRoutes.add('get', '/file/:filename', function (req, res, next) {
  var path = "FileUploaded";
  name = req.params.filename;
  chroot = "../../../../..";
  path = chroot + (path ? '/' + path + '/' : '/');
  // indicate a download and set the filename of the returned file
  res.writeHead(200, {
    'Content-Disposition': 'attachment; filename=' + name,
  });
  // read a stream from the local filesystem, and pipe it to the response object
  // note that anything you put in the `private` directory will sit in
  // assets/app/ when the application has been built
  fs.createReadStream(path + name).pipe(res);
});

Meteor.methods({

  adddata(title, codecv, expiryDate, file, filename, nk_cv, dvxl, ) {
    var ed = 0
    var now = new Date();
    var exDate = new Date(expiryDate);
    var a = (exDate - now) / 86400000;
    if (a <= 1 && a > 0) {
      ed = 1
    }
    else {
      if (a > 0)
        ed = 0
      else
        ed = -1
    }    
    Meteor.call('saveFile', file, filename);
    data.insert({
      title: title,
      codecv: codecv,
      state: ed,
      CreateAT: new Date(),
      expiryDate: expiryDate,
      nk_cv: nk_cv,
      dvxl: dvxl,
      filename: filename,
    });
  },

  updateData(item) {
    var now = new Date();
    var exDate = new Date(item.expiryDate);
    var a = (exDate - now) / 86400000;

    if (a <= 1 && a > 0) {
      data.update(item._id, {
        $set: { state: 1 }
      });
    }
    else {
      if (a > 0)
        data.update(item._id, {
          $set: { state: 0 }
        });
      else
        data.update(item._id, {
          $set: { state: -1 }
        });
    }
  },

  deletedata(data) {
    data.remove(data._id);
  },

  saveFile(blob, name, encoding) {
    var future = new Future();
    var path = cleanPath("FileUploaded")
    name = cleanName(name || 'file'), encoding = encoding || 'binary', chroot = "../../../../..";
    path = chroot + (path ? '/' + path + '/' : '/');

    fs.writeFile(path + name, blob, 'binary', function (err) {
      if (err) {
        throw (err);
      } else {
        console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
        result = name;
        future.return(result);
      }
    });

    return future.wait();

    function cleanPath(str) {
      if (str) {
        return str.replace(/\.\./g, '').replace(/\/+/g, '').
          replace(/^\/+/, '').replace(/\/+$/, '');
      }
    }
    function cleanName(str) {
      return str.replace(/\.\./g, '').replace(/\//g, '');
    }
  },

});

Meteor.publish("allData", function () {
  return data.find({}, { sort: { 'CreateAT': -1 }, limit: 100 });
});
