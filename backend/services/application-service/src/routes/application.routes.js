const { PrismaClient }=require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4003;
const controller = require("../controllers/appliaction.controller");
const router = express.Router();


router.post('/addApplications',controller.addApplications);
router.post('/addStatus',controller.addStatus);
router.get('/applications',controller.applications);
router.get('/applications/:id',controller.applicationById);
router.get('/getStatus',controller.getStatus);
router.delete('/applications/:id',controller.deleteById);



module.exports = router;

