# Portfolio Backend Setup Guide

## 🎯 Features

- **Admin Dashboard**: Manage your portfolio projects
- **Dynamic Content**: All portfolio content stored in MongoDB
- **API Routes**: RESTful API for projects, about, and contact info
- **Authentication**: Secure admin operations with secret token
- **Featured Projects**: Mark projects as featured on homepage

## 📋 Setup Instructions

### 1. Environment Setup

Copy and configure `.env.local`:

```bash
# MongoDB Connection - Choose one:

# Option A: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/portfolio

# Option B: MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority

# Admin Secret - Change this to a strong secret
ADMIN_SECRET=your-secure-secret-key-12345

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` for the portfolio and `http://localhost:3000/admin` for the admin panel.

## 🛠️ Usage

### Admin Panel

1. Go to `http://localhost:3000/admin`
2. Enter your `ADMIN_SECRET` to login
3. Add/Edit/Delete projects
4. Mark projects as "Featured"

### API Endpoints

#### Get All Projects
```bash
GET /api/projects
```

#### Create Project (Admin)
```bash
POST /api/projects
Header: Authorization: Bearer YOUR_ADMIN_SECRET
Body: {
  "title": "Project Name",
  "description": "Description",
  "image": "image-url",
  "tags": ["tag1", "tag2"],
  "liveLink": "https://...",
  "githubLink": "https://...",
  "featured": true
}
```

#### Update Project (Admin)
```bash
PUT /api/projects/{id}
Header: Authorization: Bearer YOUR_ADMIN_SECRET
```

#### Delete Project (Admin)
```bash
DELETE /api/projects/{id}
Header: Authorization: Bearer YOUR_ADMIN_SECRET
```

#### Get About Info
```bash
GET /api/about
```

#### Update About Info (Admin)
```bash
PUT /api/about
Header: Authorization: Bearer YOUR_ADMIN_SECRET
Body: {
  "bio": "Your bio",
  "skills": ["skill1", "skill2"],
  "experience": "Your experience",
  "location": "Your location"
}
```

#### Get Contact Info
```bash
GET /api/contact
```

#### Update Contact Info (Admin)
```bash
PUT /api/contact
Header: Authorization: Bearer YOUR_ADMIN_SECRET
Body: {
  "email": "email@example.com",
  "phone": "+1234567890",
  "linkedin": "https://linkedin.com/in/...",
  "github": "https://github.com/...",
  "twitter": "https://twitter.com/..."
}
```

## 📁 Project Structure

```
app/
├── api/
│   ├── projects/
│   │   ├── route.ts          # GET all, POST create
│   │   └── [id]/route.ts     # PUT update, DELETE
│   ├── about/route.ts        # GET, PUT about info
│   └── contact/route.ts      # GET, PUT contact info
├── admin/
│   └── page.tsx              # Admin dashboard
└── page.tsx                  # Dynamic portfolio homepage

lib/
├── db/
│   ├── connection.ts         # MongoDB connection
│   └── models.ts             # Mongoose schemas
└── utils.ts

.env.local                    # Environment variables
```

## 🔐 Security Notes

- Change `ADMIN_SECRET` to a strong, unique value
- Don't commit `.env.local` to version control
- For production, use environment variable management services
- Add rate limiting to API endpoints
- Consider adding CORS restrictions

## 🚀 Deployment

### Vercel
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
1. Set up MongoDB Atlas (cloud database)
2. Configure environment variables
3. Deploy as usual

## 📝 Example: Adding a Project via cURL

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-key-here" \
  -d '{
    "title": "E-commerce Platform",
    "description": "Full-stack e-commerce built with Next.js",
    "image": "https://example.com/image.jpg",
    "tags": ["Next.js", "React", "TypeScript"],
    "liveLink": "https://ecommerce.example.com",
    "githubLink": "https://github.com/user/project",
    "featured": true
  }'
```

## 🐛 Troubleshooting

**MongoDB Connection Error**: Ensure MongoDB is running or your Atlas connection string is correct

**Admin Login Not Working**: Verify your `ADMIN_SECRET` matches

**Images Not Loading**: Check image URLs are publicly accessible

**API Returns 401**: Make sure you're sending the correct `ADMIN_SECRET` in the Authorization header

---

Happy building! 🚀
