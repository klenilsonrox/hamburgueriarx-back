import { db } from "../database/conndb.js";
import {
    createOrderService,
    deleteOrderService,
    getAllOrdersService,
    getOrderByIdService,
    updateStatusOrderService,
} from "../services/orders-services.js";
import mongoose from "mongoose";
import Order from "../models/Order.js";


export const createOrderController = async (req, res) => {
    const products = req.body.products;

    try {
        const productsIds = products.map((product) => product.productId);

        const produtos = await db.product.findMany({
            where: { id: { in: productsIds } },
            select: {
                id: true,
                title: true,
                price: true,
                imageUrl: true,
            },
        });

        const editeProducts = produtos.map((produto) => {
            const productIndex = products.findIndex((product) => product.productId === produto.id);

            return {
                id: produto.id,
                title: produto.title,
                price: produto.price,
                imageUrl: produto.imageUrl,
                quantity: products[productIndex].quantity,
                observacao: products[productIndex].observacao,
            };
        });

        const user = {
            id: req.user.id,
            name: req.user.name,
            rua: req.user.rua,
            whatsapp: req.user.whatsapp,
            numero: req.user.numero,
            bairro: req.user.bairro,
            referencia: req.user.referencia,
            complemento: req.user.complemento,
        };

        const order = await createOrderService(user, editeProducts);
        return res.status(201).json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message, success: false });
    }
};

export const getAllordersController = async (req, res) => {
    try {
        const orders = await getAllOrdersService();
        return res.status(200).json({ orders, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message, success: false });
    }
};

export const getOrdersByUserIdController = async (req, res) => {
    const userId = req.user.id;
    console.log(req.user)
    try {
        const orders = await getAllOrdersService();
        const minhasOrders = orders.filter((order) => order.user.id === userId);

        if (minhasOrders.length > 0 && minhasOrders[0].user.id !== req.user.id) {
            return res.status(403).json({ error: 'Acesso negado', success: false });
        }

        if(req.user.isAdmin) return res.status(200).json({ orders, success: true });


        return res.status(200).json({ minhasOrders, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message, success: false });
    }
};

export const getOrderByIdController = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido', success: false });
    }

    try {
        const order = await getOrderByIdService(id);
        if (!order) {
            return res.status(404).json({ error: 'Nenhum pedido encontrado', success: false });
        }

        if (req.user.isAdmin) {
            return res.status(200).json({ order, success: true });
        }

        if (order.user.id != req.user.id) {
            return res.status(403).json({ error: 'Acesso negado', success: false });
        }

        const orderEditada = {
            Orderid: order._id.toString(),
            userId: order.user.id,
            name: order.user.name,
            whatsapp: order.user.whatsapp,
            rua: order.user.rua,
            numero: order.user.numero,
            bairro: order.user.bairro,
            complemento: order.user.complemento,
            referencia: order.user.referencia,
            status: order.status,
            products: order.products,
        };

        return res.status(200).json({ order: orderEditada, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message, success: false });
    }
};

export const deleteOrderController = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido', success: false });
    }

    try {
        const orderExist = await getOrderByIdService(id);

        if (!orderExist) {
            return res.status(404).json({ error: 'Nenhum pedido encontrado', success: false });
        }

        await deleteOrderService(id); // Deletar o pedido

        const orders = await getAllOrdersService(); // Obter a lista atualizada de pedidos
        return res.status(200).json({ message: "Pedido deletado", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message, success: false });
    }
};

export const updateStatusOrderController = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido', success: false });
    }

    try {
        const order = await getOrderByIdService(id);

        if (!order) {
            return res.status(404).json({ error: 'Nenhum pedido encontrado', success: false });
        }

        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Acesso negado', success: false });
        }

        const updatedOrder = await updateStatusOrderService(id, status);
        return res.status(200).json({ updatedOrder, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message, success: false });
    }
};

export const getTotalB = async () => {
    try {
        const orders = await Order.find().populate('products');
        return orders;
    } catch (error) {
        console.error('Erro ao buscar ordens:', error);
        throw error;
    }
};
