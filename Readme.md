# GitHub

# ข้อมูลการเข้าถึง GitHub OAuth

# คุณต้องสร้างแอปพลิเคชัน OAuth บน GitHub เพื่อรับ Client ID และ Client Secret

# ลงทะเบียน ได้ที่

###https://github.com/settings/developers

GITHUB_CLIENT_ID=xxxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxx

# GitHub OAuth

# เส้นทางที่ GitHub จะส่งผู้ใช้กลับมาหลังจากการอนุญาต

# เปลี่ยน localhost เป็นโดเมนของคุณหากคุณใช้งานในเซิร์ฟเวอร์จริง

REDIRECT_URI=xxxxx <-กำหนดจากการเข้าไปลงทะเบียน->

# work flow of github OAuth

\*\*\* สรุป Flow ทั้งหมดแบบง่าย

- ผู้ใช้คลิก "Login with GitHub" → ไปหน้า GitHub
- GitHub ถามว่า "แอปนี้ขอสิทธิ์ XYZ คุณอนุญาตไหม?" → ผู้เลือกอนุญาต
- GitHub ส่ง code กลับมายังเซิร์ฟเวอร์ของคุณ
- เซิร์ฟเวอร์แลก code เป็น access_token // โดยที่ server หมายถึง server ที่มันทำหน้าที่ รัน app ที่ผู้ใช้อนุญาตการขอสิทธิการเข้าถึงข้อมูลของ api ต่างๆ จาก github แล้วใช่ไหม
- เซิร์ฟเวอร์ใช้ access_token ดึงข้อมูลผู้ใช้ → แสดงผลหรือเก็บลงระบบ
