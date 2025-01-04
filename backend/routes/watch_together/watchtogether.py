from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from typing import Dict, List
from dataclasses import dataclass

from socketio import ASGIApp, AsyncServer

router = APIRouter(
    tags=["Watch Together Routes"]
)

sio = AsyncServer(cors_allowed_origins=[], async_mode='asgi')
socket_app = ASGIApp(sio, socketio_path='sockets')


@dataclass
class User:
    socket_id: str
    name: str


@dataclass
class Room:
    user1: User = None
    user2: User = None


class RoomManager:
    def __init__(self):
        self.rooms: Dict[str, Room] = {}
        self.users: List[User] = []

    def create_room(self, room_id: str):
        if room_id in self.rooms:
            raise HTTPException(status_code=400, detail="Room already exists")
        self.rooms[room_id] = Room()

    async def join_room(self, room_id: str, user: User):
        room = self.rooms.get(room_id)
        
        if not room:
            raise HTTPException(status_code=404, detail="Room does not exist")
        # if room.user2 is not None:
        #     raise HTTPException(status_code=400, detail="Room is full")
        # if room.user1 is None:
        #     room.user1 = user
        # else:
            # room.user2 = user
        
        self.users.append(user)
        if len(self.users) < 2:
            return  
        room.user1 = self.users[0]
        room.user2 = self.users[1]

        user1 = room.user1
        user2 = room.user2
        
        await sio.emit('send-offer', {'roomId': room_id}, room=user1.socket_id)
        await sio.emit('send-offer', {'roomId': room_id}, room=user2.socket_id)

    def get_room(self, room_id: str):
        return self.rooms.get(room_id)


room_manager = RoomManager()


class JoinRoom(BaseModel):
    room_id: str
    name: str

async def join_room(sid, data: JoinRoom):
    user = User(socket_id=sid, name=data.name)  
    print(f"socketid - {user.socket_id}")
    await room_manager.join_room(data.room_id, user)

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def join(sid, data):
    await join_room(sid, JoinRoom(room_id=data.get("roomId"), name=data.get("name")))

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")


@sio.event
async def offer(sid, data):
    room_id = data.get("roomId")
    sdp = data.get("sdp")
    room = room_manager.get_room(room_id)
    if not room:
        return

    receiving_user = room.user2 if room.user1.socket_id == sid else room.user1
    await sio.emit("offer", {"sdp": sdp, "roomId": room_id}, room=receiving_user.socket_id)


@sio.event
async def answer(sid, data):
    room_id = data.get("roomId")
    sdp = data.get("sdp")
    room = room_manager.get_room(room_id)
    if not room:
        return

    receiving_user = room.user2 if room.user1.socket_id == sid else room.user1
    await sio.emit("answer", {"sdp": sdp, "roomId": room_id}, room=receiving_user.socket_id)


@sio.event
async def add_ice_candidate(sid, data):
    room_id = data.get("roomId")
    candidate = data.get("candidate")
    candidate_type = data.get("type")
    room = room_manager.get_room(room_id)
    if not room:
        return

    receiving_user = room.user2 if room.user1.socket_id == sid else room.user1
    await sio.emit("add_ice_candidate", {
        "candidate": candidate,
        "type": candidate_type,
        "roomId": room_id
    }, room=receiving_user.socket_id)


class CreateRoom(BaseModel):
    name: str

@router.post("/create_room")
async def create_room(data: CreateRoom):
    from uuid import uuid4
    room_id = str(uuid4())  # Generate unique room ID
    user = User(socket_id=None, name=data.name)  # socket_id will be set on connection
    room_manager.create_room(room_id)
    return JSONResponse(content={"roomId": room_id})





