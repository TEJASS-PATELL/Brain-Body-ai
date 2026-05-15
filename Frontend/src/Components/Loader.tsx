import './Loader.css';

export default function Loader() {
  return (
    <div className="loader-wrapper">
      <div className="loader-mark">
        <div className="loader-ring" />
        <div className="loader-ring loader-ring--2" />
        <span className="loader-wordmark">
          Docu<span>Mind</span><em> AI</em>
        </span>
      </div>
    </div>
  );
}