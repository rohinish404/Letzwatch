import { useRef, useState } from "react";
import { useEffect } from "react";
import WatchTogether from "./WatchTogether";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import api from "@/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const StreamingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const location = useLocation();
  // const userId = searchParams.get("userId");

  const [name, setName] = useState("");
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [localAudioTrack, setLocalAudioTrack] =
    useState<MediaStreamTrack | null>(null);
  const [localVideoTrack, setlocalVideoTrack] =
    useState<MediaStreamTrack | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [joined, setJoined] = useState(false);

  const [userId, setUserId] = useState<string | null>("");
  const navigate = useNavigate();

  console.log(isLoggedIn);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((userResponse) => {
        setUserId(userResponse.data.user_id);
      })
      .catch((error) => {
        console.error("Failed to fetch user ID:", error);
        const currentPath = `${location.pathname}${location.search}`;
        navigate(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
      });
  }, [isLoggedIn, navigate, location]);

  const getCam = async () => {
    const stream = await window.navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    // MediaStream
    const audioTrack = stream.getAudioTracks()[0];
    const videoTrack = stream.getVideoTracks()[0];
    setLocalAudioTrack(audioTrack);
    setlocalVideoTrack(videoTrack);
    if (!videoRef.current) {
      return;
    }
    videoRef.current.srcObject = new MediaStream([videoTrack]);
    videoRef.current.play();
    // MediaStream
  };

  useEffect(() => {
    if (videoRef && videoRef.current) {
      getCam();
    }
  }, [videoRef]);

  if (!joined) {
    return (
      <div>
        <video autoPlay ref={videoRef}></video>
        <input
          type="text"
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></input>
        <button
          onClick={() => {
            setJoined(true);
          }}
        >
          Join
        </button>
      </div>
    );
  }

  return (
    <WatchTogether
      name={name}
      localAudioTrack={localAudioTrack}
      localVideoTrack={localVideoTrack}
      roomId={roomId}
      userId={userId}
    />
  );
};

export default StreamingPage;
