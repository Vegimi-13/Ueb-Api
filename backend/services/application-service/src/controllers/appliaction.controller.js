const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { application } = require("express");

module.exports = {
    async addApplications (req,res) {
  try{
    const jobId=req.body.jobId;
    const candidateId=req.user.id;
    const resumeLink = req.body.resumeLink;
    
    const status = await prisma.applicationStatus.findFirst({
      where:{
        name:'Applied'
      }
    });

    const addApp = await prisma.applications.create({
      data:{
        job_id:jobId,
        candidate_id:candidateId,
        status_id:status.status_id,
        resume_link:resumeLink,
        applied_at:new Date(),
      }
    });


    res.json(addApp);

  } catch(error) {
    res.status(500).json({ error: error.message });
  }
 },

 async applications (req, res) { 

    try {
    const applications = await prisma.applications.findMany();
    res.json(applications);
  
 } catch (err) {
    res.status(500).json({ error: err.message });
  }
},
 async applicationById (req,res) {

  try {

    const id = Number(req.params.id);
    const appById = await prisma.applications.findUnique({
      where: { application_id: id }
    });

    if (!appById) {
        return res.status(404).json({ error: "Application not found" });
      }

    res.json(appById);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
  async deleteById (req,res) {
  try {
 const id = Number(req.params.id); 

 const deleted = await prisma.applications.delete({
      where: { application_id: id }
    });

    res.json({
      message: "Application deleted successfully",
      deleted
    });
 } catch (error) {
      res.status(500).json({ error: error.message });
  }
},
 async addStatus (req,res) {
  try{
    const statusName = req.body.name;
    const addStatus = await prisma.applicationStatus.create({
      data:{
        name:statusName
      }
    });
    res.json({
      message: "ApplicationStatus created successfully",
    });
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
},
 async getStatus (req,res) {
  try{
    const statuses = await prisma.applicationStatus.findMany();
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

};

