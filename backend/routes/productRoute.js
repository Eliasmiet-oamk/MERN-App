import express from 'express';
import Post from '../models/postModel.js'
import passport from 'passport';
import { applyPassportStrategy } from './usersRoute.js';
import {v2 as cloudinary} from 'cloudinary';
import  { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import cors  from 'cors'
import multer from 'multer'



const productRoute = express.Router();
applyPassportStrategy(passport);

productRoute.use(cors());

dotenv.config();



const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Nimages',
        allowedFormats: ['jpg', 'png'],
        width: 500,
        height: 500,
        crop: 'fill'
    }
  });

  cloudinary.config({
    cloud_name: process.env.cloudName ,
    api_key: process.env.cloudApi,
    api_secret: process.env.cloudSecret,
  });



  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb('invalid image file!', false);
    }
  };

  
var parser = multer({ storage: storage, fileFilter });


productRoute.get('/getproducts', (req, res) => {
    Post.find().then(posts => res.json(posts));
});

productRoute.post('/getUserproducts',passport.authenticate('jwt', { session: false }),(async(req, res) => {
    const idU = req.user.id
    const product = await Post.find({id:idU});
    if(product){
       
    Post.find({id:idU}).then(posts => res.json(posts));
    } else {
        
        res.status(404).send({ message: 'Product Not Found' });
    }
})
);

productRoute.put(
    '/updatePost',passport.authenticate('jwt', { session: false }),parser.single('image'),(async (req, res) => {
      const product = await Post.findById(req.body.id);
      if (product) {
        const deleteCloud = product.imageName
        cloudinary.uploader.destroy( deleteCloud, function(error,result) {
          console.log(result, error) });
        product.title = req.body.title;
        product.description = req.body.description;
        product.price = req.body.price;
        product.image= req.file.path
        product.imageName= req.file.filename
  
        const updatedProduct = await product.save();
        res.send({ message: 'Product Updated', product: updatedProduct });
      } else {
        res.status(404).send({ message: 'Product Not Found' });
      }
    })
  );

  productRoute.delete('/deletePost',passport.authenticate('jwt', { session: false }),( async  (req, res) => {
    const product = await Post.findById(req.body.id);
    if (product) {
      const deleteCloud = product.imageName
      cloudinary.uploader.destroy( deleteCloud, function(error,result) {
        console.log(result, error) });
      const deleteProduct = await product.remove();
      res.send({ message: 'Product Deleted', product: deleteProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
  );


  productRoute.post('/upload',passport.authenticate('jwt', { session: false }),parser.single('image'), function (req, res) {
    console.log(req.file)
   
    const id = req.user.id
     const title = req.body.title;
     const description = req.body.description;
     const price = req.body.price;
     const  county =req.body.county;
     const city =req.body.city;
     const category =req.body.category;
     const delivery =req.body.delivery;
     const seller = req.user.username;
     const contactInfo =req.user.email;
     
     const image = req.file.path
     const imageName = req.file.filename
     res.status(201);
     
     
     const newPost = new Post({
         id,
         title,
         description,
         price,
         county,
         city,
         category,
         delivery,
         seller,
         contactInfo,
         image,
         imageName
     });
   
     newPost.save().then(res.status(201).json("Post Created"));
   });
  



export default productRoute