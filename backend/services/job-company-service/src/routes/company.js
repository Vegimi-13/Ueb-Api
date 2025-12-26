const express=require("express");
const router=express.Router();
const controller=require("../controllers/company");
const auth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");


router.post("/",auth,requireRole("EMPLOYER","ADMIN"),controller.createCompany);
router.get("/",controller.getAllCompanies);
router.get("/:id", controller.getCompanyById);
router.put("/:id",auth,requireRole("EMPLOYER","ADMIN"),controller.updateCompany);
router.delete("/:id", auth,requireRole("EMPLOYER","ADMIN"), controller.deleteCompany);

module.exports=router;