const prisma=require("../prisma");

exports.createCategory=async(req,res)=>{
    try{
        const {name}=req.body;

        const category=await prisma.category.create({
            data: {name},
        });
        res.json(category);
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.getAllCategories=async(req,res)=>{
    try{
        const categories=await prisma.category.findMany();
        res.json(categories);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

exports.updateCategory=async(req,res)=>{
    try{
        const {id}=req.params;
        const{name}=req.body;

        const updated=await prisma.category.update({
            where: {id: Number(id)},
            data: {name},
        });
        res.json(updated);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

exports.deleteCategory=async(req,res)=>{
    try{
        const {id}=req.params;
        await prisma.category.delete({
            where: {id: Number(id)},
        });

        res.json({message: "Category deleted"});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};