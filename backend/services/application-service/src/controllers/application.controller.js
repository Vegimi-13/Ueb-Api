const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const { application } = require("express");
const { uploadResume } = require("../middleware/uploadResume.js");

module.exports = {
    async addApplications(req, res) {
    try {
      const jobId = req.body.jobId;
      const candidateId = req.user.id;
      console.log(candidateId);

      // Check if a file was uploaded (assumes middleware like multer is used)
      if (!req.file) {
        return res.status(400).json({ error: "Resume is required" });
      }

      // Get the file path to store in DB


const resumePath = req.file.path.replace(/\\/g, "/").replace(/^uploads\//, ""); 


      // Get the "Applied" status
      const status = await prisma.applicationStatus.findFirst({
        where: {
          name: "Applied",
        },
      });

      // Create application in DB
      const addApp = await prisma.applications.create({
        data: {
          job_id: Number(jobId),
          candidate_id: candidateId,
          status_id: status.status_id,
          resume_path: resumePath,
          applied_at: new Date(),
        },
      });

      res.json(addApp);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

 async applications (req, res) { 

    try {
      const applications = await prisma.applications.findMany({
        include: {
          status: true,
        }
      });    
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
    console.log("getStatus hit");

  try{
    const statuses = await prisma.applicationStatus.findMany();
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
async candidateApplications (req, res) {
  try {
    const candidateId = req.user.id; // from token

    const applications = await prisma.applications.findMany({
      where: {
        candidate_id: candidateId
      },
      include: {
        status: true,
      }
    });

    res.json(applications);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
},
// controllers/application.controller.js
async editResume(req, res) {
  try {
    const id = Number(req.params.id);
    const candidateId = req.user.id;

    // Find the application
    const application = await prisma.applications.findUnique({
      where: { application_id: id },
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (application.candidate_id !== candidateId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Make sure a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const resumePath = req.file.path.replace(/\\/g, "/").replace(/^uploads\//, "");

    // Update only the resume_path
    const updatedApplication = await prisma.applications.update({
      where: { application_id: id },
      data: { resume_path: resumePath },
    });

    res.json({
      message: "Resume updated successfully",
      updatedApplication,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
// In controllers/application.controller.js
async updateStatus(req, res) {
  try {
    const id = Number(req.params.id);
    const { statusId } = req.body;

    // Validate application exists
    const application = await prisma.applications.findUnique({
      where: { application_id: id },
    });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Update status
    const updatedApp = await prisma.applications.update({
      where: { application_id: id },
      data: { status_id: statusId },
      include: { status: true },
    });

    res.json({
      message: 'Status updated successfully',
      updatedApp,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

async companyApplications (req, res){
  try {
    // Assuming your auth middleware adds user info to req.user
    const companyId = req.user.companyId; // get company ID from token

    // Fetch applications for this company's jobs, including job and candidate info
    const applications = await prisma.applications.findMany({
      where: {
        job: { companyId: companyId }
      },
      include: {
        job: true, // include job details
        candidate: true,
        status: true // include candidate details
      }
    });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
},


};

