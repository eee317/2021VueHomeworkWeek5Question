import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js';
const apiUrl = 'https://vue3-course-api.hexschool.io';
const api_path = 'peiying';
let cartTotal;
const app=createApp({
    data(){
        return{
            cartData:{},
            products:[],
            productId:'',
            isLoadingItem:'',
            
        }
    },
    methods:{
        getProducts(){
            axios.get(`${apiUrl}/v2/api/${api_path}/products/all`)
            .then(res=>{
                this.products=res.data.products;
                console.log(this.products)
                
            })
            .catch(err=>{
                console.log(err)
            })
        },
        openProductModal(id){
            //要操作下方的modal，所以要在HTML元件那邊加入ref="productModal"
            this.productId=id;
            this.$refs.productModal.openModal();
        
        },
        getCart(){
            const url=`${apiUrl}/v2/api/${api_path}/cart`
            axios.get(url)
            .then(res=>{
                
            this.cartData=res.data.data;
            console.log(this.cartData);
            cartTotal=res.data.data;

            
            })
            .catch(err=>{
                console.log(err)
            })
        },
        addToCart(id, qty=1){
            const data={
                product_id:id,
                qty
            };
            this.isLoadingItem=id;
            const url=`${apiUrl}/v2/api/${api_path}/cart`;
            axios.post(url, {data})
            .then(res=>{
                this.getCart();
                this.isLoadingItem='';
            })
            .catch(err=>{
                console.dir(err)
            })
        }

        
    },
    mounted() {
        this.getProducts();
        this.getCart();
       
        
      },
    
});
app.component('product-modal',{
    props:['id'],
    template:'#userProductModal',
    data(){
        return{
            //讓此物件可以在元件內使用this共用
            modal:{},
            product:{}
        }
    },
    watch:{
        //當ID有變動就觸發getProduct的行為
        id(){
            
            this.getProduct()
        }
    },
    methods:{
        openModal(){
            this.modal.show();
        },
        getProduct(){
            axios.get(`${apiUrl}/v2/api/${api_path}/product/${this.id}`)
            .then(res=>{
                this.product=res.data.product;
                console.log(res)
                
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },
    //抓DOM
    mounted(){
        this.modal = new bootstrap.Modal(this.$refs.modal);
    }
})
app.mount('#app');


console.log(cartTotal)