const BUCKET="products";
let adminProducts=[];

const $=id=>document.getElementById(id);
const msg=(id,text,ok=false)=>{$(id).textContent=text;$(id).style.color=ok?"green":"#b00020"};

async function init(){
  const {data}=await supabaseClient.auth.getSession();
  if(data.session) showApp(); else showLogin();
}
function showLogin(){$("loginView").classList.remove("hidden");$("appView").classList.add("hidden")}
function showApp(){$("loginView").classList.add("hidden");$("appView").classList.remove("hidden");loadAdminProducts()}

$("loginForm").addEventListener("submit",async e=>{
  e.preventDefault();msg("loginMsg","Logging in...");
  const {error}=await supabaseClient.auth.signInWithPassword({email:$("email").value,password:$("password").value});
  if(error)return msg("loginMsg",error.message);
  msg("loginMsg","");showApp();
});
$("logoutBtn").onclick=async()=>{await supabaseClient.auth.signOut();showLogin()};

async function loadAdminProducts(){
  const {data,error}=await supabaseClient.from("products").select("*").order("created_at",{ascending:false});
  if(error)return msg("formMsg",error.message);
  adminProducts=data||[];renderRows();
}

function renderRows(){
  $("totalProducts").textContent=adminProducts.length;
  $("totalStock").textContent=adminProducts.reduce((s,p)=>s+(Number(p.stock)||0),0);
  $("productRows").innerHTML=adminProducts.map(p=>`
  <tr>
    <td>${p.image_url?`<img class="thumb" src="${esc(p.image_url)}">`:"—"}</td>
    <td>${esc(p.name)}</td><td>${esc(p.category||"")}</td><td>৳${Number(p.price||0).toLocaleString()}</td><td>${p.stock}</td>
    <td class="actions"><button class="edit" onclick="editProduct('${p.id}')">✏️ Edit</button>
    <button class="delete" onclick="deleteProduct('${p.id}')">🗑️ Delete</button></td>
  </tr>`).join("")||'<tr><td colspan="6">No products yet.</td></tr>';
}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

$("productForm").addEventListener("submit",saveProduct);
$("cancelEdit").onclick=resetForm;
$("refreshBtn").onclick=loadAdminProducts;

async function saveProduct(e){
  e.preventDefault();msg("formMsg","Saving...");
  const id=$("productId").value;
  const file=$("image").files[0];
  let image_url=id?(adminProducts.find(p=>String(p.id)===String(id))?.image_url||""):"";
  let oldPath=id?(adminProducts.find(p=>String(p.id)===String(id))?.image_path||""):"";

  if(file){
    const ext=(file.name.split(".").pop()||"jpg").toLowerCase();
    const path=`${crypto.randomUUID()}.${ext}`;
    const up=await supabaseClient.storage.from(BUCKET).upload(path,file,{upsert:false,contentType:file.type});
    if(up.error)return msg("formMsg","Image upload failed: "+up.error.message);
    image_url=supabaseClient.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    if(id&&oldPath) await supabaseClient.storage.from(BUCKET).remove([oldPath]);
    oldPath=path;
  }

  const payload={name:$("name").value.trim(),price:Number($("price").value),description:$("description").value.trim(),
    category:$("category").value,stock:Number($("stock").value),image_url:image_url,image_path:oldPath||null};

  let result;
  if(id) result=await supabaseClient.from("products").update(payload).eq("id",id);
  else result=await supabaseClient.from("products").insert(payload);
  if(result.error)return msg("formMsg",result.error.message);
  msg("formMsg","Product saved successfully.",true);resetForm();loadAdminProducts();
}

window.editProduct=function(id){
  const p=adminProducts.find(x=>String(x.id)===String(id));if(!p)return;
  $("productId").value=p.id;$("name").value=p.name;$("price").value=p.price;$("stock").value=p.stock;
  $("category").value=p.category||"অন্যান্য";$("description").value=p.description||"";$("image").value="";
  $("formTitle").textContent="✏️ Edit Product";$("cancelEdit").classList.remove("hidden");
  $("preview").innerHTML=p.image_url?`<img src="${esc(p.image_url)}">`:"";
  window.scrollTo({top:0,behavior:"smooth"});
};

window.deleteProduct=async function(id){
  const p=adminProducts.find(x=>String(x.id)===String(id));if(!p)return;
  if(!confirm(`Delete "${p.name}"?`))return;
  const {error}=await supabaseClient.from("products").delete().eq("id",id);
  if(error)return alert(error.message);
  if(p.image_path)await supabaseClient.storage.from(BUCKET).remove([p.image_path]);
  loadAdminProducts();
};

$("image").addEventListener("change",e=>{
  const f=e.target.files[0];if(!f)return;
  $("preview").innerHTML=`<img src="${URL.createObjectURL(f)}">`;
});
function resetForm(){$("productForm").reset();$("productId").value="";$("formTitle").textContent="➕ Add Product";$("cancelEdit").classList.add("hidden");$("preview").innerHTML="";msg("formMsg","")}

supabaseClient.auth.onAuthStateChange((_event,session)=>{if(session)showApp()});
init();
