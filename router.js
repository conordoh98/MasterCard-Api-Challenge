var express = require('express');
var router = express.Router();
var merchants = [
    {
        "latitude": "52.986375",
        "longitude": "-6.043701",
        "merchantId": 12,
        "merchantName": "Tesco"
    }
];

//Routes will go here

//get list of merchants ordered by closeness according to Haversine Formula
//  Formula: 
router.get('/', function(req, res){
    const currentLatitude = 53.3438;
    const currentLongitude = 6.2546;
    const distArray = [];
    for(var i=0;i<merchants.length;i++){
        distArray.push([merchants[i].merchantId,getDistanceFromLatLonInKm(currentLatitude, parseInt(merchants[i].latitude), currentLongitude, parseInt(merchants[i].longitude))]);
    }
    distArray.sort(sortFunction);
    var tmp = [];
    for(var i=0;i<distArray.length;i++){
        for(var j=0;j<merchants.length;j++){
            console.log(merchants[j].merchantId);
            if(distArray[i][0]==merchants[j].merchantId){
                tmp.push(merchants[j]);
            }
        }
    }
    res.json(tmp);
 });

 router.get('/:id', function(req, res){
    var currMerchant = merchants.filter(function(merchant){
       if(merchant.merchantId == req.params.id){
          return true;
       }
    });
    if(currMerchant.length == 1){
       res.json(currMerchant[0])
    } else {
       res.status(404);//Set status to 404 as merchant was not found
       res.json({message: "Not Found"});
    }
 });

 router.post('/', function(req, res){
    //Check if all fields are provided and are valid:
    if(!req.body.merchantName ||
        !req.body.latitude ||
        !req.body.longitude ){
       
       res.status(400);
       res.json({message: "Bad Request"});

    } else {
       var newId = merchants[merchants.length-1].merchantId+1;
       merchants.push({
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        merchantId: newId,
        merchantName: req.body.merchantName
       });
       res.json({message: "New merchant created.", location: "/merchants/" + newId});
    }
 });
 
 router.put('/:id', function(req, res){
    //Check if all fields are provided and are valid:
    if(!req.body.merchantName ||
       !req.body.latitude ||
       !req.body.longitude ){

       res.status(400);
       res.json({message: "Bad Request"});
    } else {
       //Gets us the index of merchant with given id.
       var updateIndex = merchants.map(function(merchant){
          return merchant.merchantId;
       }).indexOf(parseInt(req.params.id));
       
       if(updateIndex === -1){
          //merchant not found, create new
          merchants.push({
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            merchantId: parseInt(req.params.id),
            merchantName: req.body.merchantName
          });
          res.json({message: "New merchant created.", location: "/merchants/" + req.params.id});
       } else {
          //Update existing merchant
          merchants[updateIndex] = {
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            merchantId: parseInt(req.params.id),
            merchantName: req.body.merchantName
          };
          res.json({message: "Merchant id " + req.params.id + " updated.", 
             location: "/merchants/" + req.params.id});
       }
    }
 });

 router.delete('/:id', function(req, res){
    var removeIndex = merchants.map(function(merchant){
       return merchant.merchantId;
    }).indexOf(parseInt(req.params.id,10)); //Gets us the index of movie with given id.
    if(removeIndex === -1){
       res.json({message: "Not found"});
    } else {
       merchants.splice(removeIndex, 1);
       res.send({message: "Merchant id " + req.params.id + " removed."});
    }
 });

 function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  };
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  };

  function sortFunction(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
}

module.exports = router;