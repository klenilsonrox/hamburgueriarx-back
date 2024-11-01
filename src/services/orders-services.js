

import Order from "../models/Order.js";




export const getAllOrdersService = async () => {
    const orders = await Order.find();
    return orders;
}


export const createOrderService = async (user, products,tipoServico,metodoPagamento) => {


    const order = new Order({
        user: {
            id: user.id,
            name: user.name,
            whatsapp: user.whatsapp,
            rua: user.rua,
            numero: user.numero,
            bairro: user.bairro,
            complemento: user.complemento,
            referencia: user.referencia,
    
        },
        products,
        tipoServico: tipoServico,
        metodoPagamento:metodoPagamento 
    });
    await order.save();
    return order;
}

export const getOrdersByUserIdService = async (userId) => {
    const orders = await Order.find({
        "user.id": userId 
    });
    return orders;
}


export const getOrderByIdService = async (id) => {
    
    const order = await Order.findById(id)
    return order;
};



export const deleteOrderService = async (id) => {
     await Order.findByIdAndDelete(id)
    return
}

export const updateStatusOrderService = async (id, status) => {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true })  
    return order
}


export const getTotalOrdersServices = async () => {
   const orders = await Order.find()
   return orders
}





