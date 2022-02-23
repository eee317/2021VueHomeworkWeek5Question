export default{
    props:['pages'],
    template:`<nav aria-label="Page navigation example">
    <ul class="pagination">
        <li class="page-item" :class="{disabled: !pages.has_next}">
            <a @click='$emit("get-products",1)'
            class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
    <li v-for="page in pages.total_pages" :key="page +'page'" :class="{active:pages.current_page===page}"
        class="page-item">
        <a @click='$emit("get-products",page)'
        class="page-link" href="#">{{page}}</a></li>
    
    <li class="page-item" :class="{disabled: !pages.has_next}">
        <a @click='$emit("get-products",pages.total_pages)'
        class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
        </a>
    </li>
    </ul>
    </nav>`
}