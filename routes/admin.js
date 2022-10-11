var express = require('express');
var router = express.Router();
var Adminhelpers=require('../helpers/Adminhelpers')
var Handlebars=require('handlebars')

const Userhelpers = require('../helpers/Userhelpers');



Handlebars.registerHelper("inc",(value,options)=>{
  return parseInt(value)+1
  })

const verifylogin=(req,res,next)=>{
  if(req.session.adminlogged){
    next()
  }
  else{
    adminlogged=false
    res.redirect('/admin')
  }
}
router.get('/', function(req, res, next) {
  
  if(req.session.adminlogged){
    res.redirect('/admin/admin')
  }
  
  res.render('admin/adminlogin',{ layout:'loginlayout' })

 
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  
    console.log('respond with a resource');
    
    res.render('admin/adminlogin',{ layout:'loginlayout' })
  
   
  });
 
  
  router.post('/login',async function (req, res, next) {
    console.log('logged');
    console.log(req.body);
    await Adminhelpers.dologin(req.body).then((response)=>{
      console.log(response,'respppppppppppppppppp');
      if(response.status){
       console.log(response.admindata,'response users');
        req.session.adminvalue=response.admindata   
        req.session.adminlogged=true
        console.log(req.session.adminvalue,'//////////////////');
        res.redirect('/admin')
        req.session.ErrorLogin=false
      }
      else{
        console.log('cant login');
        req.session.ErrorLogin=true
        let ErrorLogin=ErrorLogin
        res.redirect('/')
        
        
      
     
      }
    }).catch((err)=>{res.send(err)})
  
  });
  router.get('/admin',verifylogin,async function(req, res, next) {
    console.log('order')
let totalCancel=0;
    let orderCount= await Adminhelpers.totalOrder()
   let totalSales= await Adminhelpers.totalSales()
    let userCount= await Adminhelpers.userCount()
    let totalDelivery=await Adminhelpers.totalDelivered()
     totalCancel=await Adminhelpers.totalCancel()
    let totalPlaced=await Adminhelpers.totalPlaced()
    let totalShipped=await Adminhelpers.totalShipped()
    let codCount= await Adminhelpers.totalCod()
    let onlineCount= await Adminhelpers.totalOnline()
    let totalRevenue= await Adminhelpers.totalRevenue()
    totalRevenue.total= (totalRevenue.total)/20*100
    console.log(totalCancel,'c');
    console.log('revenue',totalRevenue,'tp');
    console.log('count start',userCount,'count');
    console.log('sales',totalSales,'//');

    res.render('admin/adminIndex', { layout:'adminlayout',orderCount,totalSales,userCount,totalDelivery,totalCancel,totalPlaced,totalShipped,codCount,totalRevenue,onlineCount});
    
   });
  
   router.get('/orderlist',verifylogin,async function(req, res, next) {
    
    console.log('list');
    await Adminhelpers.getAllOrder().then((orders)=>{
      console.log(orders);
   for(let i=0;i<orders.length;i++){
    if(orders[i].status=='Order Placed'){
      orders[i].orderPlaced=true
      console.log('placed');
    }
    else if(orders[i].status=='Order Canceled')
    {
       orders[i].cancel=true
       orders[i].orderplaced=false
       orders[i].shipped=false
      console.log('cancel');

    }
    else if(orders[i].status=='Order Shipped'){
      orders[i].shipped=true
      console.log('shipped');
    }
    

   }
   
   console.log('status');
      res.render('admin/orderlist',{ layout:'adminlayout',orders }) 
    })
  })
   router.get('/userlist',verifylogin, function(req, res, next) {
  
    Adminhelpers.getAllusers().then((users)=>{
      console.log(users);
      res.render('admin/userlist',{layout:'adminlayout',users})
    })
    })
   
  router.post('/addcategory',verifylogin,(req,res,next)=>{
    Adminhelpers.addcategory(req.body).then((category)=>{
      console.log(category);
      res.redirect('/admin/categorylist')
    })
  })
   
  
  
  
  router.get('/categorylist',verifylogin, function(req, res, next) {
    
    console.log('category');
    Adminhelpers.getAllcategory().then((categories)=>{
      console.log(categories);
      res.render('admin/categorylist',{ layout:'adminlayout',categories })
  
    })
   
   
  });
  
  router.get('/offerlist',verifylogin,async function(req, res, next) {
    
    await Adminhelpers.getAllcoupen().then((coupenData)=>{
      res.render('admin/offerlist',{ layout:'adminlayout',coupenData })
    })
    
  
  
   
  });
  router.get('/addCoupen',verifylogin, function(req, res, next) {
    
    console.log('offer');
    res.render('admin/addCoupen',{ layout:'adminlayout' })
  
   
  });
  router.post('/addCoupen',verifylogin, function(req, res, next) {
    
    console.log('offerpost');
    Adminhelpers.coupenGenerate(req.body).then(()=>{
    res.redirect('/admin/offerlist')
    })
   
  
   
  });
  
  router.get('/logout',verifylogin,(req,res,next)=>{
    req.session.destroy()
    res.redirect('/admin')
  })
  router.get('/delete/:id',verifylogin,(req,res)=>{
    let categoryId=req.params.id
    console.log(categoryId);
    Adminhelpers.deleteCategory(categoryId).then((response)=>{
      res.redirect('/admin/categorylist')
      console.log('deleted');
    })
    
  })
  
  
  router.get('/blockUser/:id',verifylogin,(req,res,next)=>{
    try{
      Adminhelpers.blockuser(req.params.id).then((response)=>{
        console.log(response);
        res.redirect('/admin/userlist')
      })
    }
    catch{
      res.redirect('/admin/userlist')
    }
  })
  router.get('/unblockUser/:id',verifylogin,(req,res,next)=>{
    try{
      Adminhelpers.unblockuser(req.params.id).then((response)=>{
        console.log(response);
        res.redirect('/admin/userlist')
      })
    }
    catch{
      res.redirect('/admin/userlist')
    }
  })
  router.get('/Banner',verifylogin, async(req,res,next)=>{
   
    console.log('bannerghjklkjhgfdfghjk');
   let banner=await Adminhelpers.getAllbanners()
    Adminhelpers.getAllsliders().then((sliders)=>{
      console.log(sliders);
      console.log('baaaaaaa');
    
      res.render('admin/Banner',{layout:'adminlayout',sliders,banner})
   })
   
  
  })

  router.get('/editBanner/:id',verifylogin, async(req,res,next)=>{
    let bannerData=await Adminhelpers.getBannerData(req.params.id)
    res.render('admin/editBanner',{layout:'adminlayout',bannerData})
  })
  router.post('/editBanner/:id',(req,res,next)=>{
    let id=req.params.id
    Adminhelpers.editBanner(req.params.id,req.body).then(()=>{
     
      res.redirect('/admin/Banner')
      if(req.files.image){
        let image=req.files.image
        image.mv('./public/banner-image/'+id+'.jpg')
      }
    })
    
  })
  router.get('/editSlider/:id',verifylogin, async(req,res,next)=>{
    let sliderData=await Adminhelpers.getSliderData(req.params.id)
    res.render('admin/editSlider',{layout:'adminlayout',sliderData})
  })
  router.post('/editSlider/:id',(req,res,next)=>{
    let id=req.params.id
    console.log(req.body,'booooooooody');
    Adminhelpers.editSlider(id,req.body).then(()=>{
     
      res.redirect('/admin/Banner')
      if(req.files.image){
        let image=req.files.image
        image.mv('./public/banner-image/'+id+'.jpg')
      }
    })
    
  })
  router.get('/productlist',verifylogin, function(req, res, next) {
    
    console.log('list');
    Adminhelpers.getAllproducts().then((products)=>{
      console.log(products);
   
      res.render('admin/productlist',{ layout:'adminlayout',products })
    })
   
  
   
  });
  router.get('/product-delete/:id',verifylogin, (req,res)=>{
    let productId=req.params.id
    console.log(productId);
    Adminhelpers.deleteProduct(productId).then((response)=>{
      res.redirect('/admin/productlist')
      console.log('deleted');
    })
    
  })
  router.get('/addSlider',verifylogin, function(req, res, next) {
    
    console.log('addslider');
    res.render('admin/addSlider',{ layout:'adminlayout' })
  
   
  });
  router.get('/addproduct',verifylogin,async function(req, res, next) {
    
    console.log('addproduct');
    let category=await Adminhelpers.getAllcategory()
    console.log('categoryeees:',category);
    res.render('admin/addproduct',{ layout:'adminlayout',category })
  
   
  });
  
  router.post('/addproduct',verifylogin, function(req, res, next) {
    console.log(req.body);
    console.log(req.files.image);
    console.log(req.body.proname);

    
    Adminhelpers.addProduct(req.body).then((product)=>{
      console.log(product,'::::::::::::::::::::::');
      var img1=req.files.image
      var img2=req.files.image2
      var img3=req.files.image3


      console.log(product.insertedId );
      img1.mv('./public/images/'+product.insertedId+'_1.jpg')
       
      img2.mv('./public/images/'+product.insertedId+'_2.jpg')
      img3.mv('./public/images/'+product.insertedId+'_3.jpg')
      res.redirect('/admin/productlist')
       
      
     
  
    })
    
    
   
  });
  router.post('/addSlider',verifylogin, function(req, res, next) {
    console.log(req.body);
    console.log(req.files.image);
   

    
    Adminhelpers.addSlider(req.body).then((slider)=>{
      console.log(slider,'::::::::::::::::::::::');
      var pro_image=req.files.image

      console.log(slider.insertedId );
      pro_image.mv('./public/banner-image/'+slider.insertedId+'.jpg', function(err){
        if(err){
          console.log(err);
        }else{
          console.log('uploaded;;;;;;;;');
          res.redirect('/admin/Banner')
          console.log('loaded hyjg');
        }
      })
     
  
    })
    
    
   
  });
  router.get('/addBanner',verifylogin, (req,res)=>{
    res.render('admin/addBanner',{layout:'adminlayout'})
  })
  router.post('/addBanner',verifylogin, function(req, res, next) {
    
    Adminhelpers.addBanner(req.body).then((banner)=>{
      console.log(banner,'::::::::::::::::::::::');
      var pro_image=req.files.image

      console.log(banner.insertedId );
      pro_image.mv('./public/banner-image/'+banner.insertedId+'.jpg', function(err){
        if(err){
          console.log(err);
        }else{
          console.log('uploaded5852558');
          res.redirect('/admin/Banner')
        }
      })
     
  
    })
    
    
   
  });
 router.get('/shipped/:id',verifylogin,async (req,res)=>{
  let orderId=req.params.id
 await Adminhelpers.shippedOrder(orderId).then(()=>{

    res.redirect('/admin/orderlist')
  })
  
 })
 router.get('/cancel/:id',verifylogin,async(req,res)=>{
  let orderId=req.params.id
  await Adminhelpers.cancelOrder(orderId).then(()=>{
   
    res.redirect('/admin/orderlist')
  })
 })
 router.get('/placed/:id',verifylogin,async(req,res)=>{
  let orderId=req.params.id
  await Adminhelpers.orderPlaced(orderId).then(()=>{
  
    res.redirect('/admin/orderlist')
  })
 })
 router.get('/Unblocked/:id',verifylogin,async(req,res)=>{
  let orderId=req.params.id
  await Adminhelpers.unblockOrder(orderId).then(()=>{
  console.log('ldnmxv');
    res.redirect('/admin/orderlist')
  })
 })
 router.get('/error',verifylogin,(req,res)=>{
  res.render('admin/adminError',{layout:'adminlayout'})
 })
 router.get('/viewOrderList1/:id',verifylogin,async(req,res)=>{
  await Userhelpers.getOrderProducts(req.params.id).then((products)=>{
    console.log(products,'orderingsssssss');
    res.render('admin/orderView',{layout:'adminlayout',products})
  }).catch((err)=>{
    if(err){
      res.redirect('/error')
    }
  })

  
  
 
 
})

// router.get('/*',(req,res)=>{
//   res.redirect('/error')
// })
module.exports = router;
