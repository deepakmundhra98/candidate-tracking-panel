import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { styled, keyframes } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import Tooltip from "@mui/material/Tooltip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Cookies from "js-cookie";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import '../../../common.css';

// Animation for tooltip fade-in
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Animation for completed step pulse
const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 128, 0, 0.7);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 10px rgba(0, 128, 0, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 128, 0, 0);
  }
`;

// Animation for connector line drawing
const drawLine = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
    margin: '0 8px',
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    background: 'linear-gradient(90deg, #4caf50, #2196f3)',
    borderRadius: 1,
    animation: `${drawLine} 1s ease-in-out`,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ ownerState }) => ({
  background: ownerState.completedStatus === 1
    ? 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)'
    : 'linear-gradient(135deg, #bdbdbd 0%, #e0e0e0 100%)',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: ownerState.completedStatus === 1
    ? '0 4px 10px rgba(0, 128, 0, 0.4)'
    : '0 4px 10px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  ...(ownerState.completedStatus === 1 && {
    animation: `${pulse} 2s infinite`,
  }),
}));

function ColorlibStepIcon(props) {
  const { completedStatus } = props;
  return (
    <ColorlibStepIconRoot ownerState={{ completedStatus }}>
      <CheckCircleIcon sx={{ fontSize: 30 }} />
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  completedStatus: PropTypes.number,
};

export default function CustomizedSteppers({ stepsData }) {
  console.log(stepsData, "component se");

  // Prepare interview details as an array of key-value pairs
  const getInterviewDetails = (step) => {
    const details = [
      { label: 'Interview Status', value: step.completion_status === 1 ? 'Completed' : 'Scheduled' },
      { label: 'Interview Name', value: step.process_name },
      { label: 'Interview Type', value: step.interview_details.interview_type },
      { label: 'Interview Duration', value: step.interview_details.duration },
      { label: 'Interview Date', value: step.interview_details.interview_date },
      { label: 'Job Name', value: step.interview_details.job_name },
      { label: 'Start Time', value: step.interview_details.start_time },
      { label: 'Interviewer Name', value: step.interview_details.staff_name },
    ];

    // Add completion-specific details if completed
    if (step.completion_status === 1) {
      details.push(
        { label: 'Completion Marked By', value: step.interview_details.completion_staff_name },
        { label: 'Feedback', value: step.interview_details.feedback_and_recommendations }
      );
    }

    return details;
  };

  return (
    <Stack sx={{ width: '100%', background: 'linear-gradient(180deg, #f5f7fa 0%, #e4e7eb 100%)', padding: 4, borderRadius: 2 }} spacing={4}>
      <Stepper alternativeLabel connector={<ColorlibConnector />}>
        {stepsData.length > 0
          ? stepsData.map((step, index) => (
              <Step key={index}>
                <Tooltip
                  title={
                    step.interview_details !== "" ? (
                      <div
                        style={{
                          width: '350px',
                          padding: '12px',
                          fontSize: '12px',
                          whiteSpace: 'normal',
                          background: '#fff',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          animation: `${fadeIn} 0.3s ease-in`,
                        }}
                      >
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gridTemplateRows: 'repeat(4, auto)',
                            gap: '12px',
                            alignItems: 'start',
                            width: '100%',
                          }}
                        >
                          {getInterviewDetails(step).map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: 'bold', color: '#333' }}>{item.label}:</span>
                              <span style={{ whiteSpace: 'normal', wordBreak: 'break-word', color: '#555' }}>
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '250px',
                          textAlign: 'center',
                          color: "grey",
                          padding: '10px',
                          fontSize: '12px',
                          background: '#fff',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          animation: `${fadeIn} 0.3s ease-in`,
                        }}
                      >
                        <b>Interview not yet scheduled</b>
                      </div>
                    )
                  }
                  arrow
                  PopperProps={{
                    modifiers: [
                      {
                        name: 'preventOverflow',
                        options: {
                          boundary: 'window',
                          padding: 4,
                        },
                      },
                    ],
                  }}
                  sx={{
                    maxWidth: 650,
                    '& .MuiTooltip-tooltip': {
                      backgroundColor: 'transparent',
                    },
                    '& .MuiTooltip-arrow': {
                      color: '#fff',
                    },
                  }}
                >
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontWeight: 'bold',
                        color: step.completion_status === 1 ? '#4caf50' : '#757575',
                        fontSize: '14px',
                        transition: 'color 0.3s ease',
                      },
                    }}
                    StepIconComponent={(props) => (
                      <ColorlibStepIcon
                        {...props}
                        completedStatus={step.completion_status}
                      />
                    )}
                  >
                    {step.process_name}
                  </StepLabel>
                </Tooltip>
              </Step>
            ))
          : null}
      </Stepper>
    </Stack>
  );
}