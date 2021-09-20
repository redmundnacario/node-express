const http = require("http")

const sample_data = [
    {id: 1, value : "hello world"}
]

const server = http.createServer((req,res) => {
    /* destructuring data in request */ 
    // const {headers, url, method} = req
    // console.log( headers, url, method)
    // res.end()



    /* Setting the response headers */ 
    // res.setHeader("Content-Type", "text/html")
    // // res.setHeader("X-Powered-By", "Node.js")
    // res.write("<h1>Hello</h1>")
    // res.end()
    


    /* Returning Json response*/ 
    res.setHeader("Content-Type", "application/json")
    
    res.end(JSON.stringify({
        success: true,
        data: sample_data
    }))



    /* Sending data to server : HEADERS*/
    // res.writeHead(200, {
    //     "Content-Type" : "application/json",
    //     "X-Powered-By" : "Node.js"
    // })    

    // const auth_key = req.headers.authorization
    // console.log(auth_key)
    // res.end()



    /* Sending data to server : BODY */
    // res.writeHead(200, {
    //     "Content-Type" : "application/json",
    //     "X-Powered-By" : "Node.js"
    // })    

    // let body = []
    // req.on('data', chunk => {
    //     body.push(chunk)
    // }).on('end', () => {
    //     body = Buffer.concat(body).toString()
    //     console.log(body)
    // })
    // res.end()
})

const PORT = 5000
server.listen(PORT, () => {console.log(`Running at port ${PORT}`)})