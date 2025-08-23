import React from "react";
import "./Working.css";
import {
  Languages,
  Activity,
  Dumbbell,
  MessageSquare,
  ShieldCheck,
  Search,
  History,
  Timer,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Select Language & Level",
    icon: <Languages className="htu-icon blue" />,
    description:
      "Start by selecting your preferred language and experience level (beginner to advanced). This helps the AI respond in the way that suits you best.",
  },
  {
    title: "Use BMI Calculator + Personalized Plan",
    icon: <Activity className="htu-icon green" />,
    description:
      "Use our built-in BMI calculator to quickly check your body status and receive a fully personalized wellness plan based on your results, goals, and health metrics.",
  },
  {
    title: "Clear & Structured Answers",
    icon: <MessageSquare className="htu-icon orange" />,
    description:
      "No confusion — Body + Brain gives sorted, actionable, and clean answers. Whether it's nutrition, focus, workouts, or habits — you'll get exactly what you need.",
  },
  {
    title: "Google-Enhanced Search",
    icon: <Search className="htu-icon purple" />,
    description:
      "Need to explore more? Use the built-in Google search tool alongside the AI to look up real-time results, articles, or resources — all in one place.",
  },
  {
    title: "Safe, Trusted & Clean",
    icon: <ShieldCheck className="htu-icon red" />,
    description:
      "This chatbot is privacy-safe and gives filtered responses only. No random, misleading, or inappropriate answers — only focused wellness guidance.",
  },
  {
    title: "Daily Tasks & Habits",
    icon: <Dumbbell className="htu-icon" />,
    description:
      "Get personalized daily tasks for mind and body — including workouts, focus drills, nutrition tips, and lifestyle goals. Stay consistent and build strong habits day by day.",
  },
  {
    title: "Focus Timer & Stopwatch",
    icon: <Timer className="htu-icon yellow" />,
    description:
      "Track your workouts or meditation with an in-built stopwatch and timer. Helps you improve focus, maintain consistency, and balance brain + body training.",
  },
  {
    title: "Continue Previous Chats",
    icon: <History className="htu-icon grey" />,
    description:
      "Easily access your entire chat history and revisit any past conversation to continue from where you left off — your AI remembers your context, goals, and preferences for seamless continuation.",
  },
];

const Working: React.FC = () => {
  return (
    <div className="htu-container">
      <div className="htu-inner">
        <h1 className="htu-title">
          Top features of <strong>Brain + Body</strong> AI
        </h1>
        <p className="htu-subtitle">
          Your all-in-one wellness assistant — focused on your mind, body, and habits.
        </p>

        <div className="htu-card-grid">
          {features.map((feature, index) => (
            <div key={index} className="htu-card">
              <div className="htu-card-header">
                {feature.icon}
                <h2> {feature.title}</h2>
              </div>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="htu-final">
          <p className="htu-link-note">
            Go to your <Link to="/chatbot" className="htu-link">AI ChatBot</Link> to begin your wellness journey!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Working;
