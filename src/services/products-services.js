import { db } from "../database/conndb.js"



export const createProductservice = async (data)=>{
    try {
        const product = await db.product.create({
            data : data
        })

        return product
    } catch (error) {
       console.error("Erro ao criar produto", error) 
       throw new Error(`Erro ao criar produto`)
    }
}


export const getAllProductsService = async (page, limit) => {
    try {
        const products = await db.product.findMany({
            skip: (page - 1) * limit, 
            take: limit, 
            orderBy: { price: 'desc' },
            include: {
                category: true
            }
        });

        
        const totalProducts = await db.product.count(); 
        const totalPages = Math.ceil(totalProducts / limit); 

        return { products, totalProducts, totalPages, currentPage: page };
    } catch (error) {
        throw new Error("erro ao encontrar produtos", error.message);
    }
};


export const getProductByIdService = async (id)=>{
    try {
        const product = await db.product.findUnique({
            where:{
                id:id
            },
            include:{
                category: true
            }
        })
        return product
    } catch (error) {
        throw new Error("erro ao encontrar produtos",error)
    }
}


export const updateProductService = async (id, data) => {
    try {
        const product = await db.product.update({
            where: {
                id: id,
            },
            data: data,
        });
        return product;
    } catch (error) {
        console.error("Erro ao atualizar produto", error); 
        throw new Error(`Erro ao atualizar produto: ${error.message}`); 
    }
};



export const deleteProductService = async (id)=>{
    try {
        const product = await db.product.delete({
            where:{
                id:id
            }
        })
        return product
    } catch (error) {
        throw new Error("erro ao deletar produto",error)
    }
}


export const getProductBySlugService = async (slug)=>{
    try {
        const product = await db.product.findUnique({
            where:{
                slug:slug
            },
            include:{
                category: true
            }
        })
        return product
    } catch (error) {
        throw new Error("erro ao encontrar produtos",error)
    }
}



export const updateStatusProductService = async (id,data)=>{
    const productUpdated = await db.product.update({
        where:{
            id
        },
        data:data
    })

    return productUpdated
}



export const getProductByTitleService = async (title) => {
    try {
        const products = await db.product.findMany({
            where: {
                title: {
                    contains: title, // Busca produtos que contêm o título parcial
                    mode: 'insensitive' // Torna a busca case-insensitive
                }
            },
            include: {
                category: true // Inclui informações da categoria, caso necessário
            }
        });

        return products;
    } catch (error) {
        console.error("Erro ao buscar produto por título", error);
        throw new Error("Erro ao buscar produto por título");
    }
};
