import React from 'react';
import Button from './Button';

const DropContainer = ({ buttons, moveButton }) => {
  return (
    <div>
      {buttons.map((button, index) => (
        <Button
          key={button.id}
          id={button.value}
          text={button.label}
          index={index}
          moveButton={moveButton}
        />
      ))}
    </div>
  );
};

export default DropContainer;
