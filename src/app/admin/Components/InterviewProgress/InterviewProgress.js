import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const MainContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 16px;
`;

const StepContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  margin-top: 70px;
`;

const ProgressLine = styled.div`
  position: absolute;
  background: #4a154b;
  height: 4px;
  width: ${({ width }) => width};
  top: 50%;
  left: 0;
  transition: width 0.4s ease-in-out;
`;

const StepWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const StepStyle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ step }) =>
    step === 'completed' ? '#4A154B' : '#FFFFFF'};
  border: 3px solid ${({ step }) =>
    step === 'completed' ? '#4A154B' : '#F3E7F3'};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

const StepCount = styled.span`
  font-size: 19px;
  color: ${({ step }) => (step === 'completed' ? '#FFFFFF' : '#F3E7F3')};
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const StepsLabelContainer = styled.div`
  position: absolute;
  top: 66px;
  left: 50%;
  transform: translateX(-50%);
`;

const StepLabel = styled.span`
  font-size: 19px;
  color: #4a154b;
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 -15px;
  margin-top: 100px;
`;

const ButtonStyle = styled.button`
  border-radius: 4px;
  border: 0;
  background: #4a154b;
  color: #ffffff;
  cursor: pointer;
  padding: 8px;
  width: 90px;
  transition: background-color 0.3s ease, color 0.3s ease;
  :active {
    transform: scale(0.98);
  }
  :disabled {
    background: #f3e7f3;
    color: #000000;
    cursor: not-allowed;
  }
`;

const tickAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const CheckMark = styled.div`
  font-size: 26px;
  font-weight: 600;
  color: #4a154b;
  transform: scaleX(-1) rotate(-46deg);
  position: absolute;
  opacity: ${({ show }) => (show ? 1 : 0)};
  animation: ${({ show }) => (show ? `${tickAnimation} 0.3s ease forwards` : 'none')};
`;

const steps = [
  {
    label: 'Address',
    step: 1,
  },
  {
    label: 'Shipping',
    step: 2,
  },
  {
    label: 'Payment',
    step: 3,
  },
  {
    label: 'Summary',
    step: 4,
  },
];

const InterviewProgress = () => {
  const [activeStep, setActiveStep] = useState(1);

  const nextStep = () => {
    setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    setActiveStep(activeStep - 1);
  };

  const totalSteps = steps.length;

  // Calculate the width of the progress line based on activeStep
  const width = `${(100 / (totalSteps - 1)) * (activeStep - 1)}%`;

  return (
    <MainContainer>
      <StepContainer>
        {/* Render the progress line */}
        <ProgressLine width={width} />
        {/* Map through steps and render each step */}
        {steps.map(({ step, label }) => (
          <StepWrapper key={step}>
            <StepStyle step={activeStep >= step ? 'completed' : 'incomplete'}>
              {activeStep > step ? (
                <CheckMark show={activeStep === step}>✓</CheckMark>
              ) : (
                <StepCount step={activeStep >= step ? 'completed' : 'incomplete'}>
                  {step}
                </StepCount>
              )}
            </StepStyle>
            <StepsLabelContainer>
              <StepLabel key={step}>{label}</StepLabel>
            </StepsLabelContainer>
          </StepWrapper>
        ))}
      </StepContainer>
      <ButtonsContainer>
        <ButtonStyle onClick={prevStep} disabled={activeStep === 1}>
          Previous
        </ButtonStyle>
        <ButtonStyle onClick={nextStep} disabled={activeStep === totalSteps}>
          Next
        </ButtonStyle>
      </ButtonsContainer>
    </MainContainer>
  );
};

export default InterviewProgress;
