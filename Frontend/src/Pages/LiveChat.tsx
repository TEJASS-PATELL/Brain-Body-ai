import React, { useState, useRef, useEffect } from "react";
import { Room, RoomEvent, createLocalTracks, Track } from "livekit-client";
import toast from "react-hot-toast";
import "./LiveChat.css";

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;

const LiveChat: React.FC = () => {
  const [isJoined, setIsJoined] = useState(false);
  const roomRef = useRef<Room | null>(null);

  const joinRoom = async () => {
    const res = await fetch("/api/livekit/token", { method: "POST" });
    if (!res.ok) return toast.error("Token fetch error");

    const { token } = await res.json();

    const room = new Room();
    roomRef.current = room;

    room.on(RoomEvent.TrackSubscribed, (track) => {
      if (track.kind === Track.Kind.Audio) {
        const audio = track.attach();
        document.body.appendChild(audio);
      }
    });

    room.on(RoomEvent.Disconnected, () => {
      setIsJoined(false);
      document.querySelectorAll("audio").forEach((a) => a.remove());
    });

    try {
      await room.connect(LIVEKIT_URL, token, { autoSubscribe: true });

      const tracks = await createLocalTracks({ audio: true });
      const mic = tracks.find((t) => t.kind === Track.Kind.Audio);

      if (mic) await room.localParticipant.publishTrack(mic);

      setIsJoined(true);
      toast.success("Connected");
    } catch {
      toast.error("Connection error");
      room.disconnect();
    }
  };

  const stopLiveChat = () => {
    if (!roomRef.current) return;
    roomRef.current.disconnect();
    roomRef.current = null;
    setIsJoined(false);
    document.querySelectorAll("audio").forEach((a) => a.remove());
    toast.success("Disconnected");
  };

  useEffect(() => {
    return () => stopLiveChat();
  }, []);

  return (
    <div className="container">
      <div className="micSection">
        <img src="/brain.png" className="brainImg" />

        <div className="btnRow">
          <button onClick={joinRoom} disabled={isJoined} className="startBtn">
            Start
          </button>

          <button onClick={stopLiveChat} disabled={!isJoined} className="stopBtn">
            Stop
          </button>

          <button className="backBtn" onClick={() => window.history.back()}>
            Back
          </button>
        </div>

        <p className="text">
          {isJoined ? "Listening..." : "Tap Start to talk with AI"}
        </p>
      </div>
    </div>
  );
};

export default LiveChat;
