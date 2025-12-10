import { useEffect, useState } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import "@/app/offer-letter/offer-letter.css";

const CountdownBox = ({ expiryValue }) => {
  const [timeLeft, setTimeLeft] = useState(expiryValue*60);
  console.log(expiryValue,"ye");
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="countdown-box">
      <AccessTimeIcon className="clock-icon" />
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};

export default CountdownBox;
