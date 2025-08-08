import React, { useState } from 'react';
import './BMIPopup.css';

interface BMIPopupProps {
  show: boolean;
  onClose: () => void;
}

const BMIPopup: React.FC<BMIPopupProps> = ({ show, onClose }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [tip, setTip] = useState('');

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w) return;

    const bmiValue = w / ((h / 100) * (h / 100));
    const rounded = Number(bmiValue.toFixed(2));
    setBmi(rounded);

    if (rounded < 18.5) {
      setMessage("Underweight");
      setTip("Eat more healthy calories and do strength exercises ask the AI Chatbot for a personalized plan.");
    } else if (rounded >= 18.5 && rounded < 24.9) {
      setMessage("Normal weight");
      setTip("Maintain your routine! Keep eating balanced and stay active.");
    } else if (rounded >= 25 && rounded < 29.9) {
      setMessage("Overweight");
      setTip("Reduce sugar, walk daily, and increase physical activity ask the AI Chatbot for a personalized plan.");
    } else {
      setMessage("Obese");
      setTip("Try a healthy diet and consult a fitness expert or doctor ask the AI Chatbot for a personalized plan.");
    }
  };

  const reset = () => {
    setHeight('');
    setWeight('');
    setBmi(null);
    setMessage('');
    setTip('');
  };

  if (!show) return null;

  return (
    <div className="bmi-overlay">
      <div className="bmi-popup">
        <button className="close-btnn" onClick={onClose}>×</button>
        <h2>BMI Calculator</h2>
        <input
          type="number"
          placeholder="Height (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <div className="bmi-buttons">
          <button onClick={calculateBMI}>Calculate</button>
          <button onClick={reset}>Reset</button>
        </div>

        {bmi !== null && (
          <div className="bmi-result">
            <p>Your BMI is: <strong>{bmi}</strong></p>
            <p>Status: <strong>{message}</strong></p>
            <p className="bmi-tip">Tip: {tip}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BMIPopup;
