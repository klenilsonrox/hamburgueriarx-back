import { ref, getDownloadURL, uploadBytesResumable,deleteObject  } from "firebase/storage"
import { storage } from "./firebase.js";
import { v4 as uuidv4 } from 'uuid';


export const uploadImage = async (file)=>{
    const refName = uuidv4().replace(/-/g, '');

    const imageName = `${file.fieldname}${refName}`

    const storageRef = ref(storage, `images/${imageName}`)

    const metadata = {
        contentType: file.mimetype
    }

    const snapShot = await uploadBytesResumable(storageRef,file.buffer,metadata)

    const imageUrl = await getDownloadURL(snapShot.ref)

    return {imageUrl,imageName}

}


export const deleteImage = async (imageName)=>{
   try {
    const storageRef=ref(storage,`images/${imageName}`)
    await deleteObject(storageRef)
    return  {sucess:true, message:"imagem deletada com sucesso"}
   } catch (error) {
        return {sucess:false, message:"Erro ao deletar imagem", error}
   }
}




