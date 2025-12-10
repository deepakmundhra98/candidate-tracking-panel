import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemTypes = {
  BUTTON: 'button',
};

const Button = ({ id, text, index, moveButton }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: ItemTypes.BUTTON,
    hover(item) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveButton(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BUTTON,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '0.5rem 1rem',
        marginBottom: '0.5rem',
        backgroundColor: 'rgb(23 116 30)',
        color: 'white',
        cursor: 'move',
        border: '1px solid rgb(23 116 30)',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span>{text}</span>
      <span style={{ marginLeft: '1rem', fontWeight: 'bold' }}>Process {index + 1}</span>
    </div>
  );
};

export default Button;
