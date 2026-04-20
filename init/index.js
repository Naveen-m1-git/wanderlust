const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js"); 
main().then(()=>{
    console.log("Connected to MongoDB");
}).catch(err=>{
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj) => ({
        ...obj ,
        owner: "69aaf0eb16fc4a3ca0c9c0bb" 
    }));
    await Listing.insertMany(initdata.data);
    console.log("Database Initialized");
};
initDB();
