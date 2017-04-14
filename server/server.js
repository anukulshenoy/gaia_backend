const express = require('express');
const app = express();
const Promise = require("bluebird");
const request = Promise.promisify(require('request'));
var tid = 26681;
var longestPreviewMedia = {};

var options = {
    url: 'http://d6api.gaia.com/vocabulary/1/' + tid,
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
};
//calculate the max preview duration from the videos array
var maxDuration = function(array){
    var max, previewNid, titleNid;
    for (var i = 0; i < array.length; i++) {
        if (!max) {
            max = Number(array[0].preview.duration);
            previewNid = array[0].preview.nid;
            titleNid = array[0].feature.nid;
        }
        if (array[i].preview && Number(array[i].preview.duration) > max) {
                max = Number(array[i].preview.duration);
                previewNid = array[i].preview.nid;
                titleNid = array[i].feature.nid;
            }

    }
    return {"max" : max, "previewNid": previewNid, "titleNid": titleNid};
}

app.get('/terms/26681/longest-preview-media-url', function (req, res) {
    request(options).then(function(data){
        tid = JSON.parse(data.body).terms[0].tid;
        options.url = 'http://d6api.gaia.com/videos/term/' + tid;
        request(options).then(function(data) {
            var videoData = maxDuration(JSON.parse(data.body).titles);
            longestPreviewMedia.previewDuration = videoData.max;
            longestPreviewMedia.previewNid = videoData.previewNid;
            longestPreviewMedia.titleNid = videoData.titleNid;
            options.url = 'http://d6api.gaia.com/media/' + videoData.previewNid;
            request(options).then(function(data){
                longestPreviewMedia.bcHLS = JSON.parse(data.body).mediaUrls.bcHLS;
                res.send(JSON.stringify(longestPreviewMedia));
            }, function(error){
                console.log(error);
            })
        }, function (error){
            console.log(error);
        })

    }, function (error){
        console.log(error);
        res.send("Error");
    });
});

app.listen(3000, function () {
    console.log('Listening on port 3000!')
});