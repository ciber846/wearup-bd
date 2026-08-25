const products=[
 {name:"ফ্যাশন পণ্য",price:"মূল্য জানতে যোগাযোগ করুন",icon:"👕"},
 {name:"দৈনন্দিন ব্যবহার্য পণ্য",price:"মূল্য জানতে যোগাযোগ করুন",icon:"🛍️"},
 {name:"পাইকারি পণ্য",price:"বাল্ক মূল্য জানতে যোগাযোগ করুন",icon:"📦"},
 {name:"নতুন কালেকশন",price:"মূল্য জানতে যোগাযোগ করুন",icon:"✨"},
 {name:"জনপ্রিয় পণ্য",price:"মূল্য জানতে যোগাযোগ করুন",icon:"⭐"},
 {name:"স্পেশাল অফার",price:"অফার জানতে যোগাযোগ করুন",icon:"🔥"},
 {name:"গিফট আইটেম",price:"মূল্য জানতে যোগাযোগ করুন",icon:"🎁"},
 {name:"অন্যান্য পণ্য",price:"পণ্য জানতে যোগাযোগ করুন",icon:"🛒"}
];
let count=0;
function render(list=products){
 const grid=document.getElementById("productGrid");
 grid.innerHTML=list.map((p,i)=>`<article class="product"><div class="product-img">${p.icon}</div><div class="product-body"><h3>${p.name}</h3><div class="price">${p.price}</div><button class="btn primary" onclick="addCart('${p.name}')">অর্ডার করুন</button></div></article>`).join("");
}
function filterProducts(){
 const q=document.getElementById("search").value.toLowerCase();
 render(products.filter(p=>p.name.toLowerCase().includes(q)));
}
function addCart(name){
 count++;document.getElementById("cartCount").textContent=count;
 showToast(name+" — অর্ডার তালিকায় যোগ হয়েছে");
}
function showToast(text){
 const t=document.getElementById("toast");t.textContent=text;t.style.display="block";
 setTimeout(()=>t.style.display="none",2200);
}
function submitOrder(e){
 e.preventDefault();
 showToast("আপনার অর্ডার অনুরোধ প্রস্তুত হয়েছে। ফোন/Facebook-এ যোগাযোগ করুন।");
 e.target.reset();
}
function toggleMenu(){
 const n=document.getElementById("navLinks");
 n.style.display=n.style.display==="flex"?"none":"flex";
}
document.getElementById("year").textContent=new Date().getFullYear();
render();
