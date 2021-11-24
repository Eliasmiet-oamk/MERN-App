import  mongoose  from "mongoose";


const postSchema =  new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    price: Number,
    county: String,
    city: String,
    category: String,
    delivery: String,
    seller: String,
    contactInfo: String,
    image: String,
    imageName: String,
},{ 
timestamps: true
});


const Post = mongoose.model("Post",postSchema);


export default Post
