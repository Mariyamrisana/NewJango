var db = require('../config/connection')
var collection =require('../config/collection')
var bcrypt=require('bcrypt')

var objectId=require('mongodb').ObjectId


module.exports={
    dologin:(admin)=>{
        console.log('fghjk');
        console.log();
        return new Promise(async(res,rej)=>{
            let adminlogged=false
            let response={}
            console.log('??????????????????????????????');
            
            let admindata=await db.get().collection(collection.ADMINDATA_COLLECTION).findOne({email:admin.email})
            console.log('dologin',admin);
            try {
                if(admindata){
                
                    bcrypt.compare(admin.password,admindata.password).then((status)=>{
                      
                        if(status){
                            console.log('login success');
                           
                            response.admindata=admindata
                            response.status=true
                            res(response)
                        }
                        else{
                            console.log('login failed');
                            res({status:false})
                        }
                    })
                }else{
                    console.log('login failed');
                    res({staus:false})
                }
            } catch (error) {
                rej(error)
            }
           
        }) 
    },
 
    getAllusers:()=>{
        return new Promise(async(res,rej)=>{
            let users=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            res(users)
            console.log('getallusers');
        })
    },
    
    getAllproducts:()=>{
        return new Promise(async(res,rej)=>{
            try{
                let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
                res(products)
                console.log('getallProducts');
            }catch(err){
                rej(err)
            }
            
        })
    },
    getAllOrder:()=>{
        return new Promise(async(res,rej)=>{
            
            let orders=await db.get().collection(collection.ORDER_COLLECTION)
            .find().toArray()
            res(orders)
            console.log('25852852');
            console.log('getallorders');
        })
    },
    addUser:(user)=>{
        console.log(user);
        return new Promise(async(res,rej)=>{
            user.password=await bcrypt.hash(user.password,10)
          
             db.get().collection(collection.USER_COLLECTION).insertOne(user).then((data)=>{
                res(data);
                console.log('inserted');
            })
        })
    },
    addProduct:(product)=>{
        console.log(product);
        product.price=parseInt (product.price)
        return new Promise(async(res,rej)=>{
          product.price= parseInt(product.price)
          
             db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data)=>{
                res(data);
                console.log(data);
                console.log('inserted product');
            })
        })
    },
   
    addcategory:(category)=>{
        console.log(category);
        return new Promise(async(res,rej)=>{
           await db.get().collection(collection.ADMIN_COLLECTION).insertOne(category).then((data)=>{
                res(data);
                console.log('category inserted');
            })
        })
    },
    getAllcategory:()=>{
        return new Promise(async(res,rej)=>{
            let categories=await db.get().collection(collection.ADMIN_COLLECTION).find().toArray()
            res(categories)
            console.log('getallcat');
        })
    },
    deleteCategory:(categoryId)=>{
        return new Promise((res,rej)=>{
            db.get().collection(collection.ADMIN_COLLECTION).remove({_id:objectId(categoryId)}).then((response)=>{
            console.log(categoryId);
            res(response)
            })
        })
    },
    deleteProduct:(productId)=>{
        return new Promise((res,rej)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).remove({_id:objectId(productId)}).then((response)=>{
            console.log(productId);
            res(response)
            })
        })
    },
    unblockuser:(userId)=>{
        return new Promise((res,rej)=>{
            db.get().collection(collection.USER_COLLECTION).
            updateOne({_id:objectId(userId)},{
                $set:{
                    userblocked:false
                }
            }
            ).then((response)=>{
                res(response)
            })
        })
    },
    blockuser:(userId)=>{
        return new Promise((res,rej)=>{
            db.get().collection(collection.USER_COLLECTION).
            updateOne({_id:objectId(userId)},{
                $set:{
                    userblocked:true
                }
            },{upsert:true}).then((response)=>{
                res(response)
            })
        })
    },
    
    addSlider:(slider)=>{
        console.log(slider);
        return new Promise(async(res,rej)=>{
          
          
             db.get().collection(collection.SLIDER_COLLECTION).insertOne(slider).then((data)=>{
                res(data);
                console.log(data);
                console.log('inserted banner');
            })
        })
    },
    
    getAllsliders:()=>{
        return new Promise(async(res,rej)=>{
            let sliders=await db.get().collection(collection.SLIDER_COLLECTION).find().toArray()
            res(sliders)
            console.log('getallbanners');
        })
    },
    addBanner:(banner)=>{
        console.log(banner);
        return new Promise(async(res,rej)=>{
          
          
             db.get().collection(collection.BANNER_COLLECTION).insertOne(banner).then((data)=>{
                res(data);
                console.log(data);
                console.log('inserted banner');
            })
        })
    },
    getAllbanners:()=>{
        return new Promise(async(res,rej)=>{
            let banners=await db.get().collection(collection.BANNER_COLLECTION).find().toArray()
            res(banners)
            console.log('getallbanners');
        })
    },
    getBannerData:(bannerId)=>{
        return new Promise(async(res,rej)=>{
            let banners=await db.get().collection(collection.BANNER_COLLECTION).findOne({_id:objectId(bannerId)}).then((bannerData)=>{
                res(bannerData)
                console.log('bannerdata');
            })
           
        })
    },
    editBanner:(bannerId,banners)=>{
        return new Promise((res,rej)=>{
            db.get().collection(collection.BANNER_COLLECTION).
            updateOne({_id:objectId(bannerId)},{
                $set:{
                    bannerCategory:banners.bannerCategory,
                    bannerDescription:banners.bannerDescription
                }
            }).then((data)=>{
                res(data)
            })
        })
    },
    getSliderData:(sliderId)=>{
        return new Promise(async(res,rej)=>{
            let sliders=await db.get().collection(collection.SLIDER_COLLECTION).findOne({_id:objectId(sliderId)}).then((sliderData)=>{
                res(sliderData)
                console.log('sliivuuuuu');
            })
           
        })
    },
    editSlider:(sliderId,sliders)=>{
        return new Promise((res,rej)=>{
            db.get().collection(collection.SLIDER_COLLECTION).
            updateOne({_id:objectId(sliderId)},{
                $set:{
                    sliderCategory:sliders.sliderCategory,
                    sliderDescription:sliders.sliderDescription
                }
            }).then((data)=>{
                res(data)
            })
        })
    },
    shippedOrder:(orderId)=>{
        console.log(orderId,'idddd');
        return new Promise((res,rej)=>{
            db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},{
                $set:{
                    status:'Order Shipped' 
                   

                }
                
            }).then(()=>{
                console.log('status changed');
                res()
            })
        })

    },
    orderPlaced:(orderId)=>{
        return new Promise((res,rej)=>{
            db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},{
                $set:{
                    status:'Delivered'
                }
            }).then(()=>{
                res()
            })
        })
    },
    cancelOrder:(orderId)=>{
        return new Promise((res,rej)=>{
            db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},{
                $set:{
                    status:'Order Canceled'
                }
            }).then(()=>{
                
                res()
            })
        })
    },
    unblockOrder:(orderId)=>{
        return new Promise((res,rej)=>{
            db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},{
                $set:{
                    status:'Order Placed'
                }
            }).then(()=>{
                res()
            })
        })
    },
    coupenGenerate:(coupenDetails)=>{
        return new Promise(async(res,rej)=>{
            coupenDetails.crieteria=parseInt(coupenDetails.crieteria)
            coupenDetails.percentage=parseInt(coupenDetails.percentage)
          await db.get().collection(collection.COUPEN_COLLECTION).insertOne(coupenDetails).then((data)=>{
            console.log(data,'helperdata');
            res(data)
           
          })  
        })
    },
    getAllcoupen:()=>{
        return new Promise(async(res,rej)=>{
           let coupen= await db.get().collection(collection.COUPEN_COLLECTION).find().toArray()
           res(coupen)
           console.log(coupen,'helpercoupens');
        })
    }, userCount:()=>{
        return new Promise(async(res,rej)=>{
            let data=0
            data=await db.get().collection(collection.USER_COLLECTION).count()
            
           res(data)
        })
    },
    totalOrder:()=>{
        return new Promise(async(res,rej)=>{
            let data=0
            data=await db.get().collection(collection.ORDER_COLLECTION).count()
            
           res(data)
        })
    },
    totalSales:()=>{
        return new Promise(async(res,rej)=>{
            let total= await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                  $project: {
                    '_id': 0, 
                    'address': 1, 
                    'userId': 1, 
                    'paymentMethod': 1, 
                    'products': 1, 
                    'total': 1, 
                    'status': 1, 
                    'date': 1
                  }
                }, {
                  $match: {
                    '$or': [
                      {
                        'paymentMethod': 'ONLINE'
                      }, {
                        'status': 'Delivered'
                      }
                    ]
                  }
                }, {
                  $count: 'count'
                }
              ]).toArray()
              res(total[0])
        })
    },
    totalRevenue:()=>{
        return new Promise(async(res,rej)=>{
         let total=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                  '$match': {
                    '$or': [
                      {
                        'paymentMethod': 'ONLINE'
                      }, {
                        'status': 'Delivered'
                      }
                    ]
                  }
                }, {
                  '$group': {
                    '_id': '', 
                    'total': {
                      '$sum': '$total'
                    }
                  }
                }
              ]).toArray()
              res(total[0])
        })
    },
    totalCod:()=>{
        return new Promise(async(res,rej)=>{
            let total=await db.get().collection(collection.ORDER_COLLECTION).aggregate(
                [
                    {
                      '$match': {
                        'paymentMethod': 'COD'
                      }
                    }, {
                      '$count': 'codCount'
                    }
                  ]
            ).toArray()
            res(total[0])
        })
    },
    totalOnline:()=>{
        return new Promise(async(res,rej)=>{
            let total=0
             total=await db.get().collection(collection.ORDER_COLLECTION).aggregate(
                [
                    {
                      '$match': {
                        'paymentMethod': 'ONLINE'
                      }
                    }, {
                      '$count': 'onlineCount'
                    }
                  ]
            ).toArray()
            res(total[0])
        })
    },
    totalDelivered:()=>{
        return new Promise(async(res,rej)=>{
            let total=0
            total=await db.get().collection(collection.ORDER_COLLECTION).aggregate(
                [
                    {
                      '$match': {
                        'status': 'Delivered'
                      }
                    }, {
                      '$count': 'delivered'
                    }
                  ]
            ).toArray()
            res(total[0])
        })
    },
    totalShipped:()=>{
        return new Promise(async(res,rej)=>{
            let total=0
            total=await db.get().collection(collection.ORDER_COLLECTION).aggregate(
                [
                    {
                      '$match': {
                        'status': 'Order Shipped'
                      }
                    }, {
                      '$count': 'shipped'
                    }
                  ]
            ).toArray()
            res(total[0])
        })
    },
    totalPlaced:()=>{
        return new Promise(async(res,rej)=>{
            
            let total=0
            total=await db.get().collection(collection.ORDER_COLLECTION).aggregate(
                [
                    {
                      '$match': {
                        'status': 'Order Placed'
                      }
                    }, {
                      '$count': 'placed'
                    }
                  ]
            ).toArray()
            res(total[0])
        })
    },
    totalCancel:()=>{
        return new Promise(async(res,rej)=>{
            let total=0
            total=await db.get().collection(collection.ORDER_COLLECTION).aggregate(
                [
                    {
                      '$match': {
                        'status': 'Order Canceled'
                      }
                    }, {
                      '$count': 'cancel'
                    }
                  ]
            ).toArray()
            res(total[0])
        })
    }


   
    
}