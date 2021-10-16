const express=require('express')
const app=express()

app.get('/',(req,res)=>{
    res.send("HomePage")
})

app.listen(process.env.PORT||8080,()=>{
    console.log('Yelp camp is listening on 8080')
})