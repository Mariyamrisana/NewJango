
		function addToCart(proId){
            console.log(']]]]]]]]]]]]]]]]]]]]]]');
			$.ajax({
                
				url:'/add-to-cart/'+proId,
				methode:'get',
				success:(response)=>{
                    if(response.status){
                        let count=$('#cart-count').html()
                        count=parseInt(count)+1
                        $("#cart-count").html(count)
                    }
                    console.log(response,'resssssss');
					
				}
			})
		}
		function addToWishlist(proId){
            console.log('$$$$$$$]]]]]]]]]]]');
			$.ajax({
                
				url:'/add-to-wishlist/'+proId,
				methode:'get',
				success:(response)=>{
                   let wcount=$('#wish-count').html()
				   wcount=parseInt(wcount)+1
				   $('#wish-count').html(wcount)
                    console.log(response,'resssssss');
					
				}
			})
		}
	