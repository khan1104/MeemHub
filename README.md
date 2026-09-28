# 🚀 MeemHub

**MeemHub** is a social media application specially designed for sharing and discovering memes. Users can explore different memes, share them with friends and family, and interact with content by liking, disliking, saving, and commenting on posts. Users can also follow other people, connect with friends, and discover new content based on their interests

🌐 **Live Demo:** https://meemhub.in

---

## ✨ Features

### 🔐 Authentication & Authorization

* Email/password authentication
* OTP-based email verification
* Google OAuth
* JWT-based authentication

  * Short-lived access tokens
  * Long-lived refresh tokens
* Guest login

### 👤 User & Social Features

* User profiles
* Follow / unfollow users
* Friend requests
* Accept / reject friend requests
* Cancel sent requests
* Followers and following
* Friends list
* Recently added friends
* Mutual friends
* Saved and liked posts
* Guest users can browse content but cannot perform authenticated actions

### 🖼️ Posts & Media

Users can create posts containing:

* Images
* Videos
* Captions
* Tags

Supported interactions:

* ❤️ Like
* 👎 Dislike
* 💾 Save
* 💬 Comment
* 🚩 Report

Media uploads include validation for:

* Memory safe File size check
* File extension
* MIME type
* Magic bytes
* Image/video type

Current upload limits:

* Images: **5 MB**
* Videos: **50 MB**

### 📜 Feed

The feed supports:

* Latest posts
* Top posts
* Trending posts
* Oldest posts
* Tag-based filtering
* Infinite scrolling
* Cursor-based pagination

Cursor-based pagination is used instead of traditional page/offset pagination to provide more efficient pagination for continuously growing feeds.

### ⚡ Performance & Security

* Redis-based OTP storage
* Redis-based rate limiting
* SlowAPI rate limiting
* User-based rate-limit keys when authenticated
* IP-based rate limiting for unauthenticated requests
* MongoDB aggregation pipelines
* Cursor-based pagination
* Backend media validation
* JWT access/refresh token architecture
* HttpOnly refresh token cookie

---

# 🏗️ Architecture

MeemHub follows a layered backend architecture to keep business logic separate from API routes and infrastructure concerns.

<img width="1711" height="736" alt="Screenshot 2026-09-28 160504" src="https://github.com/user-attachments/assets/7b39b3cc-ef7b-436a-af80-df53b187e77a" />


---

# 🛠️ Tech Stack

## Frontend

* **Next.js**
* **TypeScript**
* **Zod**
* Context API
* Custom API/service layer
* Custom hooks

## Backend

* **Python**
* **FastAPI**
* JWT
* OAuth
* SlowAPI

## Database & Storage

* **MongoDB Atlas**
* **Supabase Storage**
* Redis

## DevOps & Deployment

* Docker
* Nginx
* AWS EC2
* Vercel

---

# 👤 Guest User

MeemHub supports guest users so visitors can explore the platform without creating an account.

Guest users can:

* Browse the feed
* View posts
* View profiles

Guest users cannot:

* Like posts
* Dislike posts
* Comment
* Save posts
* Follow users
* Send friend requests
* Perform other authenticated actions

When a guest attempts a protected action, the frontend displays a login-required prompt.

---

# 🔔 Social Relationships

MeemHub separates different types of relationships.

### Following

One-way relationship:

```text
User A → follows → User B
```

### Friendship

Two-way relationship:

```text
User A ↔ User B
```

### Friend Request

```text
User A → pending request → User B
```

A request can be:

* Pending
* Accepted
* Rejected
* Cancelled by the sender  
---

# 🚀 Local Development

## Prerequisites without docker

Make sure you have:

* Python 3.11+
* Node.js
* npm
* MongoDB
* Redis (avilable on wsl)

---

## Clone the Repository

```bash
git clone https://github.com/khan1104/meemhub.git

cd meemhub
```

---

# ⚙️ Backend Setup

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Activate it on Linux/macOS:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create your environment file:

```text
.env
```

Example configuration:

```env
MONGO_URI=mongodb://localhost:27017/
REDIS_HOST_URL=redis://localhost:6379/0
DATABASE_NAME=
JWT_SECRET_KEY=
JWT_REFRESH_KEY=
ALGORITHM=
BREVO_API_KEY=
SUPABASE_URL=
SUPABASE_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_SECRET_KEY=
POSTS_BUCKET=users_posts
PROFILE_PICS_BUCKET=profile_pics
```

Run the API:

```bash
uvicorn app.main:app --reload
```

Backend will be available at:

```text
http://localhost:8000
```

Swagger documentation:

```text
http://localhost:8000/docs
```

---

# 🎨 Frontend Setup

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env
```

Configure the backend API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

Frontend will be available at:

```text
http://localhost:3000
```
---

# 🛡️ Security Considerations

MeemHub implements several security-oriented practices:

* JWT authentication
* Short-lived access tokens
* HttpOnly refresh-token cookies
* OAuth authentication
* Backend-side file validation
* Magic-byte validation
* API rate limiting
* Redis-backed rate limiting
* Protected API routes
* Environment-based secrets
* Soft deletion of accounts
* Input validation using Pydantic/Zod

---

# 📈 Future Improvements

Planned improvements include:

* [ ] Real-time notifications
* [ ] Real-time messaging
* [ ] WebSocket-based updates
* [ ] Improved caching strategy
* [ ] Background task processing
* [ ] Better media processing pipeline
* [ ] Automated testing / increased test coverage
* [ ] CI/CD pipeline
* [ ] Monitoring and observability
* [ ] Improved recommendation/feed ranking
* [ ] Account deletion cleanup jobs

---

# 🎯 What I Learned

Building MeemHub helped me gain practical experience with:

* Designing REST APIs with FastAPI
* Layered backend architecture
* JWT authentication
* OAuth
* OTP authentication
* Redis
* MongoDB aggregation
* Cursor-based pagination
* API rate limiting
* Secure file uploads
* Docker and Docker Compose
* Nginx reverse proxy
* HTTPS and SSL certificates
* AWS EC2 deployment
* Supabase Storage
* Next.js App Router
* Frontend state management
* Production debugging and deployment

The main goal of MeemHub was not just to build a meme-sharing application, but to understand how a **full-stack application can be designed, secured, containerized, and deployed as a production-oriented system.**

---

# 👨‍💻 Author

**Khan Irfan**

B.Sc. Computer Science

Backend-focused developer interested in:

* Python
* FastAPI
* Node.js
* REST APIs
* MongoDB
* Redis
* Docker
* AWS
* AI-powered applications

### Links

* 🌐 Portfolio: `https://portfolio-ten-theta-76.vercel.app`
* 💻 GitHub: `https://github.com/khan1104`

---

## ⭐ If you found this project useful

Feel free to explore the project, provide feedback, or use it as inspiration for your own full-stack application.
