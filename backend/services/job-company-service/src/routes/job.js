const express=require("express");
const router=express.Router();
const controller=require("../controllers/job");
const auth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");



router.post("/",auth,requireRole("EMPLOYER","ADMIN"),controller.createJob);
router.get("/",controller.getAllJobs);
router.put("/:id",controller.updateJobs);
router.delete("/:id", controller.deleteJob);

module.exports=router;