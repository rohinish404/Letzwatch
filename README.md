# LetzWatch - Movie Streaming app

A concept app which lets users watch movies on a video call.

## Demo


## Tech and Libraries/Frameworks Used 

- FastAPI
- React
- Typescript
- Python
- WebRTC
- Websockets (socket io)
- Shadcn UI
- PostgreSQL
- SQLAlchemy
- React Query


## Run Locally

Clone the project.

```bash
  git clone https://github.com/rohinish404/Letzwatch
```
### Backend server

Go to the backend directory.

```bash
  cd backend
```

Create env with below variables.

```bash
    DATABASE_URL=

    JWT_SECRET_KEY=
    JWT_REFRESH_SECRET_KEY=

    TMBD_API_URL=

    SECRET_KEY=
    ALGORITHM=
    ACCESS_TOKEN_EXPIRE_MINUTES=
```

Create a venv and install Requirements.txt file.

```bash
    python3 -m venv venv
    source venv/bin/activate
    pip3 install requirements.txt
```

Run alembic migrations.

```bash
    alembic upgrade head
```

Start the server.

```bash
  uvicorn main:app --reload
```
*Note* - Make sure to start psql server and create a database.


### Frontend Client

Go to the frontend directory.

```bash
  cd frontend
```

Install dependencies and run.

```bash
  pnpm i 
  pnpm run dev
```

### Local ports

Frontend - http://localhost:5173/
Backend - http://localhost:8000/docs


## Features that can be improved/implemented

[] Pagination and other sections such as trending, upcoming, etc.
[] Real-time Recommendation system for *For You* / *Discover* section.
[] More robust video call logic. Current implementation of webrtc is mostly referenced from [this](https://github.com/hkirat/omegle)
[] Actuall controls for movies between users on video call. (currently not possible because vidsrc provides with its own player).
[] Chat feature while video calling.








