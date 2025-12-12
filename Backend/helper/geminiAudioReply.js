require("dotenv").config();
const { AccessToken } = require("livekit-server-sdk");
const { Room, RoomEvent, createLocalTracks, Track } = require("livekit-client");
const { GoogleGenAI } = require("@google/genai");
const { Readable } = require("stream");

const LIVEKIT_URL = process.env.VITE_LIVEKIT_URL || "wss://your-livekit-server-url.livekit.cloud";
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ROOM_NAME = "voice-room";
const BOT_IDENTITY = "AI-Gemini-Bot";

const getBotToken = () => {
  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, { identity: BOT_IDENTITY });
  at.addGrant({ roomJoin: true, room: ROOM_NAME, canPublish: true, canSubscribe: true });
  return at.toJwt();
};

const ai = new GoogleGenAI(GEMINI_API_KEY);

async function getGeminiResponse(userText) {
  if (!userText) return "I didn't hear anything. Could you please repeat?";
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: userText }] }]
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am unable to connect to the AI service right now. Please try again.";
  }
}

const publishMockReply = async (room, aiText) => {
  console.log(`<- AI SPEAKING: ${aiText.substring(0, 50)}...`);
  const durationSeconds = 3;
  const silenceBuffer = Buffer.alloc(48000 * durationSeconds * 2, 0);
  const silenceStream = Readable.from(silenceBuffer);

  try {
    const customTrack = await createLocalTracks({ audio: true });
    const localAudioTrack = customTrack.find(t => t.kind === Track.Kind.Audio);
    if (localAudioTrack) {
      await room.localParticipant.publishTrack(localAudioTrack, { name: "ai-audio-track" });
      setTimeout(() => {
        room.localParticipant.unpublishTrack(localAudioTrack);
        localAudioTrack.stop();
        console.log("--- AI FINISHED SPEAKING. ---");
      }, durationSeconds * 1000 + 500);
    }
  } catch (e) {
    console.error("Failed to publish AI audio:", e);
  }
};

async function startAIAgent() {
  const token = getBotToken();
  const room = new Room();

  room.on(RoomEvent.TrackSubscribed, async (remoteTrack, publication, participant) => {
    if (remoteTrack.kind === Track.Kind.Audio && participant.identity !== BOT_IDENTITY) {
      console.log(`[AI Bot] Subscribed to user audio track: ${participant.identity}`);

      await new Promise(resolve => setTimeout(resolve, 2000));
      const userText = "Hello Gemini, what is the best way to integrate real-time AI voice chat?";
      console.log(`> STT MOCK Result: ${userText}`);

      const aiText = await getGeminiResponse(userText);
      await publishMockReply(room, aiText);
    }
  });

  try {
    await room.connect(LIVEKIT_URL, token);
    console.log(`AI Bot joined room: ${ROOM_NAME} and listening for audio...`);
  } catch (error) {
    console.error("AI Bot failed to connect to LiveKit:", error);
  }
}

startAIAgent();
