import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import api from '../api';
import "./RightSidebar.css";
import Timers from "./Timer";

const RightSidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dailyTasks, setDailyTasks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/api/chats/daily-tasks");
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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const query = encodeURIComponent(searchQuery.trim());
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
  };

  return (
    <div className="right-bar">

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
        <Timers />
      </div>
    </div>
  );
};

export default RightSidebar;