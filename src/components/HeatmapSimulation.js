import React from 'react';

const HeatmapSimulation = ({ complaints }) => {
  // Group complaints by category
  const categoryCounts = complaints.reduce((acc, complaint) => {
    const category = complaint.category;
    if (!acc[category]) {
      acc[category] = { total: 0, resolved: 0 };
    }
    
    acc[category].total += 1;
    if (complaint.status === 'Resolved') {
      acc[category].resolved += 1;
    }
    
    return acc;
  }, {});

  // Convert to array for rendering
  const categories = Object.keys(categoryCounts).map(category => ({
    name: category,
    total: categoryCounts[category].total,
    resolved: categoryCounts[category].resolved,
    open: categoryCounts[category].total - categoryCounts[category].resolved,
    percentage: Math.round((categoryCounts[category].resolved / categoryCounts[category].total) * 100) || 0
  }));

  // Sort by open complaints (highest first)
  categories.sort((a, b) => b.open - a.open);

  return (
    <div className="heatmap-container">
      {categories.length === 0 ? (
        <p>No data available for heatmap.</p>
      ) : (
        categories.map((category, index) => (
          <div className="heatmap-item" key={index}>
            <div className="heatmap-label">
              {category.name} ({category.open} open, {category.resolved} resolved)
            </div>
            <div 
              className="heatmap-bar" 
              style={{ 
                backgroundColor: `rgba(${255 - (category.percentage * 2.55)}, ${category.percentage * 2.55}, 0, 0.7)`,
                width: `${Math.max(category.percentage, 10)}%`
              }}
              title={`${category.percentage}% resolved`}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default HeatmapSimulation;