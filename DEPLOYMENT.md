# نشر المشروع على Vercel

## خطوات النشر

1. **أنشئ حساب على Vercel**: إذا لم يكن لديك حساب بالفعل.

2. **اربط مستودع GitHub**: 
   - انقر على "Add New..." ثم "Project"
   - اختر مستودع GitHub الخاص بك
   - اختر "Import"

3. **إعداد المشروع**:
   - **Framework Preset**: اختر "Vite"
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **إعدادات البيئة**:
   - انتقل إلى Project Settings > Environment Variables
   - أضف المتغيرات التالية:
     - `GEMINI_API_KEY`: مفتاح API الخاص بك (اختياري، لأن المفتاح مضمن في الكود)
     - `GEMINI_MODEL`: `gemini-2.5-flash`

5. **انشر المشروع**:
   - انقر على "Deploy"

## حل المشاكل الشائعة

### شاشة بيضاء بعد النشر
- تأكد من وجود ملف `vercel.json` الصحيح بالمسارات المناسبة
- اضغط "Redeploy" من لوحة التحكم

### خطأ "API key missing"
- تأكد من إضافة المتغيرات البيئية المذكورة أعلاه
- اضغط "Redeploy" بعد إضافة المتغيرات

### مشاكل في التوجيه (Routing)
- تأكد من وجود ملف `vercel.json` بالمحتوى الصحيح:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}
```

## ملاحظات مهمة

- تم تضمين مفتاح API في الكود لتسهيل النشر، لكن في بيئة الإنتاج الحقيقية يجب استخدام متغيرات البيئة فقط.
- يمكنك استخدام مفتاح API خاص بك عبر متغيرات البيئة لتجنب القيود على المفتاح المضمن.
- لا تنسَ تحديث Tailwind CSS لبيئة الإنتاج في المستقبل.
