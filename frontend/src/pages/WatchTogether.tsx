import { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const WatchTogether: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
    const roomId = searchParams.get("roomId");
    const userId = searchParams.get("userId");
    console.log(roomId, userId);

    useEffect(() => {
        // if (!roomId || !userId) {
        //     console.error("roomId or userId is missing");
        //     return;
        // }

        const initializeWebSocket = (roomId: string, userId: string) => {
            const ws = new WebSocket(`ws://localhost:8000/api/v1/watch/room/${roomId}/${userId}`);
            setWebSocket(ws);

            ws.onopen = () => {
                console.log("[open] WebSocket connection established");
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                handleIncomingMessage(message);
            };

            ws.onclose = () => {
                console.log("[close] WebSocket connection closed");
            };

            ws.onerror = (error) => {
                console.error("[error] WebSocket error:", error);
            };

            return () => {
                ws.close();
            };
        };
        if (roomId && userId) {
            initializeWebSocket(roomId, userId);
        }
        
    }, [roomId, userId]);

    const handleIncomingMessage = (message: any) => {
        const { event, sdp, candidate, userId: senderId } = message;

        switch (event) {
            case "user-joined":
                console.log(`User joined: ${senderId}`);
                break;
            case "user-disconnected":
                console.log(`User disconnected: ${senderId}`);
                break;
            case "offer":
                console.log("Received offer:", sdp);
                // Handle offer logic (e.g., set remote description and create an answer).
                break;
            case "answer":
                console.log("Received answer:", sdp);
                // Handle answer logic (e.g., set remote description).
                break;
            case "add-ice-candidate":
                console.log("Received ICE candidate:", candidate);
                // Handle ICE candidate logic (e.g., add to peer connection).
                break;
            default:
                console.warn("Unknown event:", event);
        }
    };

    const sendMessage = (message: any) => {
        if (webSocket && webSocket.readyState === WebSocket.OPEN) {
            webSocket.send(JSON.stringify(message));
        } else {
            console.warn("WebSocket is not open. Message not sent.");
        }
    };

    const sendOffer = () => {
        sendMessage({
            event: "offer",
            sdp: "sample-offer-sdp",
            roomId,
        });
    };

    const sendAnswer = () => {
        sendMessage({
            event: "answer",
            sdp: "sample-answer-sdp",
            roomId,
        });
    };

    const sendIceCandidate = () => {
        sendMessage({
            event: "add-ice-candidate",
            candidate: { candidate: "sample-candidate" },
            type: "candidate-type",
            roomId,
        });
    };

    return (
        <div>
            <h1>Watch Together</h1>
            <button onClick={sendOffer}>Send Offer</button>
            <button onClick={sendAnswer}>Send Answer</button>
            <button onClick={sendIceCandidate}>Send ICE Candidate</button>
        </div>
    );
};

export default WatchTogether;
