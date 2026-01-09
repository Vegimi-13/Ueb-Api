const prisma= require('../prisma');



exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      salary,
      startTime,
      endTime,
      JobType,
      categoryId,
      locationId,
    } = req.body;

    if (!title || !description || !categoryId || !locationId) {
      return res.status(400).json({
        error: "title, description, categoryId and locationId are required",
      });
    }

    
    const company = await prisma.company.findFirst({
      where: { ownerId: req.user.id },
    });

    if (!company) {
      return res.status(400).json({ error: "You must create a company first" });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        salary,
        startTime,
        endTime,
        JobType,
        categoryId: Number(categoryId),
        locationId: Number(locationId),
        companyId: company.id, 
      },
      include: {
        category: true,
        location: true,
        company: true,
      },
    });

    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const { search, categoryId, locationId, minSalary, maxSalary } = req.query;

    const filters = {};

    if (categoryId) filters.categoryId = Number(categoryId);
    if (locationId) filters.locationId = Number(locationId);

    const min = Number(minSalary);
    const max = Number(maxSalary);

    if (!Number.isNaN(min) || !Number.isNaN(max)) {
      filters.salary = {};
      if (!Number.isNaN(min)) filters.salary.gte = min;
      if (!Number.isNaN(max)) filters.salary.lte = max;
    }

    
  if (search) {
  filters.title = {
    contains: search.toLowerCase(),
  };
}


    const jobs = await prisma.job.findMany({
      where: filters,
      include: {
        category: true,
        location: true,
        company: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(jobs);

  } catch (err) {
    console.error("GET /jobs ERROR:", err);
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
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
        console.log("Error updating job:", err);
        res.status(500).json({ error: err.message });
    }
}

exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "Invalid job ID" });
    }

    const jobId = Number(id);

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!job) return res.status(404).json({ error: "Job not found" });

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!job.company) return res.status(400).json({ error: "Job has no company" });

    if (job.company.ownerId !== req.user.id) {
      return res.status(403).json({ error: "You do not own this job" });
    }

    await prisma.job.delete({ where: { id: jobId } });

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.jobById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        category: true,
        location: true
      }
    });

    if (!job) return res.status(404).json({ error: "Job not found" });

    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.jobByIdAndCompany = async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    const ownerId = req.user.id;
    const job = await prisma.job.findFirst({
      where: { id:jobId,
        company: {
          ownerId: ownerId
        },
       },
      
      include: {
        company: true,
        category: true,
        location: true
      }
    });

    if (!job) return res.status(404).json({ error: "Job not found" });

    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
