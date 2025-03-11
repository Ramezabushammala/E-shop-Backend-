
class FeatureApi {
  constructor(mongooseQuery, QueryString) {
    this.mongooseQuery = mongooseQuery;
    this.QueryString = QueryString;
  }

  Filter() {
    //queryStringObj=req.query delete from req orignal {...req.query} take copy from req.query
    const queryStringObj = { ...this.QueryString };
    const excludesFields = ["page", "sort", "limit", "fields"];
    excludesFields.forEach((field) => delete queryStringObj[field]);
    // in mongodb shape { price: { $gte: '4' }, sold: { $gte: '22' } }
    //  console.log(queryStringObj);
    //result console { price: { gte: '4' }, sold: { gte: '22' } }
    //apply filtriton using [gte,gt,lte,lt]
    let queryString = JSON.stringify(queryStringObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    //  console.log(JSON.parse(queryString));
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryString));
    return this; //this return object becuase FeatcharApi.filter().sort().pagenate()... teke obj after them
  }

  sort() {
    if (this.QueryString.sort) {
       console.log(this.QueryString.sort);
      const sortBy = this.QueryString.sort.split(",").join(" ");
      // console.log(sortBy);
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  pagenat(countDocuments) {
    const page = this.QueryString.page * 1 || 1;
    const limit = this.QueryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndexpage = page * limit ; // me in page 2 is endIndexpage 2*limit10 = 20
    //pagenation results
    const pagenation = {};
     pagenation.currentPage = page ;
     pagenation.limit = limit ;
     //50/10=5pages
     pagenation.numberofpages =Math.ceil(countDocuments/limit);
     //next page
     if(endIndexpage < countDocuments){
      pagenation.nextPage = page + 1 ;
     }
     if(skip>0){
      pagenation.prevPage = page - 1 ;
     }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.pagenationResult =pagenation ;
    return this;
  }

  fields() {
    if (this.QueryString.fields) {
      const fields = this.QueryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.QueryString.keyword) {
      const keyword = this.QueryString.keyword.trim();
      // const regex = new RegExp(keyword, "i");
      let query ={};
      if(modelName==="products"){
         query.$or = [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ]
      }else{
        query ={ name: { $regex: keyword, $options: "i" } }
      }
      console.log(query);
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }
}
 // هناك مشكلة في sort and search sort يبحث بقيمة وحدة فقط دون البعد الفاصلة
module.exports = FeatureApi ;
