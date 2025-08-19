import { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause, FaUpload, FaForward, FaBackward, FaSearch } from "react-icons/fa";
import api from '../api';
import "./RightSidebar.css";

const RightSidebar = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const musicTracks = [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  ];

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [musicSrc, setMusicSrc] = useState<string>(musicTracks[0]);
  const [isCustomTrack, setIsCustomTrack] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dailyTasks, setDailyTasks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/chats/daily-tasks");
        const data = res.data;

        if (Array.isArray(data.tasks)) {
          setDailyTasks(data.tasks);
        } else {
          console.error("Invalid task format", data);
          setDailyTasks([]);
        }
      } catch (err: any) {
        console.error("Failed to fetch daily tasks:", err.response?.data?.msg || err.message);
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
      setIsCustomTrack(true);
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

  const handleNextTrack = () => {
    if (isCustomTrack) return;
    const nextIndex = (currentTrackIndex + 1) % musicTracks.length;
    setCurrentTrackIndex(nextIndex);
    setMusicSrc(musicTracks[nextIndex]);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  const handlePrevTrack = () => {
    if (isCustomTrack) return;
    const prevIndex =
      (currentTrackIndex - 1 + musicTracks.length) % musicTracks.length;
    setCurrentTrackIndex(prevIndex);
    setMusicSrc(musicTracks[prevIndex]);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const query = encodeURIComponent(searchQuery.trim());
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
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
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
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
            <button onClick={handlePrevTrack} title="Previous Song">
              <FaBackward />
            </button>

            <button
              className="circle-play-btn"
              title={isPlaying ? "Pause" : "Play"}
              onClick={toggleMusic}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>

            <button onClick={handleNextTrack} title="Next Song">
              <FaForward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;