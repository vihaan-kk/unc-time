import { useRef, useState } from "react";
import * as pdfjsLib from 'pdfjs-dist';
import './Upload.css';

import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function Upload({ onScheduleParsed }) {
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }

      console.log("Extracted PDF Text:", fullText); // For debugging
      const events = parseSchedulePDF(fullText);
      
      if (events.length === 0) {
        setError("No classes found. Please check the PDF format.");
      } else {
        onScheduleParsed(events);
      }
    } catch (err) {
      console.error("Error parsing PDF:", err);
      setError("Failed to parse PDF. Make sure it is a valid file.");
    } finally {
      setLoading(false);
    }
  }

  function parseSchedulePDF(text) {
    const events = [];
    
    // Regex to find class patterns based on ConnectCarolina PDF format
    // Format: SUBJECT NUM ... Days : DAYS Start : TIME End : TIME
    // Example: MATH 347 ... Days : MoWeFr Start : 2:30 pm End : 3:20 pm
    const classRegex = /([A-Z]{4})\s+(\d{3,4}).*?Days\s*:\s*([A-Za-z]+).*?Start\s*:\s*(\d{1,2}:\d{2}\s*[ap]m).*?End\s*:\s*(\d{1,2}:\d{2}\s*[ap]m)/gi;
    
    let match;
    while ((match = classRegex.exec(text)) !== null) {
      const subject = match[1];
      const number = match[2];
      const daysStr = match[3];
      const startTimeStr = match[4];
      const endTimeStr = match[5];
      
      const name = `${subject} ${number}`;
      
      // Calculate the next occurrence of this class
      const nextOccurrence = getNextOccurrence(daysStr, startTimeStr);
      
      if (nextOccurrence) {
        events.push({
          name: name,
          days: daysStr,
          startTime: startTimeStr,
          endTime: endTimeStr,
          start: nextOccurrence.toISOString(),
          originalTime: `${daysStr} ${startTimeStr} - ${endTimeStr}`
        });
      }
    }

    return events;
  }

  function getNextOccurrence(daysStr, timeStr) {
    if (!daysStr) return null;
    
    const now = new Date();
    const dayMap = {
      'Mo': 1, 'Tu': 2, 'We': 3, 'Th': 4, 'Fr': 5, 'Sa': 6, 'Su': 0
    };
    
    // Parse time
    const [time, modifier] = timeStr.split(/(?=[AP]M)/i);
    let [hours, minutes] = time.split(':').map(Number);
    
    if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
    
    // Find valid days
    const validDays = [];
    for (const day in dayMap) {
      if (daysStr.includes(day)) {
        validDays.push(dayMap[day]);
      }
    }
    
    if (validDays.length === 0) return null;
    
    // Find the next valid date
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(now.getDate() + i);
      checkDate.setHours(hours, minutes, 0, 0);
      
      if (validDays.includes(checkDate.getDay())) {
        // If it's today, make sure it hasn't passed yet
        if (i === 0 && checkDate < now) continue;
        return checkDate;
      }
    }
    
    return null;
  }

  return (
    <div className="upload-container">
      <h2>Upload Your Class Schedule (.pdf)</h2>
      <input 
        type="file" 
        accept=".pdf" 
        ref={fileRef} 
        onChange={handleFileUpload}
        disabled={loading}
        style={{ display: 'none' }}
        id="file-upload"
      />
      <label htmlFor="file-upload" className="custom-file-upload">
        {loading ? 'Parsing...' : 'Choose PDF File'}
      </label>
      {error && <p className="error" style={{color: 'red'}}>{error}</p>}
    </div>
  );
}