// components/DraggableButton.js
import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableButton = ({ id, text, index, moveButton }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'BUTTON',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <button className='btn btn-primary btn-Recuriment'>{text}</button>
      <p className='text-center'>{index + 1}</p>
    </div>
  );
};

export default DraggableButton;
