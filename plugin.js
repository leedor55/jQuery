$(document).ready(function(){ 

$('.container').shopcart('.cart', {
     products_load_json:products,
     products_load_url: 'https://wpwith.us/experis/cart-products-ajax.php',
     url_load_page_count: 8
});

 });