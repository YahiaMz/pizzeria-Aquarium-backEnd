
import { createWriteStream, fstat } from 'fs';
import { Multer } from 'multer';
import { from } from 'rxjs';
import { v4 as uuidV4 } from 'uuid';
import { MyExceptions } from './MyExceptions';
const mime = require('mime-types');
const fs = require('fs')

export class MyFilesHelper {



 public static CATEGORY_IMAGES_PATH : string = "./uploads/categories/";
 public static FOOD_IMAGES_PATH : string = "./uploads/foods/";
 public static PROFILE_IMAGES_PATH : string = "./uploads/users/";
 public static SLIDES_IMAGES_PATH : string = "./uploads/slides/"

  public static isOfTypePng(mMimetype) : boolean {
    let fileExtinction = mime.extension(mMimetype);

    return  fileExtinction === "png";
  }


  public static isOfTypePngOrJpeg(mMimetype) : boolean {
    let fileExtinction = mime.extension(mMimetype);

    return  (fileExtinction === "png" || fileExtinction == "jpeg");
  }


  public static fileExtension(mMimetype) {
    let fileExtinction = mime.extension(mMimetype);
    return  "."+fileExtinction;
  }


  public static saveCategoryImage( image : Express.Multer.File ) : string{
    let file_name = 'CATEGORY_'+ uuidV4() + ".png";
    let file_path = this.CATEGORY_IMAGES_PATH + file_name;
    let ws = createWriteStream(file_path);
    ws.write(image.buffer);

    return file_name;
}


public static async RemoveCategoryImage( imageUrl : string ) : Promise<boolean>{
    try {
        let file_path = this.CATEGORY_IMAGES_PATH + imageUrl;
        console.log('file path : ' +  file_path);
       await fs.unlinkSync(file_path);
    } catch (error) {
        return false;
    }
    return true;

}


public static updateCategoryImage( image : Express.Multer.File , name : string ) : Boolean{
    
    try {
        let file_path = this.CATEGORY_IMAGES_PATH + name;
        let ws = createWriteStream(file_path);
        ws.write(image.buffer);        
    } catch (error) {
       MyExceptions.throwException("something wrong while updating image !" , error.message)
    }

    return true;
}


// ---- handle food images

public static  saveFoodImage( image : Express.Multer.File ) : string{
  let file_name = 'FOOD_'+ uuidV4() + this.fileExtension(image.mimetype);
  let file_path = this.FOOD_IMAGES_PATH + file_name;
  let ws =  createWriteStream(file_path);
    ws.write(image.buffer);
  return file_name;
}

public static updateFoodImage( image : Express.Multer.File , name : string ) : Boolean{
    
  try {
      let file_path = this.FOOD_IMAGES_PATH + name;
      let ws = createWriteStream(file_path);
      ws.write(image.buffer);        
  } catch (error) {
     MyExceptions.throwException("something wrong while updating image !" , error.message)
  }

  return true;
}


public static async removeFoodImage( imageUrl : string ) : Promise<boolean>{
  try {
      let file_path = this.FOOD_IMAGES_PATH + imageUrl;
     await fs.unlinkSync(file_path);
  } catch (error) {
    console.log(" remove image : " + error.message);
    
      return false;
  }
  return true;

}


// ---- end with food images

// ---- handle profile images 


public static saveProfileImage( profileImage : Express.Multer.File ) : string{
  let file_name = 'USER_'+ uuidV4() + this.fileExtension(profileImage.mimetype);
  let file_path = this.PROFILE_IMAGES_PATH + file_name;
  let ws =  createWriteStream(file_path);
    ws.write(profileImage.buffer);
  return file_name;
}

public static updateProfileImage( profileImage : Express.Multer.File , imageURl : string ) : Boolean{
    
  try {
      let file_path = this.PROFILE_IMAGES_PATH + imageURl;
      let ws = createWriteStream(file_path);
      ws.write(profileImage.buffer);        
  } catch (error) {
     MyExceptions.throwException("something wrong while updating image !" , error.message)
  }

  return true;
}




public static async removeProfileImage( profileImageUrl : string ) : Promise<boolean>{
  try {
      let file_path = this.PROFILE_IMAGES_PATH + profileImageUrl;
     await fs.unlinkSync(file_path);
  } catch (error) {
      return false;
  }
  return true;

}


// ---- end handling profile images




 public  static  saveSlideImage( profileImage : Express.Multer.File ) : string{
  let file_name = 'SLIDE_'+ uuidV4() + this.fileExtension(profileImage.mimetype);
  let file_path = this.SLIDES_IMAGES_PATH + file_name;
  let ws =  createWriteStream(file_path);
  ws.write(profileImage.buffer);
  return file_name;
}

public static updateSlideImage( profileImage : Express.Multer.File , imageURl : string ) : Boolean{
    
  try {
      let file_path = this.SLIDES_IMAGES_PATH + imageURl;
      let ws = createWriteStream(file_path);
      ws.write(profileImage.buffer);        
  } catch (error) {
     MyExceptions.throwException("something wrong while updating image !" , error.message)
  }

  return true;
}




public static async removeSlideImage( profileImageUrl : string ) : Promise<boolean>{
  try {
      let file_path = this.SLIDES_IMAGES_PATH + profileImageUrl;
     await fs.unlinkSync(file_path);
  } catch (error) {
      return false;
  }
  return true;
}


// ---- end handling profile images



}
