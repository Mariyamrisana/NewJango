

const express = require('express');
var router = express.Router();
var Handlebars=require('handlebars')

const Adminhelpers = require('../helpers/Adminhelpers');
const Userhelpers = require('../helpers/Userhelpers');

require('dotenv').config()


Handlebars.registerHelper("inc",(value,options)=>{
return parseInt(value)+1
})

const verifylogin=(req,res,next)=>{

  if(req.session.userlogged){

    next()
  }
  else{
    console.log('veriftlog');
    res.redirect('/userlogin')
  }
}
/* GET home page. */
router.get('/',  async function(req, res, next) {
 console.log('started')

let cartCount=null
 
if(req.session.uservalue){
 cartCount=await Userhelpers.getCartCount(req.session.uservalue._id)
 console.log(cartCount);
}

let wishlistCount=null
 
if(req.session.uservalue){
 wishlistCount=await Userhelpers.getWishlistCount(req.session.uservalue._id)
 console.log(wishlistCount);
}
 let banner=await Adminhelpers.getAllbanners()
 Adminhelpers.getAllsliders().then((slider)=>{
  res.render('user/index', { layout:'userlayout',slider,cartCount,banner,wishlistCount});
 })

 
});

router.get('/userlogin',(req,res,next)=>{
  
    if(req.session.uservalue){
      res.redirect('/product')
    }
    else{
      console.log('cant login lll');
      
    res.render('user/userlogin',{layout:'userlayout',ErrorLogin:req.session.loginError})
    
  
    }
  
 
})

router.get('/userlogin',async function(req, res, next) {
  
  console.log('respond with a resource');
 res.render('user/userlogin',{layout:'userlayout'})
  

 
});
router.post('/userlogin',async function(req, res, next) {
 
    console.log('logged');
    console.log(req.body);
   await Userhelpers.dologin(req.body).then((response)=>{
      console.log(response,'respppppppppppppppppp');
      if(response.status){
       console.log(response.users,'response users');
        req.session.uservalue=response.users     
        req.session.userlogged=true
        console.log(req.session.uservalue,'//////////////////');
        res.redirect('/product')
        req.session.ErrorLogin=false
      }
      else{
        req.session.loginError=true
        res.redirect('/userlogin')
        
        
      
     
      }
    }).catch((err)=>{res.send(err)})
  
 
 

});
router.get('/signup',async function(req, res, next) {
  console.log('logged');
 
 
  res.render('user/signup',{layout:'userlayout','errorPass':req.session.errorPass})
    console.log('cant login');
   
});
router.post('/signup',async function(req, res, next) {
  console.log('logged');
  
  let pass=req.body.password
  let rePass=req.body.reEnter
  if(pass == rePass && pass.length >= 3){
    const otpgenerator= Math.floor(1000 + Math.random() * 9000)
    console.log(otpgenerator,'otp')
    req.session.OTP=otpgenerator;
    req.session.signupDetails=req.body
    if(req.body){
      let verifiedUser=await Userhelpers.sendVerifyMail(req.body.name,req.body.email,otpgenerator)

      if(verifiedUser){
        res.redirect('/verify-user')
      
        }else{
          res.redirect('/signup')
        }
      }
  }
  else{
    req.session.errorPass=true
    res.redirect('/signup')
  
  }
  
})
router.get('/verify-user',(req,res)=>{
  if(req.session.uservalue){
    res.redirect('/userlogin')
  }
 
  else{
    res.render('user/verify-user',{layout:"userlayout"})
  }

})
router.post('/verify-mail',async(req,res)=>{
await Userhelpers.verifyOtp(req.body,req.session.OTP,req.session.signupDetails).then(()=>{
  req.session.uservalue=req.session.signupDetails
  req.session.signupDetails=null
  req.session.userlogged=true
  res.redirect('/product')
}).catch((err)=>{
  if(err){
    res.redirect("/verify-user")
  }



})
})
router.get('/logout', function(req, res, next) {
  req.session.destroy()
  console.log('logout');
  res.redirect('/userlogin')

 
});
router.get('/account', async function(req, res, next) {
  console.log('account')
  let cartCount=null
 
  if(req.session.uservalue){
   cartCount=await Userhelpers.getCartCount(req.session.uservalue._id)
   console.log(cartCount);
  }
  
let wishlistCount=null
 
if(req.session.uservalue){
 wishlistCount=await Userhelpers.getWishlistCount(req.session.uservalue._id)
 console.log(wishlistCount);
}
  res.render('user/account', { layout:'userlayout',cartCount,wishlistCount});
  
 });
 
 
 router.get('/about',async function(req, res, next) {
  console.log('blo')
  let cartCount=null
 
if(req.session.uservalue){
 cartCount=await Userhelpers.getCartCount(req.session.uservalue._id)
 console.log(cartCount);
}

let wishlistCount=null
 
if(req.session.uservalue){
 wishlistCount=await Userhelpers.getWishlistCount(req.session.uservalue._id)
 console.log(wishlistCount);
}
  res.render('user/about', { layout:'userlayout',cartCount,wishlistCount});
  
 });
 router.get('/blog-archive',async function(req, res, next) {
  console.log('blog-archive')
 
    let cartCount=null
    let wishlistCount=null
  if(req.session.uservalue){
   cartCount=await Userhelpers.getCartCount(req.session.uservalue._id)
   wishlistCount=await Userhelpers.getWishlistCount(req.session.uservalue._id)
   console.log(cartCount);
  }
  res.render('user/blog-archive', { layout:'userlayout',cartCount,wishlistCount});
  
 


 
 });
 router.get('/blog-archive-2',async function(req, res, next) {

    console.log('blog-archive-2')
    let cartCount=null
    let wishlistCount=null
  if(req.session.uservalue){
   cartCount=await Userhelpers.getCartCount(req.session.uservalue._id)
   wishlistCount=await Userhelpers.getWishlistCount(req.session.uservalue._id)
   console.log(cartCount);
  }
    res.render('user/blog-archive-2', { layout:'userlayout',cartCount,wishlistCount });
  
  
 });
 router.get('/cart',verifylogin,async function(req, res, next) {
  console.log('cart')

    let total=0
    console.log(req.session.uservalue._id,'userid');
    let products= await Userhelpers.getCartProducts(req.session.uservalue._id)
          let cartCount=null
          let wishlistCount=null
        if(req.session.uservalue){
        cartCount=await Userhelpers.getCartCount(req.session.uservalue._id)
        wishlistCount=await Userhelpers.getWishlistCount(req.session.uservalue._id)
        console.log(cartCount);
        }
    if(products.length>0){
      total=await Userhelpers.getTotalAmount(req.session.uservalue._id)
      
      let uservalue=req.session.uservalue._id
      console.log(products);
     
      
      res.render('user/cart', { layout:'userlayout',products,total,uservalue,cartCount,wishlistCount});
    
    }else{
      res.render('user/emptyCart',{layout:'userlayout',cartCount,wishlistCount})
    }
  
 
  
 });
 router.get('/wishlist',verifylogin,async function(req, res, next) {
  console.log('whis')
  
 
    let products= await Userhelpers.getWishlistProducts(req.session.uservalue._id)
    let cartCount=null
    let wishlistCount=null
  if(req.session.uservalue){
   cartCount=await Userhelpers.getCartCount(req.session.uservalue._id)
   wishlistCount=await Userhelpers.getWishlistCount(req.session.uservalue._id)
   console.log(cartCount);
  }
      res.render('user/wishlist', { layout:'userlayout',products,cartCount,wishlistCount });
  
  
  
  });

 router.get('/checkout',verifylogin,async function(req, res, next) {
  
    console.log('checkout')
    let total=await Userhelpers.getTotalAmount(req.session.uservalue._id)
    let products= await Userhelpers.getCartProducts(req.session.uservalue._id)
    let cartCount=null
    let wishlistCount=null
  if(req.session.uservalue){
   cartCount=await Userhelpers.getCartCount(req.session.uservalue._id)
   wishlistCount=await Userhelpers.getWishlistCount(req.session.uservalue._id)
   console.log(cartCount);
  }
  let userData=await Userhelpers.getUserdata(req.session.uservalue._id)
  
  
    res.render('user/checkout', { layout:'userlayout',total,products,'uservalue':req.session.uservalue,cartCount,wishlistCount,userData });
 
  
  
  
 });
 router.get('/contact',async function(req, res, next) {
  console.log('contact')
 

    let cartCount=null
    let wishlistCount=null
  if(req.session.uservalue){
   cartCount=await Userhelpers.getCartCount(req.session.uservalue._id)
   wishlistCount=await Userhelpers.getWishlistCount(req.session.uservalue._id)
   console.log(cartCount);
  }
    res.render('user/contact', { layout:'userlayout',cartCount,wishlistCount });
 
  
 });
 router.get('/product-detail/:id',verifylogin,async function(req, res, next) {
 
    console.log('product-detail')
    let proId=req.params.id
    console.log('proid:',proId);
    let cartCount=null
    let wishlistCount=null
  if(req.session.uservalue){
   cartCount=await Userhelpers.getCartCount(req.session.uservalue._id)
   wishlistCount=await Userhelpers.getWishlistCount(req.session.uservalue._id)
   console.log(cartCount);
  }
   await Userhelpers.getProductDetail(proId).then((product)=>{
      
      res.render('user/product-detail', { layout:'userlayout',product,cartCount,wishlistCount });
    }).catch((err)=>{
      if(err){
        res.redirect('/userError')
      }
    })
    
   
    
  
 });
 router.get('/product',verifylogin,async function(req, res, next) {
  console.log('product')
 
    let cartCount=null
    let wishlistCount=null
  if(req.session.uservalue){
   cartCount=await Userhelpers.getCartCount(req.session.uservalue._id)
   wishlistCount=await Userhelpers.getWishlistCount(req.session.uservalue._id)
   console.log(cartCount);
  }
    await  Adminhelpers.getAllproducts().then((products)=>{
        for(i=0;i<products.length;i++){
          if(products[i].category='Casuals'){
            products[i].casual=true
          }
        }
        res.render('user/product', { layout:'userlayout',products,cartCount,wishlistCount });
        
    })
 
  
 });
 router.get('/women',verifylogin,async function(req, res, next){
  let cartCount=null
  let wishlistCount=null
if(req.session.uservalue){
 cartCount=await Userhelpers.getCartCount(req.session.uservalue._id)
 wishlistCount=await Userhelpers.getWishlistCount(req.session.uservalue._id)
 console.log(cartCount);
}
  await Userhelpers.getWomen().then((products)=>{
      
      res.render('user/product', { layout:'userlayout',products,cartCount,wishlistCount });
      
  })
 } )
 router.get('/casual',verifylogin,async function(req, res, next){
  let cartCount=null
  let wishlistCount=null
if(req.session.uservalue){
 cartCount=await Userhelpers.getCartCount(req.session.uservalue._id)
 wishlistCount=await Userhelpers.getWishlistCount(req.session.uservalue._id)
 console.log(cartCount);
}
  await Userhelpers.getCasual().then((products)=>{
     
      res.render('user/product', { layout:'userlayout',products,cartCount,wishlistCount });
      
  })
 } )

 router.get('/men',verifylogin,async function(req, res, next){
  let cartCount=null
  let wishlistCount=null
if(req.session.uservalue){
 cartCount=await Userhelpers.getCartCount(req.session.uservalue._id)
 wishlistCount=await Userhelpers.getWishlistCount(req.session.uservalue._id)
 console.log(cartCount);
}
  await Userhelpers.getMen().then((products)=>{
     
      res.render('user/product', { layout:'userlayout',products,cartCount,wishlistCount });
      
  })
 } )

 router.get('/accessories',verifylogin,async function(req, res, next){
  let cartCount=null
  let wishlistCount=null
if(req.session.uservalue){
 cartCount=await Userhelpers.getCartCount(req.session.uservalue._id)
 wishlistCount=await Userhelpers.getWishlistCount(req.session.uservalue._id)
 console.log(cartCount);
}
  await Userhelpers.getAccessories().then((products)=>{
     
      res.render('user/product', { layout:'userlayout',products,cartCount,wishlistCount });
      
  })
 } )
router.get('/add-to-cart/:id',verifylogin,(req,res)=>{
  
  console.log('cartedsssss');
  Userhelpers.addToCart(req.params.id,req.session.uservalue._id).then(()=>{
    
    res.json({status:true})
  })
})
router.get('/move-to-cart/:id',verifylogin,async(req,res)=>{
  
  console.log('cartedsssss');
 
 await Userhelpers.addToCart(req.params.id,req.session.uservalue._id).then(async()=>{
  await Userhelpers.removeFromWishlist(req.params.id,req.session.uservalue._id).then((response)=>{
      res.json({status:true})
  })
 })
 
    
    
  
})

router.get('/add-to-wishlist/:id',verifylogin,(req,res)=>{
  
  console.log('wishhhsssss');
  Userhelpers.addToWishlist(req.params.id,req.session.uservalue._id).then(()=>{
    
    res.json({status:true})
  })
})

router.post('/change-product-quantity', (req,res)=>{
  Userhelpers.changeProductQuantity(req.body).then(async(response)=>{
    console.log(req.body);
   
    response.total=await Userhelpers.getTotalAmount(req.body.uservalue)
    res.json(response)
    
  
  })
})
router.get('/cart-product-delete1/:proId',verifylogin, (req,res)=>{
  let productId=req.params.proId
  console.log('getting innnnn');
  console.log(productId);
Userhelpers.removeProduct(productId,req.session.uservalue._id).then((response)=>{
    res.json(response)
    
    console.log('deleted');
  })
  
})
router.get('/order-product-delete/:proId/:orderID',verifylogin,async (req,res)=>{
  console.log('in');
  let price=0
  console.log(req.params.proId,'proid,',req.params.orderID);
  let products= await Userhelpers.getOrderProducts(req.params.orderID)
  console.log(products,'index');
  for(let i=0;i<products.length;i++){
    if(products[i].item==req.params.proId){
      price=(products[i].product.price)*(products[i].quantity)
      
      console.log(products[i].product.price);
    }
  }
  console.log(price);

await Userhelpers.removeProductfromOrder(req.params.proId,req.params.orderID,price).then((response)=>{
   res.redirect('/orders')
    
    console.log('deleted');
  })
  
})
router.post('/checkout',verifylogin,async(req,res)=>{

let products= await Userhelpers.getCartProductList(req.body.userId)
let total=await Userhelpers.getTotalAmount(req.body.userId)


console.log(req.body,'[[[[[[[[[');
let coupon=false
let discount=0
if(req.body.couponCode){
  await Userhelpers.checkCouponStatus(req.body.coupenCode,req.session.uservalue._id).then(async(data)=>{
    if(data.couponStatus=='Valid'){
      coupon=await Userhelpers.couponGenerate(req.body.couponCode)
      console.log('valid');
    }
  
  })
  if(coupon){
    discount= (total/100)*coupon.percentage
    console.log(discount,'////disd');
  }
 
}
let totalAmount=total-discount


await Userhelpers.placeOrder(req.body,products,total,req.session.uservalue._id,coupon).then((orderId)=>{

  
if(req.body['payment-method']==='COD'){
  
  
 
    res.json({codSuccess:true})
  
  
}else{
  Userhelpers.generateRazorpay(orderId,totalAmount).then((response)=>{
 
    res.json(response)
  })
}
 
})
})

router.get('/apply-coupon/:couponcode',async(req,res)=>{

console.log('apply coupon');
try{

  await Userhelpers.checkCouponStatus(req.params.couponcode,req.session.uservalue._id).then(async(response)=>{
    let total=await Userhelpers.getTotalAmount(req.session.uservalue._id)
    if(response.couponStatus=='Used'){
      res.json({status:false})
    }
    else{
      couponDetails=await Userhelpers.couponGenerate(req.params.couponcode)
      let discount=0
      if(couponDetails==null||couponDetails.crieteria>total){
        console.log('null');
        res.json({status:false,discount})
      } 
      else {
        console.log('else');
        console.log(couponDetails.crieteria,'crieteria');
        console.log(total);
       
          console.log('else in');
          console.log('@@@@@@');
        if( couponDetails.crieteria<=total){
          discount=(total/100)*couponDetails.percentage
          let totalAmount=total-discount
          console.log(total,'dfghjkl;');
           res.json({status:true,totalAmount,discount})
         
        }
         
          
        }
       
      
      
    }
  })

}catch(err){
  res.redirect('/')
}



})
router.get('/orderPlaced',verifylogin,async(req,res)=>{
  let cartCount=null
  let wishlistCount=null
if(req.session.uservalue){
 cartCount=await Userhelpers.getCartCount(req.session.uservalue._id)
 wishlistCount=await Userhelpers.getWishlistCount(req.session.uservalue._id)
 console.log(cartCount);
}

  res.render('user/orderPlaced',{layout:'userlayout',cartCount,wishlistCount})
})
router.get('/orders',verifylogin,async(req,res)=>{
  var cartCount=null
  var wishlistCount=null
  if(req.session.uservalue){
   cartCount=await Userhelpers.getCartCount(req.session.uservalue._id)
   wishlistCount=await Userhelpers.getWishlistCount(req.session.uservalue._id)
  
  }
    await Userhelpers.getAllOrder(req.session.uservalue._id).then((order)=>{
    

      for(let i=0;i<order.length;i++){
        if(order[i].status=='Order Canceled'){
          
          order[i].cancel=true
        }
        if(order[i].totalAmount){
          order[i].Amount=true
        }
        if(order[i].total==0||order[i].totalAmount==0){
          order[i].amountzero=true
          
          console.log(order[i].amountzero,'147852');
        }

       
      }
    

   
    res.render('user/order',{layout:'userlayout',order,cartCount,wishlistCount})
      
    })
   
  
  
})
router.get('/viewOrderList/:id',verifylogin,async(req,res)=>{
  let products= await Userhelpers.getOrderProducts(req.params.id)
  
   console.log(products,'orderingsssssss');
   let cartCount=null
   let wishlistCount=null
 if(req.session.uservalue){
  cartCount=await Userhelpers.getCartCount(req.session.uservalue._id)
  wishlistCount=await Userhelpers.getWishlistCount(req.session.uservalue._id)
  console.log(cartCount);
 }


   res.render('user/orderList',{layout:'userlayout',products,cartCount,wishlistCount})
 
 
})


router.post('/verifyPayment',verifylogin,async(req,res)=>{
console.log(req.body,'body');
await Userhelpers.verifyPayment(req.body).then(()=>{
   Userhelpers.changePaymentStatus(req.body['order[receipt]']).then(()=>{
    console.log('payment success');
   
      res.json({status:true})
    
  })
}).catch((err)=>{
  res.json({status:false,errMsg:'Payment failedd'})
  console.log(err,'catch');
})
})

router.get('/invoice/:id',verifylogin,async(req,res)=>{
  let orderDetails=await Userhelpers.orderTracker(req.params.id)
  let products= await Userhelpers.getOrderProducts(req.params.id)
  let userData=await Userhelpers.getUserdata(req.session.uservalue._id)
  console.log(orderDetails,',,,,,,,,,');
  res.render('user/invoice',{layout:'userlayout',orderDetails,userData,products})
})
router.get('/orderTrack/:id',verifylogin,async(req,res)=>{
  let trackDetails=await Userhelpers.orderTracker(req.params.id)
console.log(trackDetails.status,'track details');


  if(trackDetails.status=='Order Placed'){
    console.log('plaaaaaced');
    trackDetails.orderplace=true
  }
  else if(trackDetails.status=='Order Shipped'){
    trackDetails.orderShipped=true
  }
  else if(trackDetails.status=='Delivered'){
   trackDetails.delivered=true
  }
console.log(trackDetails,'details');

  res.render('user/orderTrack',{layout:'userlayout',trackDetails})
})
router.get('/userError',verifylogin,(req,res)=>{
  res.render('user/userErrorPage',{layout:'loginlayout'})
 })
//  router.get('/*',(req,res)=>{
//   res.redirect('userError')
//  })

router.get('/profil',verifylogin,async(req,res)=>{

  let userData= await Userhelpers.getUserdata(req.session.uservalue._id)
  console.log(userData,'data');
  res.render('user/userProfile',{layout:'userlayout',userData})
})

router.get('/editProfile',verifylogin,async(req,res)=>{
  
 
  let userData= await Userhelpers.getUserdata(req.session.uservalue._id)
  console.log(userData,'data');
  res.render('user/editProfile',{layout:'userlayout',userData})
   

})
router.post('/editProfile/:id',verifylogin,async(req,res)=>{
  console.log(req.files.userimage,'image');
  let newimg=req.files.userimage

  await Userhelpers.updateProfile(req.body,req.params.id).then(()=>{
   newimg.mv('./public/userprofile/'+req.session.uservalue._id+'_user.jpg')
    console.log('edited profile');
    res.redirect('/profil')
  })
})


router.get('/coupon',verifylogin,async(req,res)=>{
  
  
await Adminhelpers.getAllcoupen().then((coupenData)=>{
  res.render('user/coupen',{layout:'userlayout',coupenData})
})
 
  
   

})
module.exports = router;
