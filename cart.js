//import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js';
const apiUrl = 'https://vue3-course-api.hexschool.io';
const api_path = 'peiying';
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min); //限制最小的值，例如：3碼
defineRule('max', max); //限制最大的值
//宣告語言為中文
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');
const app=Vue.createApp({
    data(){
        return{
            cartData:{},
            products:[],
            productId:'',
            isLoadingItem:'',
            cart:{
                carts:[]
                //因為一開始渲染時，沒有資料的狀態無法讀取length
            }
            
        }
    },
    components: {
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
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
            if(this.cartData.carts.length===0){
                this.cart={
                carts:[]};
            }else{
                this.cart=res.data.data;
            }

            
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
                this.$refs.productModal.closeModal();
                this.isLoadingItem='';
            })
            .catch(err=>{
                console.dir(err)
            })
        },
        removeCartItem(id) {
            this.isLoadingItem = id;
            axios.delete(`${apiUrl}/api/${api_path}/cart/${id}`)
            .then((res) => {
                console.log(res);
                this.getCart();
                this.isLoadingItem = '';
            });
        },
        updateCartItem(item){
            const data={
                product_id:item.id,
                qty:item.qty
            }
            this.isLoadingItem=item.id;
            const url=`${apiUrl}/v2/api/${api_path}/cart/${item.id}`
            axios.put(url,{data})
            .then(res=>{
                console.log(res)
                this.getCart();
                this.isLoadingItem='';
            })
            .catch(err=>{
                console.log(err)
            })
        }

        
    },
    mounted() {
        this.getProducts();
        this.getCart();
       
        
      },
    
});
app.component('product-modal',{
    props:['id','is-loading-item'],
    template:'#userProductModal',
    data(){
        return{
            //讓此物件可以在元件內使用this共用
            modal:{},
            product:{},
            qty:1
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
        closeModal(){
            this.modal.hide();
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
        },
        addToCart(){
            this.$emit('add-cart',this.product.id, this.qty)
        },
        
        
        
    },
    //抓DOM
    mounted(){
        this.modal = new bootstrap.Modal(this.$refs.modal);
    }
})
app.mount('#app');