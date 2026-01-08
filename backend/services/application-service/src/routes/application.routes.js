const { PrismaClient }=require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4003;
const controller = require("../controllers/application.controller");
const router = express.Router();
const requireRole = require("../middleware/role.middleware");
const auth = require("../middleware/auth.middleware");






/**
 * @swagger
 * /addApplications:
 *   post:
 *     summary: Submit a job application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *               - statusId
 *             properties:
 *               jobId:
 *                 type: integer
 *               statusId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Application submitted successfully
 */
router.post('/addApplications',auth,requireRole('ADMIN',"CANDIDATE"),controller.addApplications);

/**
 * @swagger
 * /addStatus:
 *   post:
 *     summary: Add a new application status (Admin only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Status created successfully
 */
router.post('/addStatus',auth,requireRole("ADMIN"),controller.addStatus);

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Get all applications
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all applications
 */
router.get('/applications',auth,requireRole("ADMIN","EMPLOYER"),controller.applications);

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     summary: Get application by ID
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Application details
 */
router.get('/applications/:id',auth,requireRole("ADMIN","EMPLOYER"),controller.applicationById);

/**
 * @swagger
 * /getStatus:
 *   get:
 *     summary: Get all application statuses
 *     tags: [Applications]
 *     responses:
 *       200:
 *         description: List of statuses
 */
router.get('/getStatus',controller.getStatus);

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     summary: Delete an application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Application deleted
 */
router.delete('/applications/:id',auth,requireRole("ADMIN","EMPLOYER"),controller.deleteById);

/**
 * @swagger
 * /candidateApplications:
 *   get:
 *     summary: Get applications for the logged-in candidate
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Candidate's applications
 */
router.get('/candidateApplications',auth,requireRole('CANDIDATE'),controller.candidateApplications)



module.exports = router;

