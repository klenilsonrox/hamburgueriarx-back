import { createCategoryService, deleteCategoryService, getAllCategoryService, getCategoryByIdService, getCategoryByNameService, getCategoryBySlugService, updateCAtegoryService } from "../services/categories-services.js";
import slugify from "slugify";
import { deleteImage, uploadImage } from "../utils/sendAndDeleteImage.js";

export const createCategoryController = async (req, res) => {
    const { name } = req.body;

    // Gera o slug
    const slug = slugify(name, { lower: true });
    const file = req.file

    try {

        if (!file.mimetype.includes("image")) {
            return res.status(400).json({
                message: "Envie apenas arquivos de imagem",
                success: false,
            });
        }

        
    if(!file){
        return res.status(400).json({
            message: "Envie uma imagem",
            success: false,
     })
        
    }

    if(!name){
        return res.status(400).json({
            message: "Envie um nome",
            success: false,
        })

    }

    if(!file.mimetype.includes("image")){
        return res.status(400).json({
            message: "Envie uma imagem",
            success: false,
        })
    }

     

        const categoryExist = await getCategoryByNameService(name);
        if (categoryExist) {
            return res.status(400).json({
                error: "Categoria ja existe",
                success: false,
            });
        }

        const {imageName,imageUrl} = await uploadImage(file)

        const data = { name, imageUrl, imageName, slug };

        const category = await createCategoryService(data);

        return res.status(201).json({ category, success: true });
    } catch (error) {
        console.error("Erro no controller:", error); 
        return res.status(400).json({ error: error.message, success: false });
    }
};


export const getAllCategoryController = async (req, res) => {
    try {
        const categories = await getAllCategoryService();
        return res.status(200).json({ categories, sucess: true });
    } catch (error) {
        return res.status(400).json({ error: error.message, sucess: false });
    }
};

export const getCategoryByIdController = async(req,res)=>{

}

export const getCategoryByNameController = async(req,res)=>{
    const {name} = req.params;

    try {
        const category = await getCategoryByNameService(name);
        return res.status(200).json({ category, sucess: true });
    } catch (error) {
        return res.status(400).json({ error: error.message, sucess: false });
    }
}

export const getCategoryBySlugController = async (req, res) => {
    const { slug } = req.params;
    const page = parseInt(req.query.page) || 1;  
    const limit = parseInt(req.query.limit) || 10;  

    try {
        const { category, total } = await getCategoryBySlugService(slug, page, limit);
        return res.status(200).json({ category, total, page, totalPages: Math.ceil(total / limit), success: true });
    } catch (error) {
        return res.status(400).json({ error: error.message, success: false });
    }
};


export const updateCAtegoryController = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const categoryExist = await getCategoryByIdService(id);

        if (!categoryExist) {
            return res.status(400).json({
                error: "Categoria inexistente",
                success: false,
            });
        }

        // Permitir a atualização se o nome for igual ao existente
        if (name && categoryExist.name === name) {
            // Opcional: Se você quiser apenas avisar que o nome não mudou
            console.log("O nome da categoria não mudou.");
        }

        const file = req.file;

        if (file && !file.mimetype.includes("image")) {
            return res.status(400).json({
                message: "Envie apenas arquivos de imagem",
                success: false,
            });
        }

        let data = {
            name: categoryExist.name,
            slug: categoryExist.slug,
        };

        if (name) {
            data.name = name; 
            data.slug = slugify(name, { lower: true }); 
        }

        if (file) {
            const { imageName, imageUrl } = await uploadImage(file);
            await deleteImage(categoryExist.imageName);
            data.imageName = imageName;
            data.imageUrl = imageUrl;
        }

        const category = await updateCAtegoryService(id, data);  
        return res.status(200).json({ category, success: true });

    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message, success: false });
    }
};



export const deleteCategoryController = async (req, res) => {
    const { id } = req.params;
    try {

        const categoryExist = await getCategoryByIdService(id);
        if (!categoryExist) {
            return res.status(400).json({
                error: "Categoria inexistente",
                sucess: false,
            });
        }

      await deleteCategoryService(id);

        return res.status(200).json({ message: "Categoria excluída", sucess: true });
    } catch (error) {
        return res.status(400).json({ error: error.message, sucess: false });
    }
};
