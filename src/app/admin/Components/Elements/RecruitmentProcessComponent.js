// import React, { useState } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import DropContainer from '../Elements/DropContainer';

// const RecruitmentProcessComponent = ({ processData }) => {
//   const [buttons, setButtons] = useState(processData);

//   const moveButton = (dragIndex, hoverIndex) => {
//     const updatedButtons = [...buttons];
//     const [removed] = updatedButtons.splice(dragIndex, 1);
//     updatedButtons.splice(hoverIndex, 0, removed);
//     setButtons(updatedButtons);
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="adminChangeUsername" style={{ minHeight: '80vh' }}>
//         <div className="bg-white py-3 px-3 my-4 rounded-md">
//           <div className="rightSectionHeading border-b-2 py-2 text-xl">
//             Define Recruitment Process
//             <p className="text-sm mb-2">
//               Please select and define the recruitment process by drag and dropping the button from below mentioned process.
//             </p>
//           </div>
//           {buttons.length > 0 && (
//             <DropContainer buttons={buttons} moveButton={moveButton} />
//           )}
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default RecruitmentProcessComponent;

import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DropContainer from '../Elements/DropContainer';

const RecruitmentProcessComponent = ({ processData, onOrderChange }) => {
  const [buttons, setButtons] = useState(processData);

  const moveButton = (dragIndex, hoverIndex) => {
    const updatedButtons = [...buttons];
    const [removed] = updatedButtons.splice(dragIndex, 1);
    updatedButtons.splice(hoverIndex, 0, removed);
    setButtons(updatedButtons);

    // Get updated order of value IDs after drag-and-drop and send it to the parent
    const orderedIds = updatedButtons.map(button => button.value);
    onOrderChange(orderedIds); // Send to the parent component
  };

  useEffect(() => {
    // Whenever processData changes, reset the buttons state
    setButtons(processData);
  }, [processData]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="adminChangeUsername" style={{ minHeight: '80vh' }}>
        <div className="bg-white py-3 px-3 my-4 rounded-md">
          <div className="rightSectionHeading border-b-2 py-2 text-xl">
            Define Recruitment Process
            <p className="text-sm mb-2">
              Please select and define the recruitment process by drag and dropping the button from below mentioned process.
            </p>
          </div>
          {buttons.length > 0 && (
            <DropContainer buttons={buttons} moveButton={moveButton} />
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default RecruitmentProcessComponent;


