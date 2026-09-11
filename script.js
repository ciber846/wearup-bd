let products=[], cat="সব", cart=[];

async function loadProducts(){
  const {data,error}=await supabaseClient
    .from("products")
    .select("id,name,price,description,image_url,category,stock,created_at")
    .order("created_at",{ascending:false});

  if(error){
    console.error(error);
    products=[];
    document.getElementById("grid").innerHTML="<p>পণ্য লোড করা যায়নি। Supabase setup/check করুন।</p>";
    return;
  }
  products=(data||[]).map(p=>({
    id:p.id,name:p.name,cat:p.category||"অন্যান্য",
    price:Number(p.price)||0,description:p.description||"",
    image_url:p.image_url||"",stock:Number(p.stock)||0
  }));
  render();
}

function render(){
  const search=document.getElementById("search");
  const q=(search?.value||"").toLowerCase().trim();
  const a=products.filter(p=>(cat==="সব"||p.cat===cat)&&p.name.toLowerCase().includes(q));
  document.getElementById("grid").innerHTML=a.length?a.map(p=>`
    <article class="card">
      <div class="pic">${p.image_url?`<img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.name)}" loading="lazy">`:"🛍️"}</div>
      <div class="body">
        <small>${escapeHtml(p.cat)}</small>
        <h3>${escapeHtml(p.name)}</h3>
        ${p.description?`<p>${escapeHtml(p.description)}</p>`:""}
        <div class="price">৳${p.price.toLocaleString()}</div>
        <p>${p.stock>0?`স্টক: ${p.stock}`:"স্টক শেষ"}</p>
        <button class="btn" ${p.stock<=0?"disabled":""} onclick="add('${p.id}')">${p.stock>0?"কার্টে যোগ করুন":"স্টক শেষ"}</button>
      </div>
    </article>`).join(""):"<p>কোনো পণ্য পাওয়া যায়নি।</p>";
}

function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function setCat(c){cat=c;render();location.hash="products"}

function add(id){
  const p=products.find(x=>String(x.id)===String(id));
  if(!p||p.stock<=0)return;
  cart.push(p);update();cartOpen();
}
function update(){
  document.getElementById("count").textContent=cart.length;
  document.getElementById("items").innerHTML=cart.map((p,i)=>
    `<div class="item">${escapeHtml(p.name)} — ৳${p.price} <button onclick="removeItem(${i})">✕</button></div>`
  ).join("")||"<p>Cart খালি।</p>";
  document.getElementById("total").textContent="৳"+cart.reduce((s,p)=>s+p.price,0).toLocaleString();
}
function removeItem(i){cart.splice(i,1);update()}
function cartOpen(){document.getElementById("drawer").style.right="0";document.getElementById("shade").style.display="block"}
function cartClose(){document.getElementById("drawer").style.right="-410px";document.getElementById("shade").style.display="none"}
function checkout(){
  if(!cart.length)return;
  document.getElementById("item").value=cart.map(p=>p.name).join(", ");
  document.getElementById("qty").value=cart.length+" item";
  cartClose();location.hash="contact";
}
function order(e){
  e.preventDefault();
  const text=`WearUp BD Order
Name: ${document.getElementById("name").value}
Phone: ${document.getElementById("phone").value}
Product: ${document.getElementById("item").value}
Quantity: ${document.getElementById("qty").value}
Note: ${document.getElementById("note").value}`;
  const wa="8801XXXXXXXXX";
  window.open("https://wa.me/"+wa+"?text="+encodeURIComponent(text),"_blank");
}
function menu(){const n=document.getElementById("nav");n.style.display=n.style.display==="flex"?"none":"flex"}
document.getElementById("year").textContent=new Date().getFullYear();
update();loadProducts();
