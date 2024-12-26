from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from typing import Dict
import uuid

router = APIRouter(
    tags=["Watch Together Routes"]
)

class User:
    def __init__(self, user_id: str, websocket: WebSocket):
        self.user_id = user_id
        self.websocket = websocket

class Room:
    def __init__(self):
        self.users: Dict[str, User] = {}

class RoomManager:
    def __init__(self):
        self.rooms: Dict[str, Room] = {}

    def create_room(self) -> str:
        room_id = str(uuid.uuid4())
        self.rooms[room_id] = Room()
        return room_id

    async def add_user_to_room(self, room_id: str, user: User):
        room = self.rooms.get(room_id)
        if not room:
            raise ValueError("Room not found.")  # Handle this gracefully in the WebSocket handler
        if len(room.users) >= 2:
            raise ValueError("Room is full.")  # Handle this as well in the WebSocket handler
        room.users[user.user_id] = user
        await self.notify_users_in_room(room_id, {"event": "user-joined", "userId": user.user_id})

    def remove_user_from_room(self, room_id: str, user_id: str):
        room = self.rooms.get(room_id)
        if room and user_id in room.users:
            del room.users[user_id]
            if not room.users:
                del self.rooms[room_id]  # Clean up empty room

    async def notify_users_in_room(self, room_id: str, message: dict):
        room = self.rooms.get(room_id)
        if room:
            for user in room.users.values():
                await user.websocket.send_json(message)

    async def handle_offer(self, room_id: str, sdp: str, sender_id: str):
        room = self.rooms.get(room_id)
        if not room:
            return
        for user_id, user in room.users.items():
            if user_id != sender_id:
                await user.websocket.send_json({"event": "offer", "sdp": sdp, "roomId": room_id})

    async def handle_answer(self, room_id: str, sdp: str, sender_id: str):
        room = self.rooms.get(room_id)
        if not room:
            return
        for user_id, user in room.users.items():
            if user_id != sender_id:
                await user.websocket.send_json({"event": "answer", "sdp": sdp, "roomId": room_id})

    async def handle_ice_candidate(self, room_id: str, candidate: dict, candidate_type: str, sender_id: str):
        room = self.rooms.get(room_id)
        if not room:
            return
        for user_id, user in room.users.items():
            if user_id != sender_id:
                await user.websocket.send_json({"event": "add-ice-candidate", "candidate": candidate, "type": candidate_type})

room_manager = RoomManager()

@router.post("/create-room")
async def create_room():
    room_id = room_manager.create_room()
    return JSONResponse(content={"roomId": room_id})

@router.websocket("/room/{room_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, user_id: str):
    await websocket.accept()
    user = User(user_id, websocket)
    try:
        await room_manager.add_user_to_room(room_id, user)
        while True:
            data = await websocket.receive_json()
            event = data.get("event")
            if event == "offer":
                await room_manager.handle_offer(room_id, data["sdp"], user_id)
            elif event == "answer":
                await room_manager.handle_answer(room_id, data["sdp"], user_id)
            elif event == "add-ice-candidate":
                await room_manager.handle_ice_candidate(room_id, data["candidate"], data["type"], user_id)
    except WebSocketDisconnect:
        room_manager.remove_user_from_room(room_id, user_id)
        await room_manager.notify_users_in_room(room_id, {"event": "user-disconnected", "userId": user_id})
