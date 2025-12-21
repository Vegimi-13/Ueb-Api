const express=require("express");
const router=express.Router();
const controller=require("../controllers/category");


router.post("/",controller.createCategory);
router.get("/",controller.getAllCategories);
router.put("/:id",controller.updateCategory);
router.delete("/:id", controller.deleteCategory);

module.exports=router;