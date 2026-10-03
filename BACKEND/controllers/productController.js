import Product from '../models/productModel.js';
import HandleError from "../utils/handleError.js";
import handleAsyncError from '../middleware/handleAsyncError.js';
import APIFUNCTIONALITY from '../utils/apiFunctionality.js';


//Create Product
export const createProducts = handleAsyncError(async (req, res, next) => {
    req.body.user = req.user.id; // Assign the user ID to the product
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
    
});

//All products
export const getAllProducts = handleAsyncError(async (req, res, next) => {
    const resultPerPage = 3;
    const apiFeatures = new APIFUNCTIONALITY(Product.find(), req.query).search().filter();
    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();
    const totalPages = Math.ceil(productCount / resultPerPage);
    const page = Number(req.query.page) || 1;
    if (page > totalPages && productCount > 0) {
        return next(new HandleError("Page number exceeds total pages", 404));
    }
    apiFeatures.pagination(resultPerPage);
    
    const products = await apiFeatures.query;
    if(!products || products.length === 0){
        return next(new HandleError("No products found", 404));
    }
    res.status(200).json({ success: true, products, productCount, resultPerPage, totalPages, currentPage: page });
    
});

//UPDATE PRODUCT
export const updateProduct = handleAsyncError(async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) {
            return next(new HandleError("Product not found", 404));
        }
        res.status(200).json({ success: true, product });
        
        
    } catch (error) {
        return next(new HandleError("Error updating product", 400));
    }
});

//DELETE PRODUCT
export const deleteProduct = handleAsyncError(async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return next(new HandleError("Product not found", 404));
        }
        
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        return next(new HandleError("Error deleting product", 400));
    }
});
//GET SINGLE PRODUCT
export const getSingleProduct = handleAsyncError(async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
            return next(new HandleError("Product not found", 404));
        }
        res.status(200).json({ success: true, product });
    }catch(error){
        return next(new HandleError("Error fetching product", 400));
    }
});