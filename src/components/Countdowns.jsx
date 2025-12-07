import { useEffect, useState } from "react";
import './Countdowns.css';

export default function Countdowns({ events }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  function formatCountdown(target) {
    const diff = target - now;
    if (diff <= 0) return "Now";

    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  return (
    <div className="countdowns">
      <h2>Upcoming Classes</h2>

      {events.length === 0 && <p>No classes uploaded yet.</p>}

      {events.map((event, i) => {
        if (!event.start) return null;

        let start = new Date(event.start);

        if (isNaN(start.getTime())) return null;

        return (
          <div key={i} className="countdown-item">
            <strong>{event.name}</strong>
            <div>Starts: {start.toLocaleString()}</div>
            <div>Countdown: {formatCountdown(start)}</div>
          </div>
        );
      })}
    </div>
  );
}