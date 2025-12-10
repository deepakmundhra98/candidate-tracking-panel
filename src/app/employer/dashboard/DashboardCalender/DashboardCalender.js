import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/app/employer/employer.css";

const CustomCalendar = ({ upcomingInterview }) => {
  const [events, setEvents] = useState([]);

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to 00:00:00

  useEffect(() => {
    const upcomingInterviews = upcomingInterview.filter(
      (interview) => {
        const interviewDate = new Date(interview.interview_date_raw);
        interviewDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 in local time
        return interviewDate > today;
      }
    );

    const newEvents = upcomingInterviews.reduce(
      (acc, interview) => {
        const interviewDate = new Date(interview.interview_date_raw);
        interviewDate.setHours(0, 0, 0, 0); // Normalize to start of the day in local time
        const date = interviewDate.toLocaleDateString("en-GB"); // Use locale-specific format

        const event = `
          <div class="event-details">
            <div><strong>Process:</strong></div><div>${interview.process_name}</div>
            <div><strong>Candidate:</strong></div><div>${interview.candidate_name}</div>
            <div><strong>Job:</strong></div><div>${interview.job_name}</div>
            <div><strong>Interviewer:</strong></div><div>${interview.interviewer_name}</div>
            <div><strong>Start Time:</strong></div><div>${interview.start_time}</div>

          </div>
          <div>-------------------------------</div>
        `;

        if (acc[date]) {
          acc[date].push(event);
        } else {
          acc[date] = [event];
        }
        return acc;
      },
      {}
    );

    setEvents(newEvents);
  }, [upcomingInterview]);

  const [hoveredDate, setHoveredDate] = useState(null);

  const handleHover = (date) => {
    const interviewDate = new Date(date);
    interviewDate.setHours(0, 0, 0, 0); // Set time to 00:00:00
    const dateString = interviewDate.toLocaleDateString("en-GB"); // Use locale-specific format
    console.log(dateString, "test");

    setHoveredDate(
      events[dateString]
        ? { date: dateString, events: events[dateString] }
        : null
    );
  };

  const isEventDate = (date) => {
    const dateString = date.toLocaleDateString("en-GB"); // Match the format used in events
    return events.hasOwnProperty(dateString);
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  return (
    <div className="calendar-container">
      <Calendar
        tileClassName={({ date }) => (isEventDate(date) ? "highlight" : "")}
        tileContent={({ date }) =>
          isEventDate(date) && (
            <div
              className="tile-content"
              onMouseEnter={() => handleHover(date)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              <div className="event-dot"></div>
            </div>
          )
        }
      />
      {hoveredDate && (
        <div className="event-modal">
          <h3>Events on {formatDate(hoveredDate.date)}</h3>
          <ul>
            {hoveredDate.events.map((event, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: event }} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;
