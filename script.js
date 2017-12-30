   $(window).scroll(function(){
      if ($(this).scrollTop() > 135) {
          $('.tableofProducts').addClass('fixed');
      } else {
          $('.tableofProducts').removeClass('fixed');
      }
  });

$.fn.shopcart = function(cart, options){
            var settings = $.extend({
             products_load_json:'',
             products_load_url:'',
             url_load_page_count:3,  
        },options);

var myStore={

    initial:function initial(products)
        {
        this.addProducts(products);
    },
    load:function(){
           if(settings.products_load_url == '' || settings.products_load_url == undefined || settings.products_load_url == null){   
                myStore.initial(settings.products_load_json);  
           }
           else{
                $.post('https://wpwith.us/experis/cart-products-ajax.php',{from:1, to: settings.url_load_page_count},function(data){  
                    myStore.initial(data);})
                var scrollfrom = 13;
               settings.url_load_page_count = 16;
                
               $(window).scroll(function() {
                 if($(window).scrollTop() == $(document).height() - $(window).height()) {
                    var scrollobj={
                    from : scrollfrom,
                    to: settings.url_load_page_count
                     }
                    $.post('https://wpwith.us/experis/cart-products-ajax.php',scrollobj,function(data){  
                    myStore.initial(data);
                })
                scrollfrom += 4;
                settings.url_load_page_count += 4;
                  }
                 })
            }
    },
    addProducts:function(products)
        {
        var htmlProducts=[];

        for (var i = 0; i < products.length; i++) 
            {
            htmlProducts.push(this.createProduct(products[i]));  
            }   
        $("main .products").append(htmlProducts)
        },
    createProduct:function(product)
        {
        var htmlProduct=$("<div>").addClass("product"); 
        var productWrapper=$("<div>").addClass("productHolder");              

        productWrapper.append($("<img>" ,{src:product.image}).addClass("productPic")).append($("<div>" ).addClass("productName").text(product.name));
        
        var productInfo=$("<div>").addClass("Holdinfo");
        productInfo.append($("<span>" ).addClass("productPrice price").text(product.price)).append(this.createProductButton());

        productWrapper.append(productInfo).appendTo(htmlProduct);

        return  htmlProduct;
        },
    flytocart:function(product, cartrow, action){
        var productImg = product.find($(".productPic")).eq(0);
        var hidden = false;
        if(!cartrow.is(":visible"))
        {
            hidden = true;
            cartrow.show();
        }
        var cartrowleft = cartrow.offset().left;
      var cartrowtop = cartrow.offset().top;
      if(hidden){
          cartrow.hide();
      }
       if (productImg) {
            var productImg = productImg.clone()
                .offset({
                top: productImg.offset().top,
                left: productImg.offset().left
            }).css({
                'opacity': '0.5',
                    'position': 'absolute',
                    'height': '150px',
                    'width': '150px',
                    'z-index': '100'
            }) .appendTo($('body'))
                .animate({
                'top': cartrow.offset().top + 10,
                    'left': cartrow.offset().left + 10,
                    'width': 75,
                    'height': 75
            }, 1000, 'easeInOutExpo');}
      
},
    createProductButton:function()
        {
        return $("<input>",{type:"button", value:"Add to Cart"} ).addClass("addToCartbtn").click(function(){
                myStore.addToCart($(this))
            });
        },

    addToCart:function(productButton)
        {
           var holder = $(".productHolder") 
        var product=this.createProductObject(productButton);
        var htmlCartProductColName=undefined;

        $(".productsCart  .productNames").each(function(){
            if($(this).text() === product.name )
                {
                htmlCartProductColName=$(this); 
                return false;
                }
        });
            var cartrow, action;
            if(htmlCartProductColName){
                cartrow = htmlCartProductColName.closest(".myTableRow");                  
                    action = function(){               
                        myStore.addQuan(cartrow);
                 
                    }
                }
                else{
                    var newcartrow = true;
                    cartrow = this.createCartRow(product);
                    $('.productsCart .totalRow').before(cartrow);
                    action = function(){
                        myStore.updateCartRowTotal();
                    }
                }
            this.flytocart(holder,cartrow,action);
        },
    addQuan:function(cartrow){
        var quaninput = cartrow.find(".productQuans");
        var quan = parseInt(quaninput.val())+1;
        quaninput.val(quan);
        var totalPrice = parseFloat(parseFloat(cartrow.find(".productPrices").text()) * quan).toFixed(2);
        cartrow.find(".producttotPrices").text(totalPrice);
        this.updateCartRowTotal();
    },
    createProductObject:function(productButton)
        {
        var productWrapper=productButton.closest(".productHolder");
        var product={};

        product.name=productWrapper.find(".productName").text();
        product.price=parseFloat(productWrapper.find(".productPrice").text());
        
        return product;
        },
    
    createCartRow:function(product)
        {
        var cartRow=$("<tr>").addClass("myTableRow");
        
        $("<td>").append(this.createCartProductColDeleteButton()).addClass("deleteBtnHolder").appendTo(cartRow);

        cartRow.append($("<td>").addClass("productNames").text(product.name));

        $("<td>").append(this.createCartProductQtyInput()).addClass("productQuanss").appendTo(cartRow);

        cartRow.append($("<td>").addClass("productPrices price").text(product.price));
        cartRow.append($("<td>").addClass("producttotPrices price").text(product.price));

        return cartRow;
        },
    
    createCartProductColDeleteButton:function()
        {
        return $("<div>").addClass("deleteButon").text("X").click(function() {
                            myStore.deleteCartRow($(this));
                         });
        }, 
    deleteCartRow:function(cartProductColDeleteButton)
        {
        cartProductColDeleteButton.closest(".myTableRow")
            .css("background-color","#FF3700")
            .fadeOut(400,function(){  
            this.remove();
            myStore.updateCartRowTotal();
            })
        },
    
     createCartProductQtyInput:function()
        {
        return $("<input>").attr('type', 'number').attr('min', '1').attr('value', '1').addClass("productQuans").change(function(){
        myStore.updateCartProductColTotalPrice($(this));
            });
        },

    updateCartProductColTotalPrice:function(cartProductQtyInput)
        {
        var cartRow=cartProductQtyInput.closest(".myTableRow");
        var totalPrice=parseFloat( parseFloat(cartRow.find(".productPrices").text()) * parseInt(cartProductQtyInput.val()) ).toFixed(2);
        
        cartRow.find(".producttotPrices").text(totalPrice) ;

        this.updateCartRowTotal();
        },
    
    updateCartRowTotal:function()
        {
        var totalQty=0;
        var totalPrice=0;

        $(".productsCart .productQuans").each(function(){
            totalQty+=parseInt($(this).val());
            });
        
        $(".productsCart .producttotPrices").each(function(){
            totalPrice+=parseFloat($(this).text());
            });
        
        $(".productsCart .totalRow .totQuan").text(totalQty);
        $(".productsCart .totalRow .totPrice").text(totalPrice.toFixed(2));
        }
    }; 
    myStore.load();

}




