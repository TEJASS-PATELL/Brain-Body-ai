import { useRef, useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaUpload,
  FaForward,
  FaBackward,
  FaSearch,
} from "react-icons/fa";
import "./RightSidebar.css";

const RightSidebar = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const musicTracks = [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  ];

  const [musicSrc, setMusicSrc] = useState<string>(musicTracks[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dailyTasks, setDailyTasks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/chats/daily-tasks");
        const data = await res.json();

        if (Array.isArray(data.tasks)) {
          setDailyTasks(data.tasks);
        } else {
          console.error("Invalid task format", data);
          setDailyTasks([]);
        }
      } catch (err) {
        console.error("Failed to fetch daily tasks", err);
        setDailyTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      console.error("Audio play/pause error:", err);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setMusicSrc(objectUrl);
      setIsPlaying(true);

      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch((err) =>
              console.error("Failed to play uploaded audio:", err)
            );
        }
      }, 100);
    }
  };

  const handleSeek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  return (
    <div className="right-bar">
      <div className="bar">
        <h3 className="bar-title">Upload Your Music</h3>
        <label className="upload-btn top-upload" title="Upload Your Song">
          <FaUpload style={{ marginRight: "6px" }} />
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <div className="info-box">
        <div className="info-header">
          <h4 className="info-title">
            Daily <strong>Body + Brain</strong> Tasks
          </h4>
        </div>

        <ul className="task-list">
          {loading ? (
            <li className="loading">Loading tasks...</li>
          ) : dailyTasks.length ? (
            dailyTasks.map((task, index) => (
              <li key={index} className="task-item">
                {task.split("\n").map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </li>
            ))
          ) : (
            <li className="loading">No tasks found. Please try again later.</li>
          )}
        </ul>

        <p className="info-subtext">Come back tomorrow for fresh tasks!</p>
      </div>

      <div className="google-search">
        <input
          type="text"
          placeholder="Search on Google..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button
          onClick={() => {
            if (searchQuery.trim()) {
              const query = encodeURIComponent(searchQuery.trim());
              window.open(`https://www.google.com/search?q=${query}`, "_blank");
            }
          }}
          className="search-btn"
          title="Search"
        >
          <FaSearch />
        </button>
      </div>

      <div className="card-stack">
        <div className="music-player">
          <audio ref={audioRef} src={musicSrc} loop preload="auto" />
          <div className="music-controls">
            <button onClick={() => handleSeek(-10)} title="Back 10 seconds">
              <FaBackward />
            </button>

            <button
              className="circle-play-btn"
              title={isPlaying ? "Pause" : "Play"}
              onClick={toggleMusic}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>

            <button onClick={() => handleSeek(10)} title="Forward 10 seconds">
              <FaForward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
