import { data } from '/server/data.jsx';

Meteor.methods({

    adddata(title, codecv, expiryDate, note) {
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
        data.insert({
            title: title,
            codecv: codecv,
            state: ed,
            CreateAT: new Date(),
            expiryDate: expiryDate,
            note : note            
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
    }

});

Meteor.publish("allData", function () {
    return data.find({}, { sort: { 'CreateAT': -1 }, limit: 100 });
});
