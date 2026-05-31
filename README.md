# 🚗 AutoHub Car Dealership - Ready-to-Market Site

## 🎉 Features
- **Modern UI**: Tailwind CSS, dark theme, responsive (mobile-first)
- **Home**: Hero section, featured cars grid
- **Browse**: Filterable listings (/cars - search/make/year)
- **Details**: Gallery carousel, interest form, WhatsApp/call
- **Admin**: Full CRUD (add/edit/delete cars), auth protected
- **Next.js 15 + Prisma**: Production-ready

## 🚀 Quick Start
1. **Fix Auth** (errors in terminal):
   ```
   ```
2. **DB** (if needed): `npx prisma db push`
3. **Run**: `npm run dev` → http://localhost:3000
4. **Admin**: /login → admin/admin → /admin add cars

## 📱 Demo Flow
- Home → Browse Cars (filter) → Details (form/gallery)
- Add sample cars: BMW M3 (use unsplash.com/photos/car images URLs)

## 🖼️ Real Images
Download from Unsplash Cars:
- https://images.unsplash.com/photo-1552519507-da3b142c6e3d → BMW → public/cars/bmw.jpg
- Repeat for 8-10 cars

## Production
`npm run build && npm start`

Site live & market-ready! Add images + DB cars for full demo.
