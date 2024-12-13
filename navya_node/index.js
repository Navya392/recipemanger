const http = require("http");
const path = require("path");
const fs = require("fs");

const {MongoClient} = require('mongodb');

const URI = "mongodb+srv://recipesDB:recipespassword@cluster0.ecqib.mongodb.net/recipesDB?retryWrites=true&w=majority&appName=Cluster0";
const mongoconnect = new MongoClient(URI);


const server = http.createServer((req, res) =>{
    console.log(req.url);
    if(req.url ==='/'){ // home page

        fs.readFile(path.join(__dirname,'public','index.html'),(err,content)=>{

        if (err) throw err ;
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(content)
         })
    }  
    else if (req.url === '/api') {
        const headers =
        {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
            "Content-Type": 'application/json'
        };
        (async(req,res)=>{
            try
            {
                // connect to the MongoDB cluster
                await mongoconnect.connect();
                const collection = mongoconnect.db("recipesDB").collection("recipes");
                console.log(collection);
                const cursor = collection.find({});
                const recipes = await cursor.toArray();
                const js = (JSON.stringify(recipes));
                res.writeHead(200, headers);
                res.end(js);
                console.log(js);

            }catch (err) {
                console.error(err);
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('server failed to handle the request');
              } finally {
                await mongoconnect.close();
              }
        })(req,res);
     }
    else{
        res.end("<h1> Sorry,No DATA Found here </h1>")
    }

});

const PORT= process.env.PORT || 9520;

// port, callback
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});