/* 
    SOURCES
    https://medium.com/weekly-webtips/how-to-build-a-react-express-application-with-yarn-e9bebb403558
    https://www.tutorialspoint.com/expressjs/expressjs_environment.htm
    https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
    https://stackoverflow.com/questions/16096872/how-to-sort-2-dimensional-array-by-column-value
    https://medium.com/@onejohi/securing-your-express-restful-apis-using-json-web-tokens-8c2fff0f4e7f
*/

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var cookieParser = require('cookie-parser');

var app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());

app.set('view engine', 'pug');
app.set('views','./views');

//Require the Router we defined in router.js
var merchants = require('./router.js');

//Use the Router on the sub route /merchant
app.use("/login", require("./login"))
app.use('/merchants', merchants);

app.listen(3000);