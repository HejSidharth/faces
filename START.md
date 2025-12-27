# Starting the Application

## Two Servers Needed

You need **TWO terminals** running:

### Terminal 1: Flask API (Backend) - Port 5001

```bash
cd /Users/sidharthhejamadi/Faces/api
source ../venv/bin/activate
API_PORT=5001 python server.py
```

✅ Backend runs on: **http://localhost:5001**

### Terminal 2: Next.js App (Frontend) - Port 3000

```bash
cd /Users/sidharthhejamadi/Faces/web
npm run dev
```

✅ Frontend runs on: **http://localhost:3000**

## Quick Check

- **Backend API**: http://localhost:5001/api/stats (should return JSON)
- **Frontend**: http://localhost:3000 (should show the web interface)

## Troubleshooting

### Port 5000 Already in Use
- This is the **backend** (Flask API), not the frontend
- Use port 5001 instead: `API_PORT=5001 python server.py`
- Frontend (Next.js) always runs on port 3000

### Frontend Can't Connect to Backend
- Make sure Flask API is running on port 5001
- Check `.env.local` in `web/` directory has: `API_URL=http://localhost:5001`
- Or the default in code is already set to 5001

### Both Running?
- Backend: Check http://localhost:5001/api/stats
- Frontend: Check http://localhost:3000
