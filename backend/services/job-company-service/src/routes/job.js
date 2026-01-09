const express=require("express");
const router=express.Router();
const controller=require("../controllers/job");
const auth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");



router.post("/",auth,requireRole("EMPLOYER","ADMIN"),controller.createJob);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of all jobs
 */
router.get("/",controller.getAllJobs);
router.put("/:id",auth,controller.updateJobs);
router.delete("/:id",auth, controller.deleteJob);
router.get("/:id",controller.jobById);
router.get('/jobByIdAndCompany/:id',auth,requireRole('EMPLOYER'),controller.jobByIdAndCompany);

module.exports=router;