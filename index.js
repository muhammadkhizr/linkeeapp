const express = require("express");
const app = express();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require("axios").create({baseUrl: "https://jsonplaceholder.typicode.com/"});
var path    = require("path");

app.use(express.urlencoded({urlencoded:true}));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "views");
const port = 5000;

app.listen(port, () => {
	console.log("Server started at port "+ port);
});

app.get('/', async function (req, res) {
    res.render(path.join('myIndex'),{version:"", url: ""});
  });
app.post('/', async function (req, res) {
    var packageName = req.body.packageName || "";
    var inlineRadioOptions = req.body.inlineRadioOptions || "";

    var resp = await myFunc(packageName, inlineRadioOptions);
      
    res.render(path.join('myIndex'),{version:resp, url: packageName});
    })

async function myFunc(url, method){
  if(!url || url == "")return "";
  var checkedUrl = '';
  var checkMethod = 'url';
  
  if(method == "url"){
    const regx = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g);
    if (regx.test(url)) 
  {
    console.log("THis is a url");
      var urlcheck = new URL(url);
      var urlchecked = urlcheck.hostname;
      if(urlchecked=="play.google.com")
      {
        console.log("url checked:"+urlcheck);
        checkedUrl = url;
      }else{
          
          return "You entered a wrong url.";
      }
  }
  else{
    return "Text entered is not a url.";
  }
  }else{
    checkMethod = "package name";
checkedUrl = "https://play.google.com/store/apps/details?id="+url;
  }

  try {
    const res = await axios(`${checkedUrl}`);
    const versionStringRegex = /\["[0-9]+\.[0-9]+\.[0-9.]+"\]/g;
  const data = res.data;
  const matches = data.match(versionStringRegex);
  var result = "";
  if(!matches || matches =="") {return "Unable to find version by given details.";}
  else {
    result = matches[0].match(/[0-9]+\.[0-9]+\.[0-9.]+/g)
  }
  result = "Version: "+result;
  return result;
  } catch (error) {
    console.log("error: "+error)
    return "Either " +checkMethod + " is not correct or version can not be determined.";
  }
}

