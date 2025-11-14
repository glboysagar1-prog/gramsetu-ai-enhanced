import React from 'react';

const InteractiveControls = ({ onFilterChange, onViewChange }) => {
  return (
    <div className="interactive-controls">
      <div className="control-section">
        <h3>View Controls</h3>
        <div className="button-group">
          <button onClick={() => onViewChange('map')}>Map View</button>
          <button onClick={() => onViewChange('chart')}>Chart View</button>
          <button onClick={() => onViewChange('globe')}>Globe View</button>
        </div>
      </div>
      
      <div className="control-section">
        <h3>Filter By Category</h3>
        <div className="filter-options">
          <label>
            <input 
              type="checkbox" 
              onChange={(e) => onFilterChange('infrastructure', e.target.checked)} 
              defaultChecked 
            />
            Infrastructure
          </label>
          <label>
            <input 
              type="checkbox" 
              onChange={(e) => onFilterChange('water', e.target.checked)} 
              defaultChecked 
            />
            Water
          </label>
          <label>
            <input 
              type="checkbox" 
              onChange={(e) => onFilterChange('electricity', e.target.checked)} 
              defaultChecked 
            />
            Electricity
          </label>
          <label>
            <input 
              type="checkbox" 
              onChange={(e) => onFilterChange('sanitation', e.target.checked)} 
              defaultChecked 
            />
            Sanitation
          </label>
          <label>
            <input 
              type="checkbox" 
              onChange={(e) => onFilterChange('roads', e.target.checked)} 
              defaultChecked 
            />
            Roads
          </label>
        </div>
      </div>
      
      <div className="control-section">
        <h3>Animation Speed</h3>
        <input 
          type="range" 
          min="0" 
          max="100" 
          defaultValue="50" 
          className="slider" 
          onChange={(e) => onFilterChange('animationSpeed', e.target.value)} 
        />
      </div>
      
      <style jsx="true">{`
        .interactive-controls {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
        
        .control-section {
          margin-bottom: 20px;
        }
        
        .control-section h3 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 16px;
          color: #333;
        }
        
        .button-group {
          display: flex;
          gap: 10px;
        }
        
        .button-group button {
          background: #f0f0f0;
          border: none;
          padding: 8px 15px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .button-group button:hover {
          background: #e0e0e0;
        }
        
        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .filter-options label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        
        .slider {
          width: 100%;
          height: 5px;
          border-radius: 5px;
          background: #d3d3d3;
          outline: none;
          -webkit-appearance: none;
        }
        
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #4CAF50;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default InteractiveControls;