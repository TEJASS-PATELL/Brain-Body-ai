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
        `I am a ${a}-year-old individual with a BMI of ${rounded}, which is classified as underweight. Act as an elite health, nutrition, and fitness coach. Create a world-class optimization plan that includes:`,
        '1. A nutrient-dense, high-calorie meal plan (rich in proteins, healthy fats, complex carbs, and essential micronutrients) to promote healthy weight gain.',
        '2. A progressive weekly workout schedule focused on strength training (muscle building) combined with light cardio for stamina and heart health.',
        '3. Lifestyle recommendations to enhance energy, focus, mood stability, and immune resilience.',
        'Format the response under clear sections: **Diet | Exercise | Lifestyle**.',
      ];
    } else if (rounded >= 18.5 && rounded < 24.9) {
      setMessage('Normal weight');
      baseTip = [
        `I am a ${a}-year-old individual with a BMI of ${rounded}, which falls within the healthy range. Act as a top-tier performance and wellness coach. Design a premium maintenance & optimization plan that includes:`,
        '1. A balanced and performance-driven diet plan to sustain energy, focus, and long-term vitality.',
        '2. A fitness program blending strength, cardio, mobility, and flexibility for holistic body-brain health.',
        '3. Daily lifestyle practices for productivity, quality sleep, mental clarity, and long-term wellness.',
        'Format the response under clear sections: **Diet | Exercise | Lifestyle**.',
      ];
    } else if (rounded >= 25 && rounded < 29.9) {
      setMessage('Overweight');
      baseTip = [
        `I am a ${a}-year-old individual with a BMI of ${rounded}, which falls in the overweight category. Act as a world-class health strategist and fitness expert. Create a safe, highly effective fat-loss plan that includes:`,
        '1. A calorie-controlled, protein-rich nutrition plan emphasizing vegetables, whole foods, and minimal processed sugars.',
        '2. A progressive exercise routine that combines fat-burning cardio (HIIT, brisk walking) with strength training to preserve muscle mass.',
        '3. Lifestyle shifts that optimize metabolism, regulate stress, and improve sleep quality.',
        'Format the response under clear sections: **Diet | Exercise | Lifestyle**.',
      ];
    } else {
      setMessage('Obese');
      baseTip = [
        `I am a ${a}-year-old individual with a BMI of ${rounded}, which falls in the obese category. Act as a highly experienced transformation coach. Build a safe, step-by-step long-term fat-loss and health improvement blueprint that includes:`,
        '1. A sustainable nutrition framework based on portion control, protein prioritization, whole foods, hydration, and reduced processed foods.',
        '2. A beginner-friendly fitness plan starting with low-impact movements, gradually advancing to structured strength and cardio training.',
        '3. Lifestyle and mindset mastery tips covering sleep hygiene, stress reduction, motivation, and habit formation.',
        'Format the response under clear sections: **Diet | Exercise | Lifestyle**.',
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
        <button className="close-btnn" onClick={onClose}> × </button>

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
