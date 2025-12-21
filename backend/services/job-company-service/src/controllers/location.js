const prisma= require("../prisma");

exports.createLocation=async(req,res)=>{
    try{
        const {name}=req.body;

        const location=await prisma.location.create({
            data: {name},
        });
        res.json(location);

    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.getAllLocations=async(req,res)=>{
    try{
        const locations=await prisma.location.findMany();
        res.json(locations);
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.updateLocation=async(req,res)=>{
    try{
        const {id}=req.params;
        const {name}=req.body;

        const updated=await prisma.location.update({
            where: {id: Number(id)},
            data: {name},

        });
        res.json(updated);
    }catch(err){
        res.status(500).json({error: err.message});
    }

}


exports.deleteLocation=async(req,res)=>{
    try{
       const {id}=req.params; 
       await prisma.location.delete({
        where: {id: Number(id)},
       });
       res.json({message: "Location deleted."});
    }catch(err){
        res.status(500).json({error: err.message});
    }

}
