const express=require("express");
const prisma=require("./prisma");
require("dotenv").config();

const app=express();
app.use(express.json());

const PORT=process.env.PORT || 4002;
/*
app.get("/",async(req, res)=>{
    try{
        const test=await prisma.$queryRaw`SELECT 1`;
        res.json({message: "Job Company service is running!", db:"connected"});
    }catch(error){
        res.status(500).json({error: "database connection failed", details: error});
    }
});*/

app.listen(PORT,()=>{
    console.log(`Job-Company Service running on port ${PORT}`);
});