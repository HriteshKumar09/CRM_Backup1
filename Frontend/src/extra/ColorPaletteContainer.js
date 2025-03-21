import React from 'react';

// Color Palette Component
const ColorPalette = ({ onColorSelect }) => {
    const colorArray = [
        "#FFFFFF", "#00B6D1", "#00B89C", "#2E2F3E", "#1A3855",
        "#3C4D61", "#274A59", "#5F8699", "#7F8F8C", "#9B83BB",
        "#C0C3C5", "#C94E3B", "#F58F28"
    ];

    return (
        <div className="grid grid-cols-5 gap-2">
            {colorArray.map((color, index) => (
                <div
                    key={index}
                    className="w-5 h-5 mt-1 ml-2 transform transition-transform duration-200 ease-in-out hover:scale-125 rounded"
                    style={{ backgroundColor: color }}
                    onClick={() => onColorSelect(color)} // Trigger color change on click
                ></div>
            ))}
        </div>
    );
};

export default ColorPalette;