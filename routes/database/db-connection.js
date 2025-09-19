const mysql = require('mysql')

const dbConn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'sis_api_db_2025_2'
})
dbConn.connect(
    (err, res)=>{
        if(err) return console.log("Connection fail", err)
        console.log('Connected to database')
    }
)
module.exports=dbConn