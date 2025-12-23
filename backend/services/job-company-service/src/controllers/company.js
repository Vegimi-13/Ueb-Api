const prisma=require("../prisma");

exports.createCompany=async(req,res)=>{
    try{
        const{
            name,
            description,
            website,
            numberOfEmployees
        }=req.body;
        const ownerId=req.user.id;

         if (!name) {
      return res.status(400).json({ error: "Company name is required" });
         }

      const company= await prisma.company.create({
        data: 
        {
            name,
            description,
            website,
            numberOfEmployees,
            ownerId
        },
      });
      return res.status(201).json(company);
    
    }catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create company" });
  }
}

exports.getAllCompanies=async(req,res)=>{
    try{
        const companies=await prisma.company.findMany();
        return res.json(companies);
    }catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch companies" });
  }

}

exports.getCompanyById= async(req,res)=>{
    const id=parseInt(req.params.id);
    try{
        const company=await prisma.company.findUnique({where:{id}});
        if (!company) return res.status(404).json({ error: "Company not found" });
          return res.json(company);
    }catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch company" });
  }
}

exports.updateCompany=async(req,res)=>{
    const id=parseInt(req.params.id);
    try{
        const company= await prisma.company.findUnique({where: {id}});
        if (!company) return res.status(404).json({ error: "Company not found" });

    if (company.ownerId !== req.user.id) {
      return res.status(403).json({ error: "You are not the owner of this company" });
    }
    const{
            name,
            description,
            website,
            numberOfEmployees
        }=req.body;

    const updatedCompany= await prisma.company.update({
        where: {id},
        data: {
            name,
            description,
            website,
            numberOfEmployees
        },
    });
    return res.json(updatedCompany);



    }catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update company" });
  }
}

exports.deleteCompany=async(req,res)=>{
    const id=parseInt(req.params.id);

    try{
        const company=await prisma.company.findUnique({where: {id}});
        if (!company) return res.status(404).json({ error: "Company not found" });

    if (company.ownerId !== req.user.id) {
      return res.status(403).json({ error: "You are not the owner of this company" });
    }

    await prisma.company.delete({where: {id}});
    return res.json({message: "Company deleted"});

    }catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete company" });
  }
}