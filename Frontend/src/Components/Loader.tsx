import { OrbitProgress } from 'react-loading-indicators';
import './Loader.css';

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <OrbitProgress variant="dotted" color="black" size="large" />
        <p className="loader-text">Loading your experience...</p>
      </div>
    </div>
  );
}
