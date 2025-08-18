import React, { useState } from 'react';
import './BMIPopup.css';

interface BMIPopupProps {
  show: boolean;
  onClose: () => void;
}

const BMIPopup: React.FC<BMIPopupProps> = ({ show, onClose }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const[prompt, SetPrompt] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [tip, setTip] = useState('');
  const [tips, setTips] = useState('');

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age);

    if (isNaN(h) || isNaN(w) || isNaN(a)) return;

    const bmiValue = w / ((h / 100) * (h / 100));
    const rounded = Number(bmiValue.toFixed(2));
    setBmi(rounded);

    let idealRange = "";
    if (a >= 18 && a <= 24) idealRange = "19–24";
    else if (a <= 34) idealRange = "20–25";
    else if (a <= 44) idealRange = "21–26";
    else if (a <= 54) idealRange = "22–27";
    else if (a <= 64) idealRange = "23–28";
    else idealRange = "24–29";

    let baseTip = "";
    if (rounded < 18.5) {
      setMessage("Underweight");
      baseTip = `For a ${a}-year-old, your BMI is ${rounded} (${message}). You are underweight. Focus on a nutrient-rich diet including proteins, healthy fats, and whole grains. Consider strength training to build muscle.`;
    } else if (rounded >= 18.5 && rounded < 24.9) {
      setMessage("Normal weight");
      baseTip = `For a ${a}-year-old, your BMI is ${rounded} (${message}). You have a healthy weight. Maintain it by eating balanced meals, staying active, and keeping a consistent fitness routine.`;
    } else if (rounded >= 25 && rounded < 29.9) {
      setMessage("Overweight");
      baseTip = `For a ${a}-year-old, your BMI is ${rounded} (${message}). You are slightly overweight. Reduce sugary and processed foods, include more vegetables and lean proteins, and exercise regularly.`;
    } else {
      setMessage("Obese");
      baseTip = `For a ${a}-year-old, your BMI is ${rounded} (${message}). You are in the obese range. Focus on a healthy diet, regular physical activity, and consider consulting a healthcare or fitness professional. `;
    }
    setTip(`${baseTip}`);
    setTips(` Ideal BMI for your age (${a} years) is ${idealRange}.`);
    SetPrompt(`Copy the prompt and paste in the AI Chatbot for personalized guidance or a plan.`)
  };

  const reset = () => {
    setHeight('');
    setWeight('');
    setAge('');
    setBmi(null);
    setMessage('');
    setTip('');
  };

  if (!show) return null;

  return (
    <div className="bmi-overlay">
      <div className="bmi-popup">
        <button className="close-btnn" onClick={onClose}>×</button>

        <div className="bmi-header">
          <h2>BMI Calculator</h2>
          <p className="bmi-definition">
            BMI is a measure of body fat based on height and weight that applies to adult men and women.
          </p>
        </div>

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
        <input
          type="number"
          placeholder="Age (years)"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <div className="bmi-buttons">
          <button onClick={calculateBMI}>Calculate</button>
          <button onClick={reset}>Reset</button>
        </div>

        {bmi !== null && (
          <div className="bmi-result">
            <p>Your BMI is: <strong>{bmi}</strong></p>
            <p>Status: <strong className={`bmi-status ${message.toLowerCase()}`}>{message}</strong></p>
            <p className="bmi-tip">{tips}</p>
            <p className="bmi-tips">{prompt}</p>
            <p className="bmi-tips">{tip}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default BMIPopup;
