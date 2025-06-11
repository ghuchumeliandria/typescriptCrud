import { Request, Response, Router } from "express";
import productsModel from "../models/productsModel/products.model";
import productValSchema from "../validations/product.validation";
import { deleteFromCloudinary, upload } from "../config/cloudinary/config.cloudinary";
import { isValidObjectId } from "mongoose";
import productDelMiddleware from "../middlewares/productDel.middleware";
import { func, string } from "joi";

const productRouter = Router() 
// productRouter.get('/', async (req: Request,res : Response) =>{
//     const products = await productsModel.find()
//     const category = req.query.category
//     const price = req.query.price
    
    
//     const filteredQuery = products.filter(el => el.category === category)
    
//     if(price === "desc"  ) {
//         filteredQuery.sort((a,b) => b.price - a.price)
//     }else if(price == "inc"){
//         filteredQuery.sort((a,b) => a.price - b.price)
//     }else{
//         res.status(400).json({error : "baad requestia dzmaoa cudi queria"})
//         return
//     }
    
    
//     res.json(filteredQuery)
// })
// productRouter.get("/" , async(req,res) =>{
//     const page = Number(req.query.page) || 1
//     const limit = Number(req.query.limit) || 10
//     const products = await productsModel.find().skip(page).limit(limit)
//     
//     res.json(products)
// })
productRouter.get("/" , async(req,res) =>{
    const search = String(req.query.search)
    const products = await productsModel.find()
    if(search !== 'phone'){
        res.status(400).json({error : 'invalid query jigaro'})
        return
    }
    const filteredProducts =  products.filter(el => el.productName.includes(search))
    
    res.json(filteredProducts)
})



productRouter.post("/" , upload.single('image'), async (req : Request ,res : Response)  =>{
    const {error} = productValSchema.validate(req.body || {} , {abortEarly : false})
    
    if(error){
        res.status(400).json({error : error.details.map(er => er.message)})
        return
    }
    const {productName,description,price,category} = req.body
    if(!productName || !description || !price || !category){
        res.status(400).json({error : 'fields are required'})
        return
    }
    const createProduct = await productsModel.create({productName,description,price,category , image : req.file?.path})
    res.status(201).json({message : "product created successfully" , product : createProduct})
})

productRouter.post("/:id/review" , async(req,res) =>{
    const {id} = req.params
    if(!isValidObjectId(id)) {
        res.status(400).json({error : "invalid product"})
        return
    }

    const {email , rating , comment} = req.body

    if(!email || !rating || !comment) {
        res.status(400).json({error : "required fields"})
        return
    }
    
    const product = await productsModel.findByIdAndUpdate(id ,  {$push : {reviews : {email , rating ,comment}}} , {new : true})

    res.json(product)
})

productRouter.put('/:id' ,productDelMiddleware  , upload.single('image') , async(req,res) =>{
    const {error} = productValSchema.validate(req.body || {} , {abortEarly : false})
    if(error){
        res.status(400).json({error : error.details.map(er => er.message)})
        return
    }
    const {id} = req.params

    if(!isValidObjectId(id)){
        res.status(400).json({error: 'Invalid User'})
        return
    }
    const {productName,description,price,category} = req.body

    
    const product = await productsModel.findById(id)
    if(!product) {
        res.status(400).json({error: "product not found"})
    }
    const fileId = product?.image.split('/uploads')[1].split(".")[0]
    const publicField = `uploads${fileId}`
    await deleteFromCloudinary(publicField)

    if(!productName || !description || !price || !category){
        res.status(400).json({error : 'fields are required'})
        return
    }
    
    const updatedProduct = await productsModel.findByIdAndUpdate(id , {productName,description,price,category , image: req.file?.path} , {new: true})
    res.json(updatedProduct)
})

productRouter.delete("/:id" ,productDelMiddleware , upload.single('image'), async(req,res) =>{
    const {id} = req.params

    if(!isValidObjectId(id)){
        res.status(400).json({error: 'Invalid User'})
        return
    }

    const product = await productsModel.findById(id)
    const fileId = product?.image.split('/uploads')[1].split(".")[0]
    console.log(product?.image)
    const publicField = `uploads${fileId}`;
    console.log(publicField)
    await deleteFromCloudinary(publicField)

    const deletedProduct = await productsModel.findByIdAndDelete(id)

    res.json({deletedProduct})

})

export default productRouter