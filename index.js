const http=require('http');
const fs=require('fs');
var requests=require('requests');


const homeFile=fs.readFileSync("home.html","utf-8");

const replaceVal=(tempVal,orgVal)=>
{
    var kToCeltemp =orgVal.main.temp -273.15 ;
    var kToCelmin =orgVal.main.temp_min -273.15 ;
    var kToCelmax =orgVal.main.temp_max -273.15 ;
    
    let temperature=tempVal.replace("{%tempval%}",kToCeltemp);
   // console.log(kToCel);
    temperature=temperature.replace("{%tempmin%}",kToCelmin);
    
     temperature=temperature.replace("{%tempmax%}",kToCelmax);
     temperature=temperature.replace("{%location%}",orgVal.name);
     temperature=temperature.replace("{%country%}",orgVal.sys.country);
     return temperature;


}



const server=http.createServer((req,res)=>
{

    if(req.url=="/")
    {
   
        requests('https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=408ce9c75aa9f9066df97c35c70b64f4')
        .on('data', function (chunk) {
            const objdata=JSON.parse(chunk);
            const arrData=[objdata];
          //console.log(arrData[0].main.temp)
         const realTimeData=arrData.map((val)=>replaceVal(homeFile,val)).join("");
             res.write(realTimeData);   
          
        })
        .on('end', function (err) {
          if (err) return console.log('connection closed due to errors', err);
         res.end();
         
        });

    }
});


server.listen(8003,"127.0.0.1");