import { model, Schema } from "mongoose";

const orderSchema = new Schema({
    user :{
        id:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        },
        whatsapp:{
            type:String,
            required:true
        },
        rua:{
            type:String,
            required:true
        },
        numero:{
            type:String,
            required:true
        },
        bairro:{
            type:String,
            required:true
        },
        complemento:{
            type:String,
        },
        referencia:{
            type:String,
        },
        
    },
    products:[{
        id:{
            type:String,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        imageUrl:{
            type:String,
            required:true
        },
        observacao:{
            type:String,
            required:false
        }
    }],
    status:{
        type:String,
        default:"PENDENTE",
        required:true
    },
    tipoServico:{
        type:String,
        required:true
    },
    metodoPagamento:{
        type:String,
        required:true
    }
},
{timestamps:true})




const Order = model("Order", orderSchema);

export default Order