const prisma= require('../prisma');



exports.createJob=async(req,res)=>{
    try{
        const{
            title,
            description,
            salary,
            startTime,
            endTime,
            JobType,
            categoryId,
            locationId,
            companyId
        }=req.body;
        if (!title || !description || !categoryId || !locationId || !companyId) {
      return res.status(400).json({
        error: "title, description, categoryId and locationId are required",
      });
    }
    const company = await prisma.company.findUnique({
      where: { id: Number(companyId) },
    });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    if (company.ownerId !== req.user.id) {
      return res.status(403).json({ error: "You do not own this company" });
    }

        const job= await prisma.job.create({
            data :{ 
                title,
                description,
                salary,
                startTime,
                endTime,
                JobType,
                categoryId,
                locationId,
                companyId
            },
            include: {
                category: true,
                location: true,
                company: true,
            },
            

        });
        res.json(job);
    }catch(err){
        res.status(500).json({error: err.message});

    }
}
exports.getAllJobs=async(req,res)=>{
    try{
        const jobs=await prisma.job.findMany({
            orderBy: {
                createdAt: "desc",
            }
        });
        res.json(jobs);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

exports.updateJobs=async(req,res)=>{
    try{
        const {id}=req.params;

        const job=await prisma.job.findUnique({
            where: {id: Number(id)},
            include: {company: true},
        });
        if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (job.company.ownerId !== req.user.id) {
      return res.status(403).json({ error: "You do not own this job" });
    }
        const{
            title,
            description,
            salary,
            startTime,
            endTime,
            JobType,
            categoryId,
            locationId,
            
        }=req.body;

        const updated=await prisma.job.update({
            where: {id: Number(id)},
            data :{ 
                title,
                description,
                salary,
                startTime,
                endTime,
                JobType,
                categoryId,
                locationId,
                
            },
            include: {
                category: true,
                location: true,
                

            }
            
        });
        res.json(updated);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: Number(id) },
      include: { company: true },
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (job.company.ownerId !== req.user.id) {
      return res.status(403).json({ error: "You do not own this job" });
    }

    await prisma.job.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};