import { ProductStatus } from "@prisma/client";
import { getCategoryByIdService } from "../services/categories-services.js";
import { createProductservice, deleteProductService, getAllProductsService, getProductByIdService, getProductBySlugService, getProductByTitleService, updateProductService,updateStatusProductService } from "../services/products-services.js";
import { deleteImage, uploadImage } from "../utils/sendAndDeleteImage.js";
import slugify from "slugify";


export const createProductController = async (req, res) => {
    const { title, description, price, categoryId } = req.body;
    const file = req.file;

    try {
        // Verifique se todos os campos necessários foram enviados
        if (!title || !description || !price || !categoryId) {
            return res.status(400).json({
                message: "Envie todos os campos",
                success: false,
            });
        }

        if (!file) {
            return res.status(400).json({
                message: "Envie uma imagem",
                success: false,
            });
        }


        if (!file.mimetype.includes("image")) {
            return res.status(400).json({
                message: "Envie apenas arquivos de imagem",
                success: false,
            });
        }


        const slug = slugify(title, { lower: true });

        const productExist = await getProductBySlugService(slug)

        if(productExist){
            return res.status(400).json({
                message: "Ja existe um produto com esse nome",
                success: false
            })
        }


        const { imageName, imageUrl } = await uploadImage(file);


        const produtoCriado = {
            title,
            description,
            price: Number(price),
            categoryId,
            slug,
            imageName,
            imageUrl,
        };

    
        const product = await createProductservice(produtoCriado);

       
        return res.status(201).json({ product, success: true });

    } catch (error) {
        return res.status(500).json({ "houve um erro": error.message, success: false });
    }
};


export const getAllProductsController = async (req, res) => {
    try {

        const { page = 1, limit = 10 } = req.query;

        
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

       
        const products = await getAllProductsService(pageNumber, limitNumber);

        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ "houve um erro": error.message, success: false });
    }
};


export const getProductByIdControllwer = async (req,res)=>{
    const {id} = req.params
    try {
        const product = await getProductByIdService(id)

        if(!product){
            return res.status(400).json({
                error: "Produto inexistente",
                success: false
            })
        }

        return res.status(200).json({product, sucess: true});
    } catch (error) {
        return res.status(500).json({ "houve um erro": error.message, sucess: false });
    }
}


export const updateProductController = async (req, res) => {
    const { id } = req.params;
    const { title, description, price, categoryId } = req.body;
    const file = req.file;

    try {
        const product = await getProductByIdService(id);
        if (!product) {
            return res.status(400).json({
                error: "Produto não existe",
                success: false,
            });
        }

        const categoriaExist = await getCategoryByIdService(product.categoryId)

        if(!categoriaExist){
            return res.status(400).json({
                error: "Categoria inexistente",
                success: false
            })
        }

     
        if (title && typeof title === 'string') {
            product.slug = slugify(title, { lower: true });
        }

        if (file && !file.mimetype.includes("image")) {
            return res.status(400).json({
                message: "Envie apenas arquivos de imagem",
                success: false,
            });
        }

        if (file) {
            const { imageName, imageUrl } = await uploadImage(file);
            await deleteImage(product.imageName);
            product.imageName = imageName;
            product.imageUrl = imageUrl;
        }

   
        const updatedProductData = {
            title: title || product.title,
            description: description || product.description,
            price: price !== undefined ? Number(price) : Number(product.price),
            categoryId: categoryId || product.categoryId,
            slug: product.slug,
            imageName: product.imageName, 
            imageUrl: product.imageUrl,
        };

        const updatedProduct = await updateProductService(id, updatedProductData);

        return res.status(200).json({ product: updatedProduct, success: true });
    } catch (error) {
        return res.status(500).json({ "houve um erro": error.message, success: false });
    }
};


export const deleteProductController = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await getProductByIdService(id);
        if (!product) {
            return res.status(400).json({
                error: "Produto inexistente",
                success: false,
            });
        }

        const productDeleted=await deleteProductService(id);

        await deleteImage(productDeleted.imageName);

        return res.status(200).json({ message: "Produto excluído", success: true });
    } catch (error) {
        return res.status(500).json({ "houve um erro": error.message, success: false });
    }
};


export const getProductBySlugController = async (req, res) => {
    const { slug } = req.params;
    try {
        const product = await getProductBySlugService(slug);
        if (!product) {
            return res.status(400).json({
                error: "Produto inexistente",
                success: false,
            });
        }
        return res.status(200).json({ product, success: true });
    } catch (error) {
        return res.status(500).json({ "houve um erro": error.message, success: false });
    }
};



export const updateProductStatusController = async (req, res) => {
    const { status } = req.body; 
    const id = req.params.id; 

    if (!Object.values(ProductStatus).includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Status inválido. Use "AVAILABLE" ou "UNAVAILABLE".',
        });
    }

    try {
        const data = { status }; 
        const produtoAtualizado = await updateStatusProductService(id, data);
        return res.status(200).json({ produtoAtualizado, success: true });
    } catch (error) {
        return res.status(500).json({ "houve um erro": error.message, success: false });
    }
};


export const getProductByTitleController = async (req, res) => {
    try {
        const { title } = req.query; // Obtém o título da query string

        if (!title) {
            return res.status(400).json({ message: "O título é obrigatório para a busca." });
        }

        const products = await getProductByTitleService(title);

        if (products.length === 0) {
            return res.status(404).json({ message: "Nenhum produto encontrado com esse título." });
        }

        return res.status(200).json(products);
    } catch (error) {
        console.error("Erro no controller ao buscar produto por título:", error);
        return res.status(500).json({ message: "Erro interno ao buscar produto por título." });
    }
};


