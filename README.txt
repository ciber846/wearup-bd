WEARUP BD SUPABASE ADMIN

1. Supabase:
   - Create/choose your project.
   - SQL Editor -> run supabase.sql.
   - Storage -> create a PUBLIC bucket named: products
   - Authentication -> Users -> Add/Create the admin user with email + password.

2. supabase.js:
   Replace:
     YOUR_SUPABASE_PROJECT_URL
     YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
   with the project's browser-safe URL and ANON/PUBLISHABLE key.
   Never put service_role/secret keys in frontend files.

3. Files:
   index.html       customer storefront
   script.js        loads products from Supabase
   style.css        your original storefront styling
   admin.html       admin login/dashboard
   admin.js         add/edit/delete/image upload
   admin.css        admin styling
   supabase.js      Supabase client
   supabase.sql     database + RLS policies

4. Open:
   /admin.html
   Login with the Supabase admin user.

5. Add:
   Product Name, Price, Stock, Category, Description, Image -> Save Product.

6. Homepage:
   index.html reads the products table, so new/edit/delete changes appear after refresh.

NOTE:
The uploaded source files are WearUp BD, so this package keeps the WearUp BD branding.
