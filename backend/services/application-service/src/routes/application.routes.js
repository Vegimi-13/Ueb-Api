const { PrismaClient }=require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4003;
const controller = require("../controllers/application.controller");
const router = express.Router();
const requireRole = require("../middleware/role.middleware");
const auth = require("../middleware/auth.middleware");




router.post('/addApplications',auth,requireRole('ADMIN',"CANDIDATE"),controller.addApplications);
router.post('/addStatus',auth,requireRole("ADMIN"),controller.addStatus);
router.get('/applications',auth,requireRole("ADMIN","EMPLOYER"),controller.applications);
router.get('/applications/:id',auth,requireRole("ADMIN","EMPLOYER"),controller.applicationById);
router.get('/getStatus',controller.getStatus);
router.delete('/applications/:id',auth,requireRole("ADMIN","EMPLOYER"),controller.deleteById);
router.get('/candidateApplications',auth,requireRole('CANDIDATE'),controller.candidateApplications)



module.exports = router;

