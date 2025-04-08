# 🔐 GitHub OAuth Setup

## 📝 ข้อมูลการเข้าถึง GitHub OAuth

คุณต้องสร้างแอปพลิเคชัน OAuth บน GitHub เพื่อรับ `Client ID` และ `Client Secret`

👉 ลงทะเบียนได้ที่:  
[https://github.com/settings/developers](https://github.com/settings/developers)

### ตัวอย่าง `.env` ที่ต้องใช้:

```env
GITHUB_CLIENT_ID=xxxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxx

# เส้นทางที่ GitHub จะส่งผู้ใช้กลับมาหลังจากการอนุญาต
# เปลี่ยน localhost เป็นโดเมนของคุณหากคุณใช้งานในเซิร์ฟเวอร์จริง
REDIRECT_URI=http://localhost:3000/auth/callback
