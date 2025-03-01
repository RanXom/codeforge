# CodingForge

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Judge0](https://img.shields.io/badge/Judge0-API-blue?style=for-the-badge)](https://judge0.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

## Overview

This project is a **problem-solving coding platform** designed to provide a **distraction-free** environment for competitive programmers. The platform enforces a **restrictive mode** where users must remain in fullscreen until they submit or quit a problem. It also tracks time spent per problem, prevents tab-switching or copy-pasting, and integrates with Judge0 API for code execution.

### **Branch Information**
- **`main`**: Contains the latest stable version of the project.
- **`debug`**: Contains the latest unstable version of the project (work-in-progress features).

> **Sidenote**: This project was built and stored under the **WSL2 Ubuntu subsystem for Windows**. To avoid any unwanted errors, it is recommended to set up WSL2 and clone the repository there.

---

## Features

### **Core Features**
- **Monaco Editor Integration**: Provides a smooth coding experience with syntax highlighting and autofill.
- **Restrictive Environment**: Users must stay in fullscreen mode while solving problems.
- **Copy-Paste & Tab-Switch Prevention**: Ensures fair coding practices.
- **Problem Submission System**: Execute code using an integrated compiler (via Judge0 API).
- **Time Tracking Per Problem**: Measures how long a user spends on a problem.
- **User Authentication**: Users can sign up, log in, and track progress.

### **Future Enhancements**
- **Leaderboard**: Competitive ranking system for users.
- **Problem Difficulty Levels**: Add sorting and filtering by difficulty.
- **Discussion Forums**: Allow users to discuss solutions and approaches.
- **AI-Powered Code Suggestions**: Provide intelligent hints and suggestions.

---

## Technologies Used

### **Frontend**
- **Next.js**: React framework for building the frontend.
- **TypeScript**: Adds type safety and improves developer experience.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Monaco Editor**: Code editor with syntax highlighting and autocomplete.

### **Backend**
- **Node.js + Express.js**: Backend server to handle API routes.
- **Supabase**: Database and authentication provider.
- **Judge0 API**: Code execution engine for running user-submitted code.

### **Deployment**
- **Frontend**: Hosted on [Vercel](https://vercel.com/).
- **Backend**: Hosted on [Railway](https://railway.app/) or [Heroku](https://www.heroku.com/).

---

## Progress So Far

### **Completed Tasks**
1. **Initial Setup**:
   - Initialized Next.js app with TypeScript.
   - Set up project repository and folder structure.
   - Installed necessary dependencies (Monaco Editor, Tailwind CSS, Supabase, etc.).
   - Implemented user authentication with Supabase.

2. **Core Features Implementation**:
   - Designed UI for problem selection (`/problems`) and editor screen (`/problems/[slug]`).
   - Integrated Monaco Editor with syntax highlighting and language selection.
   - Enforced fullscreen mode when solving problems.
   - Prevented copy-paste and tab-switching using event listeners.
   - Tracked time spent per problem and stored it in Supabase.

### **Remaining Tasks**
1. Finalize the submission system:
   - Integrate Judge0 API for code execution.
   - Store submission results in Supabase.
   - Display feedback to users after submission.
2. Set up the backend with Express.js.
3. Deploy the platform to Vercel (frontend) and Railway/Heroku (backend).

---

## How to Set Up the Project Locally

### **Prerequisites**
- Node.js (v16 or higher)
- Docker (for running Judge0 API locally)
- Git
- Supabase account (for database and authentication)
- **WSL2 Ubuntu Subsystem** (Recommended for compatibility)

### **Steps**

#### 1. Clone the Repository
```bash
git clone https://github.com/RanXom/coding-platform.git
cd coding-platform
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Set Up Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_JUDGE0_API_URL=http://localhost:8080
```

#### 4. Run Judge0 API Locally
1. Pull and run the Judge0 Docker image:
   ```bash
   docker run -d -p 8080:2358 judge0/judge0:latest
   ```
2. Verify the API is running:
   ```bash
   curl http://localhost:8080
   ```

#### 5. Start the Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

#### 6. Set Up Supabase
1. Create a Supabase project and configure the database schema.
2. Insert sample problems into the `problems` table.

---

## Folder Structure

```
/project-root
│── src
│   ├── app (Next.js App Router)
│   │   ├── page.tsx (Landing Page)
│   │   ├── problems
│   │    │   ├── [id].tsx (Problem Solving Page)
│   │   ├── auth
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   ├── components
│   │   ├── Editor.tsx (Monaco Editor Component) 
│   │   ├── Navbar.tsx
│   │   ├── Timer.tsx
│   ├── lib
│   │   ├── supabase.ts (Supabase Client)
│   │   ├── api.ts (Backend API Calls)
│── backend
│   ├── server.js (Express Server)
│   ├── routes
│   │   ├── problems.js (Fetch Problems API)
│   │   ├── submissions.js (Handle Submissions)
│── public (Static Assets)
│── .env (Environment Variables)
│── README.md (Project Documentation)
```

---

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Supabase**: For providing a seamless database and authentication solution.
- **Judge0 API**: For enabling code execution.
- **Monaco Editor**: For providing a robust code editor experience.