import { db } from "../database/conndb.js";


export const createCategoryService = async (data) => {
    try {
        const category = await db.category.create({
            data: data
        });
        return category;
    } catch (error) {
        console.error("Erro capturado:", error.message); // Loga o erro no console
        throw new Error(`Erro ao criar categoria: ${error.message}`);  // Constrói uma mensagem adequada
    }
}




export const getAllCategoryService = async ()=>{
    try {
        const categories = await db.category.findMany({
            include:{
                products: {
                    orderBy: {
                        price: 'desc'
                    }
                }
            }
        })
        return categories
    } catch (error) {
        throw new Error("erro ao encontrar categorias",error.message)
    }
}


export const getCategoryByIdService = async (id)=>{
    try {
        const category = await db.category.findUnique({
            where:{
                id:id
            }
        })
        return category
    } catch (error) {
        throw new Error("erro ao encontrar categoria",error.message)
    }
}

export const getCategoryByNameService = async (name)=>{
    try {
        const category = await db.category.findFirst({
            where:{
                name:name
            },
            include:{
                products: true
            }
        })
        return category
    } catch (error) {
        throw new Error("erro ao encontrar categoria",error.message)
    }
}

export const getCategoryBySlugService = async (slug, page = 1, limit = 10) => {
    try {
        const offset = (page - 1) * limit; 

        const category = await db.category.findFirst({
            where: {
                slug: slug
            },
            include: {
                products: {
                    skip: offset, 
                    take: limit,
                    orderBy: {
                        price: 'desc'
                    }
                }
            }
        });

        const totalProducts = await db.product.count({
            where: {
                categoryId: category.id
            }
        });

        return { category, total: totalProducts }; 
    } catch (error) {
        throw new Error("Erro ao encontrar categoria", error.message);
    }
};


export const updateCAtegoryService = async (id, data) => {
    try {
        const category = await db.category.update({
            where: {
                id: id,
            },
            data: data,
        });
        return category;
    } catch (error) {
        console.error("Erro ao atualizar categoria:", error); 
        throw new Error("erro ao atualizar categoria: " + error.message); 
    }
};




export const deleteCategoryService = async (id)=>{
    try {
        const category = await db.category.delete({
            where:{
                id:id
            }
        })
        return 
    } catch (error) {
        throw new Error("erro ao deletar categoria",error.message)
    }
}
