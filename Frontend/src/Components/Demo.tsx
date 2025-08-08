import React from "react";
import "./Demo.css";
import DemoChat from "./DemoChat";
import Footer from "./Footer";

const Demo: React.FC = () => {
  return (
    <>
      <div className="laptop-container">
        <div className="laptop">
          <div className="screen" role="region" aria-label="Laptop screen">
            <div className="screen-content">
                <DemoChat />
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Demo;
