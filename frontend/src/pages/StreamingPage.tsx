import { useRef, useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import WatchTogether from "./WatchTogether";
import api from "@/api";
import { RootState } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Copy } from "lucide-react";

const StreamingPage: React.FC = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const movieId = searchParams.get("movieId");
  const location = useLocation();

  const [name, setName] = useState("");
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
  const [localVideoTrack, setlocalVideoTrack] = useState<MediaStreamTrack | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [joined, setJoined] = useState(false);

  const [userId, setUserId] = useState<string | null>("");
  const navigate = useNavigate();

  const shareableUrl = `${window.location.origin}${location.pathname}?roomId=${roomId}&movieId=${movieId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      toast({
        title: "Link Copied!",
        description: "Stream URL has been copied to clipboard",
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    api.get("/auth/me")
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
    const audioTrack = stream.getAudioTracks()[0];
    const videoTrack = stream.getVideoTracks()[0];
    setLocalAudioTrack(audioTrack);
    setlocalVideoTrack(videoTrack);
    if (!videoRef.current) {
      return;
    }
    videoRef.current.srcObject = new MediaStream([videoTrack]);
    videoRef.current.play();
  };

  useEffect(() => {
    if (videoRef && videoRef.current) {
      getCam();
    }
  }, [videoRef]);

  const handleJoinRoom = () => {
    setJoined(true);
    toast({
      title: "Share this stream",
      description: (
        <div className="flex items-center gap-2">
          <span className="truncate max-w-[200px]">{shareableUrl}</span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      ),
      duration: 5000,
    });
  };

  if (!joined) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">
                Join Room
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 shadow-inner">
                <video
                  autoPlay
                  ref={videoRef}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter your display name"
                  className="w-full text-lg h-12"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                
                <Button 
                  className="w-full h-12 text-lg font-medium"
                  onClick={handleJoinRoom}
                >
                  Join Room
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Toaster />
      </>
    );
  }

  return (
    <>
      <WatchTogether
        name={name}
        localAudioTrack={localAudioTrack}
        localVideoTrack={localVideoTrack}
        roomId={roomId}
        userId={userId}
      />
      <Toaster />
    </>
  );
};

export default StreamingPage;