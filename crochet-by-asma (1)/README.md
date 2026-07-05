# كروشيه أسماء | Crochet by Asma

متجر إلكتروني ومعرض أعمال لمنتجات يدوية (كروشيه، مطبوعات، طباعة ثلاثية الأبعاد) — عربي بالكامل، RTL، Mobile First.

## التشغيل محليًا
```bash
npm install
npm run dev
```
افتح الرابط الظاهر (عادة http://localhost:5173).

## بناء نسخة الإنتاج
```bash
npm run build
npm run preview
```

## ملاحظات
- البيانات (منتجات، طلبات، إعدادات) محفوظة في localStorage للمتصفح — لا يوجد Backend بعد.
- لوحة التحكم من زر "لوحة التحكم" في القائمة العلوية.
- الصور والرسومات والشعار مضمّنة داخل الكود (لا تحتاج ملفات خارجية).

## النشر على Vercel
- Framework Preset: **Vite**
- Root Directory: **./**
- Build Command: **npm run build**
- Output Directory: **dist**
- Environment Variables: لا شيء
