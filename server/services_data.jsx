import { data, data2 } from '/server/data.jsx';
import fs from 'fs';
import Future from 'fibers/future';

JsonRoutes.add('get', '/file_vbdi/:filename', function (req, res, next) {
  var path = "FileUploaded/vbdi";
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

JsonRoutes.add('get', '/file_vbden/:filename', function (req, res, next) {
  var path = "FileUploaded/vbden";
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
  getip() {
    var os = require('os');
    var ifaces = os.networkInterfaces();
    var listIP = [];
    Object.keys(ifaces).forEach(function (ifname) {
      var alias = 0;

      ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return;
        }

        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          console.log(ifname + ':' + alias, iface.address);
        } else {
          // this interface has only one ipv4 adress

          listIP.push(iface.address);

        }
        ++alias;
      });
    });
    return listIP;
  },

  adddata(title, codecv, expiryDate, file, filename, nk_cv, dvxl, lvb) {
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
    Meteor.call('saveFile', file, filename, lvb);
    data.insert({
      title: title,
      codecv: codecv,
      state: ed,
      CreateAT: new Date(),
      expiryDate: expiryDate,
      nk_cv: nk_cv,
      dvxl: dvxl,
      filename: lvb + "/" + filename,
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

  deleteData(id) {
    data.remove(id);
  },

  adddata2(title, codecv, file, filename, nk_cv, dvxl, lvb) {
   
    Meteor.call('saveFile', file, filename, lvb);
    data2.insert({
      title: title,
      codecv: codecv,
      CreateAT: new Date(),
      nk_cv: nk_cv,
      dvxl: dvxl,
      filename: lvb + "/" + filename,
    });
  },

  updatedata2(item) {

  },

  deletedata2(id) {
    data2.remove(id);
  },

  saveFile(data, name, lvb) {     
    var encoding;
    var future = new Future();
    var path = cleanPath("FileUploaded")
    name = cleanName(name || 'file'), encoding = encoding || 'binary', chroot = "../../../../..";
    path = chroot + (path ? '/' + path + '/' : '/');
    path += lvb + "/"
    if (data) {
      fs.writeFile(path + name, data, 'binary', function (err) {
        if (err) {
          throw (err);
        } else {
          console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
          result = name;
          future.return(result);
        }
      });

      return future.wait();
    }

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

Meteor.publish("allData2", function () {
  return data2.find({}, { sort: { 'CreateAT': -1 }, limit: 1000 });
});
