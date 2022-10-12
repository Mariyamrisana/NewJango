var db = require('../config/connection')
var collection =require('../config/collection')
var bcrypt=require('bcrypt')

var objectId=require('mongodb').ObjectId
const Razorpay = require('razorpay');
const nodemailer= require ('nodemailer');
const dotenv=require('dotenv')
dotenv.config()


var instance = new Razorpay({
  key_id: 'rzp_test_1DouVUNKe6VpG6',
  key_secret: '70bjyUhHNET0JZLPQU0k8Hxb',
});


module.exports={
   
//    doSignup:(user)=>{
//     console.log(user);
//     return new Promise(async(res,rej)=>{
//         user.password=await bcrypt.hash(user.password,10)
       
        
//          db.get().collection(collection.USER_COLLECTION).insertOne(user).then((data)=>{
//             res(data);
//             console.log('inserted');
//         })
//     })
// },
sendVerifyMail:(username,email,otpgenerator)=>{
return new Promise(async(res,rej)=>{
try{
const mailTransporter =nodemailer.createTransport({
    host:'smtp.gmail.com',
    service: "gmail",
    port: 587,
    secure:false,
    auth:{
        user:'teslacobar@gmail.com',
        pass:'ampyrfklwyeyglhw'

    },
    tls:{
        rejectUnauthorized: false
    }
})
const maildetails={
    from:'teslacobar@gmail.com',
    to:email,
    subject:"for user verification",
    text:"just some random texts",
    html:'<p>hi' + username +'your otp ' + otpgenerator + ''
}
mailTransporter.sendMail(maildetails,(err,info)=>{
    if(err){
        console.log(err,'verify error');
    }else{
        console.log('email has been sent',info.response);
        res(info)
    }
})

}catch(error){
    console.log(error,'try catch error');

}
})
},
verifyOtp:(otpvalue,sessionOtp,userDetails)=>{
console.log('verifyotp');
return new Promise(async(res,rej)=>{


    let userOtp=otpvalue.otp
    let validOtp=sessionOtp
    console.log(userDetails);
    console.log(userOtp,validOtp);
    try{
        if(validOtp==userOtp){
            console.log('zxcvbnm');
            userDetails.password=await bcrypt.hash(userDetails.password,10)
       console.log('valid');
        
         db.get().collection(collection.USER_COLLECTION).insertOne(userDetails).then((data)=>{
            res(data);
            console.log(data);
            console.log('inserted');
        }) 
        }
    }catch(err){
        rej(err)
    }

})
},
   dologin:(user)=>{
    console.log('fghjk');
    console.log(user);
    return new Promise(async(res,rej)=>{
        let loginstatus=false
        let response={}
        console.log('??????????????????????????????');
        console.log(user);
        let users=await db.get().collection(collection.USER_COLLECTION).findOne({email:user.email})
        console.log('dologin',users);
        try {
            if(users){
            
                bcrypt.compare(user.password,users.password).then((status)=>{
                  
                    if(status){
                        console.log('login success');
                       
                        response.users=users
                        response.status=true
                        res(response)
                    }
                    else{
                        console.log('login failedddd');
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
addToCart:(proId,userId)=>{
    let proObj={
        item:objectId(proId),
        quantity:1
    }
    return new Promise(async(res,rej)=>{
        
        let userCart= await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
        
    
        if(userCart){
            let proExist=userCart.products.findIndex(product=> product.item==proId)
            console.log(proExist);
            if(proExist!=-1){
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({user:objectId(userId),'products.item':objectId(proId)},
                {
                  $inc:{'products.$.quantity':1}      
                }).then(()=>{
                    res()
                    
                })
            }else{
            db.get().collection(collection.CART_COLLECTION)
            .updateOne({user:objectId(userId)},
            {
                
                    $push:{products:proObj}
                
            }).then((response)=>{
                res()
            })
        }
        }else{
            let cartObj={
                user:objectId(userId),
                products:[proObj]
            }
            db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                res()
                console.log('::::::::::::::::::::::::::::');
            })
        }
    })
},
getCartProducts:(userId)=>{
    console.log(userId);
    return new Promise(async(res,rej)=>{
        let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([{
            $match:{user:objectId(userId)}
        },
        {
            $unwind:'$products'
        },
        {
            $project:{
                item:'$products.item',
                quantity:'$products.quantity'
            }
        },
        {
            $lookup:{
                from:collection.PRODUCT_COLLECTION,
                localField:'item',
                foreignField:'_id',
                as:'product'
            }
        },
        {
            $project:{
                item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
            }
        }

       
        ]).toArray()
        res(cartItems)
    })
},
getCartCount:(userId)=>{
    return new Promise( async(res,rej)=>{
       let cartCount=0
        let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
        if(cart){
         cartCount=cart.products.length
          
        }
        res(cartCount)
        
    })
        
 
},
getWishlistCount:(userId)=>{
    return new Promise( async(res,rej)=>{
       let wishlistCount=0
        let wishlist=await db.get().collection(collection.WISHLIST_COLLECTION).findOne({user:objectId(userId)})
        if(wishlist){
         wishlistCount=wishlist.products.length
          
        }
        res(wishlistCount)
        
    })
        
 
},
changeProductQuantity:(details)=>{
    details.count=parseInt(details.count)
    details.quantity=parseInt(details.quantity)
    return new Promise((res,rej)=>{
        if(details.count==-1 && details.quantity==1){
            db.get().collection(collection.CART_COLLECTION)
            .updateOne({_id:objectId(details.cart) },
            {
               $pull:{ products:{item:objectId(details. product)}}
            }).then((response)=>{
                res({removeProduct:true})
            })
            
        }
        
        else{
            db.get().collection(collection.CART_COLLECTION)
            .updateOne({_id:objectId(details.cart), 'products.item':objectId(details.product)},
            {
                $inc:{'products.$.quantity':details.count}
               
                
            }).then((response)=>{
                
              
                res({status:true})
            })
        }
           
        })
},
removeProduct:(proId,userId)=>{
    return new Promise((res,rej)=>{
        db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId)},
        {
            $pull:{
                products:{item:objectId(proId)}
            }
        })
        .then((response)=>{
      
        
        res(response)
        })
    })


},
removeProductfromOrder:(proId,orderId,price)=>{
    return new Promise(async(res,rej)=>{
        console.log('delete oder');
       
   let product= await db.get().collection(collection.ORDER_COLLECTION).findOne({_id:objectId(orderId)})
   console.log(product);
   console.log(product.discount_details,'discount');
   if(product.discount_details){
    price=price-((price/100)*product.discount_details.discount_percentage)
   }
   if(product.totalAmount){
    product.totalAmount=(product.totalAmount)-price
   }
   console.log(price);
    product.total=(product.total)-price
   
    
    console.log(product.total);
    console.log(price);
   let itemremoved=await db.get().collection(collection.ORDER_COLLECTION).update({_id:objectId(orderId)},
   
     {
        $set:{
        totalAmount:product.totalAmount,
        total:product.total
      },
          $pull:{
              products:{item:objectId(proId)}


          },
        

      }).then((response)=>{
        res(response)
      })
   
})

},
removeFromWishlist:(proId,userId)=>{
    return new Promise((res,rej)=>{
        db.get().collection(collection.WISHLIST_COLLECTION).updateOne({user:objectId(userId)},
        {
            $pull:{
                products:{item:objectId(proId)}
            }
        })
        .then((response)=>{
      
        
        res(response)
        })
    })
},
addToWishlist:(proId,userId)=>{
    let proObj={
        item:objectId(proId),
        
    }
    return new Promise(async(res,rej)=>{
        
        let userWishlist= await db.get().collection(collection.WISHLIST_COLLECTION).findOne({user:objectId(userId)})
        
    
        if(userWishlist){
            let proExist=userWishlist.products.findIndex(product=> product.item==proId)
            console.log(proExist);
            if(proExist==-1){
                db.get().collection(collection.WISHLIST_COLLECTION)
                .updateOne({user:objectId(userId)},
                {
                    $push:{products:proObj}
                }).then(()=>{
                    res()
                    
                })
            }
            else{
            db.get().collection(collection.WISHLIST_COLLECTION)
            .updateOne({user:objectId(userId)},
            {
                $pull:{products:{item:objectId(proId)}}
            }).then((response)=>{
                console.log('wishlist inserted');
                res()
            })
        }
        }else{
            let wishObj={
                user:objectId(userId),
                products:[proObj]
            }

            db.get().collection(collection.WISHLIST_COLLECTION).insertOne(wishObj).then((response)=>{
                
                res()
                console.log('::::::::::::::::::::::::::::');
            })
        }
    })
},
getWishlistProducts:(userId)=>{
    return new Promise(async(res,rej)=>{
        let wishlistItems=await db.get().collection(collection.WISHLIST_COLLECTION).aggregate([{
            $match:{user:objectId(userId)}
        },
        {
            $unwind:'$products'
        },
        {
            $project:{
                item:'$products.item',
               
            }
        },
        {
            $lookup:{
                from:collection.PRODUCT_COLLECTION,
                localField:'item',
                foreignField:'_id',
                as:'product'
            }
        },
        {
            $project:{
                item:1,product:{$arrayElemAt:['$product',0]}
            }
        }

        
        ]).toArray()
        res(wishlistItems)
    })
},
getTotalAmount:(userId)=>{
    return new Promise(async(res,rej)=>{
        let total=await db.get().collection(collection.CART_COLLECTION).aggregate([{
           
            $match:{user:objectId(userId)}
        },
        {
            $unwind:'$products'
        },
        {
            $project:{
                item:'$products.item',
                quantity:'$products.quantity'
            }
        },
        {
            $lookup:{
                from:collection.PRODUCT_COLLECTION,
                localField:'item',
                foreignField:'_id',
                as:'product'
            }
        },
        {
            $project:{
                
                item:1,
                quantity:1,
                
                product:{$arrayElemAt:['$product',0]}

                
            }
            
        },
        {
            $group:{
                _id:null,
                total:{$sum:{$multiply:['$quantity','$product.price']}}
            }
        }

       
        ]).toArray()
        console.log(total[0],'total');
        res(total[0].total)
    })
},
getCartProductList:(userId)=>{
    return new Promise(async (res,rej)=>{
        console.log(userId);
        let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
        console.log('thara');
        console.log(cart,'...................');

        res(cart.products)
       
    })
},
placeOrder:(order,products,total,userId,coupon)=>{
    return new Promise(async (res,rej)=>{

       console.log(order,products,total);
       let status=order['payment-method']==='COD'?'Order Placed':'pending'

       let totalPrice=parseInt(total)
       let discount=0


       
       if(coupon){
      
            discount=(totalPrice/100)*coupon.percentage
            await db.get().collection(collection.COUPEN_COLLECTION).updateOne({code:coupon.code},
                {
                    $push:{couponUsedUsers:order.userId}
                })
        
       
       }else{
        coupon={
            code:0,
            discount_percentage:0
        }
       }


       let orderObj={
        address:{
            country:order.country,
            state:order.state,
            district:order.district,
            place:order.place,
            pincode:order.pincode,  
            mobile:order.mobile
            
        },
        userId:objectId(order.userId),
        paymentMethod:order['payment-method'],
        products:products,
        total:totalPrice,
        discount:discount,
        totalAmount:totalPrice-discount,
        discount_details:{
            code:coupon.code,
            discount_percentage:coupon.percentage
        },
        status:status,
        date:new Date().toLocaleString()
       }
      
       console.log(orderObj.address,'address');
       db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
        if(order['savebox']==="on"){
           let saveAddress=db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},
           {
            $set:{
                address:orderObj.address,
                adressData:true
            }
           })
           }
        db.get().collection(collection.CART_COLLECTION).deleteOne({user:objectId(order.userId)})
        console.log('rsponse:',response.insertedId,'852000000000000');
        
        res(response.insertedId)
       })   
    })
},
getAllOrder:(userId)=>{
    return new Promise(async(res,rej)=>{
        console.log(userId);
       
        let orders=await db.get().collection(collection.ORDER_COLLECTION)
        .find({userId:objectId(userId)}).sort({date:1}).toArray()
        
       
             
        
        res(orders)
       
    })
},
getOrderProducts:(orderId)=>{
    return new Promise(async(res,rej)=>{
       
            let orderItems=await db.get().collection(collection.ORDER_COLLECTION).aggregate([{
                $match:{_id:objectId(orderId)}
            },
            {
                $unwind:'$products'
            },
            {
                $project:{
                    item:'$products.item',
                    quantity:'$products.quantity'
                }
            },
            {
                $lookup:{
                    from:collection.PRODUCT_COLLECTION,
                    localField:'item',
                    foreignField:'_id',
                    as:'product'
                }
            },
            {
                $project:{
                    item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                }
            }
    
           
            ]).toArray()
            console.log(orderItems,'--------------------');
            res(orderItems)
       
        
    })
       
},
generateRazorpay:(orderId,total)=>{
    console.log(orderId,'id22222');
    console.log(total,'tooo');
    return new Promise((res,rej)=>{
        
        options={
            amount: total*100,
            currency: "INR",
            receipt: ""+orderId,
           
          };
          console.log(options,'options');
          instance.orders.create(options,(err,order)=>
          {console.log(order,'orders');
            if(err){
            console.log(err,'errrrr');
          }else{
            console.log('generate',order);
            res(order)
          }
            
          })
          
         
    })
},
getProductDetail:(proId)=>{
    console.log('id1:',proId);
    return new Promise(async(res,rej)=>{
       try{
        let product= await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)})
        console.log(product);
        res(product)
        
       }catch(err){
       
        rej(err)
    }
           
       
       
    })
},
verifyPayment:(details)=>{
    console.log('verify');
    console.log(details);
    return new Promise((res,rej)=>{
        console.log(details,'details');
        console.log(details['payment[razorpay_order_id]'],'::razorpay');
        let crypto=require('crypto')
        let hmac = crypto.createHmac('sha256','70bjyUhHNET0JZLPQU0k8Hxb')
        hmac.update(details['payment[razorpay_order_id]']+'|'+ details['payment[razorpay_payment_id]'])
       
        hmac=hmac.digest('hex')
        console.log('something');
        console.log(hmac,'hmac');

        if(hmac==details['payment[razorpay_signature]']){
            console.log('matched');
            res()
        }else{
            console.log('rej');
            rej()
        }
    })
},
changePaymentStatus:(orderId)=>{
    return new Promise((res,rej)=>{
        db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},
        {
            $set:{
                status:'Order Placed'
            }
        }).then(()=>{
            res()
        })
    })
},
orderTracker:(orderId)=>{
    return new Promise(async(res,rej)=>{
     let details=await db.get().collection(collection.ORDER_COLLECTION).findOne({_id:objectId(orderId)})
      res(details)
    })
},
getUserdata:(userId)=>{
    return new Promise(async(res,rej)=>{
        let data=await db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(userId)})
        res(data)
    })
},updateProfile:(userValues,userId)=>{
        return new Promise(async(res,rej)=>{
            let userData={
                address:{
                    country:userValues.country,
                    state:userValues.state,
                    district:userValues.district,
                    place:userValues.place,
                    pincode:userValues.pincode,
                    mobile:userValues.mobile,
                }
            }
          let updateData=  db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},
            {
                $set:{
                    Firstname:userValues.Firstname,
                    Lastname:userValues.Lastname,
                    email:userValues.email,
                    address:userData.address
                   
                   
                   
                }
            }).then((response)=>{
                console.log(response,'response update');
                res()
            })
                
            
        })
    },
    couponGenerate:(coupenCode)=>{
        return new Promise(async(res,rej)=>{
            try{
                await db.get().collection(collection.COUPEN_COLLECTION).findOne({code:coupenCode}).then((data)=>{
                    
                    res(data)
                    console.log(coupenCode);
                    console.log(data,'helperdata');
                  }) 
            }catch(err){
                rej(err)
            }
           
          })
    },
    checkCouponStatus:(coupencode,userId)=>{
        return new Promise(async(res,rej)=>{
            console.log('helper coupon');
              let usedStatus=  await db.get().collection(collection.COUPEN_COLLECTION).find({code:coupencode,couponUsedUsers:{$in:[userId]}}).toArray()
            if(usedStatus[0]){
                res({couponStatus:'Used'})
            }
            else{
                res({couponStatus:'Valid'})
            }
            console.log(usedStatus[0],'status coupon');
        })
    },
    getWomen:()=>{
        return new Promise(async(res,rej)=>{
            try{
                let products=await db.get().collection(collection.PRODUCT_COLLECTION).find({category:"Women"}).toArray()
                res(products)
                console.log('getallProducts');
            }catch(err){
                rej(err)
            }
            
        })
    },
    getCasual:()=>{
        return new Promise(async(res,rej)=>{
            try{
                let products=await db.get().collection(collection.PRODUCT_COLLECTION).find({category:"Casuals"}).toArray()
                res(products)
                console.log('getallProducts');
            }catch(err){
                rej(err)
            }
            
        })
    },
    getMen:()=>{
        return new Promise(async(res,rej)=>{
            try{
                let products=await db.get().collection(collection.PRODUCT_COLLECTION).find({category:"Men"}).toArray()
                res(products)
                console.log('getallProducts');
            }catch(err){
                rej(err)
            }
            
        })
    },
    getAccessories:()=>{
        return new Promise(async(res,rej)=>{
            try{
                let products=await db.get().collection(collection.PRODUCT_COLLECTION).find({category:"Accessories"}).toArray()
                res(products)
                console.log('getallProducts');
            }catch(err){
                rej(err)
            }
            
        })
    }
   
}
