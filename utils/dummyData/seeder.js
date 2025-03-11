const dotenv = require("dotenv");
const fs = require("fs"); //piltin librari in projact
 require("colors");
const ProdactModel = require("../../models/productModel");
const dbConnection = require("../../config/database");

dotenv.config({path:'../../.env'});

dbConnection();

const prodacuts = JSON.parse(fs.readFileSync('./product.json'));

const insertData = async()=>{
    try{
        await ProdactModel.create(prodacuts);
        console.log("Data inserted successfully".green.inverse);
        process.exit();
        }catch(err){
            console.log(err);
        }
   
}
const deleteData = async ()=>{
    try{
        await ProdactModel.deleteMany();
        console.log("Data deleted successfully".red.inverse);
        process.exit();
        }catch(err){
            console.log(err);
        }
}
//process.argv[2] node seeder.js -i ==> node[0] sedder.js[1] -i[2]
if(process.argv[2]==='-i'){
    insertData();
}else if (process.argv[2]==='-d'){
    deleteData();
}
