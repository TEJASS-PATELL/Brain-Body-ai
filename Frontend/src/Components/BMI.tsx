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
  const [bmi, setBmi] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [tip, setTip] = useState<string[]>([]);
  const [tips, setTips] = useState('');

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age);

    if (isNaN(h) || isNaN(w) || isNaN(a)) return;

    const bmiValue = w / ((h / 100) * (h / 100));
    const rounded = Number(bmiValue.toFixed(2));
    setBmi(rounded);

    let idealRange = '';
    if (a >= 18 && a <= 24) idealRange = '19–24';
    else if (a <= 34) idealRange = '20–25';
    else if (a <= 44) idealRange = '21–26';
    else if (a <= 54) idealRange = '22–27';
    else if (a <= 64) idealRange = '23–28';
    else idealRange = '24–29';

    let baseTip: string[] = [];

    if (rounded < 18.5) {
      setMessage('Underweight');
      baseTip = [
        `You are a ${a}-year-old individual with a BMI of ${rounded}, which is classified as underweight. Act as an expert health & fitness coach. Create a detailed plan that includes:`,
        '1. A personalized nutrient-rich diet (high in proteins, healthy fats, whole grains, micronutrients).',
        '2. A weekly strength training + light cardio schedule to build lean muscle.',
        '3. Lifestyle tips for improving energy, focus, and immunity.',
        'Give the plan in a structured format (Diet | Exercise | Lifestyle).',
      ];
    } else if (rounded >= 18.5 && rounded < 24.9) {
      setMessage('Normal weight');
      baseTip = [
        `You are a ${a}-year-old individual with a BMI of ${rounded}, which falls in the healthy range. Act as an expert health & fitness coach. Create a personalized maintenance & performance plan that includes:`,
        '1. A balanced diet plan for sustained energy and focus.',
        '2. A fitness routine mixing strength, cardio, and flexibility to maintain optimal body + brain health.',
        '3. Daily lifestyle habits to improve productivity, sleep, and long-term wellness.',
        'Give the plan in a structured format (Diet | Exercise | Lifestyle).',
      ];
    } else if (rounded >= 25 && rounded < 29.9) {
      setMessage('Overweight');
      baseTip = [
        `You are a ${a}-year-old individual with a BMI of ${rounded}, which is in the overweight range. Act as an expert health & fitness coach. Create a safe and effective weight-loss plan that includes:`,
        '1. A calorie-deficit diet with focus on high-protein meals, vegetables, and reduced processed/sugary foods.',
        '2. A progressive fitness routine combining cardio (HIIT/walking) and strength training.',
        '3. Lifestyle modifications for fat loss, stress control, and sleep improvement.',
        'Give the plan in a structured format (Diet | Exercise | Lifestyle).',
      ];
    } else {
      setMessage('Obese');
      baseTip = [
        `You are a ${a}-year-old individual with a BMI of ${rounded}, which is in the obese range. Act as a highly experienced health & fitness expert. Create a safe, step-by-step fat-loss and health improvement plan that includes:`,
        '1. A sustainable diet strategy focusing on portion control, high protein, low processed food, and hydration.',
        '2. A beginner-friendly fitness plan starting with low-impact exercises, then gradually progressing to strength & cardio.',
        '3. Lifestyle + mindset tips (sleep, stress, motivation) to support long-term transformation.',
        'Give the plan in a structured format (Diet | Exercise | Lifestyle).',
      ];
    }

    setTip(baseTip);
    setTips(` Ideal BMI for your age (${a} years) is ${idealRange}.`);

  };

  const reset = () => {
    setHeight('');
    setWeight('');
    setAge('');
    setBmi(null);
    setMessage('');
    setTip([]);
  };

  if (!show) return null;

  return (
    <div className="bmi-overlay">
      <div className="bmi-popup">
        <button className="close-btnn" onClick={onClose}>
          ×
        </button>

        <div className="bmi-header">
          <h2>BMI Calculator</h2>
          <p className="bmi-definition">
            Body Mass Index (BMI) is a simple calculation using height and weight.
            It helps identify if a person is underweight, normal, overweight, or obese.
          </p>
        </div>

        <div className='input-fields'>
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
        </div>

        <div className="bmi-buttons">
          <button onClick={calculateBMI}>Calculate</button>
          <button onClick={reset}>Reset</button>
        </div>

        {bmi !== null && (
          <div className="bmi-result">
            <p>
              Your BMI is: <strong className={`bmi-status ${message.toLowerCase()}`}>{bmi}</strong>
            </p>
            <p>
              Status: <strong className={`bmi-status ${message.toLowerCase()}`}>{message}</strong>
            </p>
            <p className="bmi-tip">{tips}</p>

            <div className="bmi-prompt">
              Copy this prompt and paste in chatbot-
              {tip.map((point, index) => (
                <p key={index}>{point}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BMIPopup;
