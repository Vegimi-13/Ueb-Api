const express=require("express");
const router=express.Router();
const controller=require("../controllers/company");


router.post("/",controller.createCompany);
router.get("/",controller.getAllCompanies);
router.put("/:id",controller.getCompanyById);
router.put("/:id",controller.updateCompany);
router.delete("/:id", controller.deleteCompany);

module.exports=router;