Below is a reasonably detailed Project Specification that consolidates all the requirements and answers to the questions we’ve discussed. This spec can be handed off to a developer or another AI to guide the creation of the website. The stack is TypeScript, React, Next.js, and SCSS, with all data stored in IndexedDB.

Hashimoto’s Symptom Tracker — Project Specification

1. Overview

Goal: Create a simple, private, offline-first web application to track and visualize Hashimoto’s disease symptoms. The user should be able to quickly log symptoms (and optional severity) multiple times per day, see a calendar overview of those symptoms, and export/import all data in JSON.

Key Points
	1.	Local-Only Data: All data is stored in the user’s browser using IndexedDB.
	2.	Bingo-Card Style: A fixed set of Hashimoto’s symptoms is presented in a grid to allow quick selection each time the user checks in.
	3.	Severity Support: Some symptoms can be toggled with severity (e.g., 1–5 scale) rather than just present/absent.
	4.	Daily Notes: The user can attach free-text notes to each log entry.
	5.	Calendar View: Displays an overview of daily logs, with the ability to filter by month or year.
	6.	Multiple Check-Ins Per Day: User can log morning and evening entries (or more).
	7.	Export/Import JSON: Users can backup/restore their data.

2. User Experience (UX)
	1.	Home/Dashboard Page
	•	Shows a calendar of entries (month view by default).
	•	Each day on the calendar should indicate if symptoms were recorded, possibly with a color or icon that reflects the overall severity/frequency.
	•	Clicking a date brings up a day view/modal with the details of that day’s entries.
	2.	Check-In / Add Entry
	•	A button or link from the Home page to “Add Entry.”
	•	Bingo-Card UI: Display the fixed list of Hashimoto’s symptoms (see below) in a grid. For each symptom:
	•	Checkbox or toggle if no severity is needed.
	•	Checkbox + severity input (slider or 1–5 dropdown) if severity is relevant.
	•	Notes field (optional) for free text.
	•	Date/Time: by default, pre-filled with current date/time, but user can edit if needed.
	•	On submit, data is saved into IndexedDB.
	3.	Calendar View
	•	Displays a monthly grid by default, with an option to switch to a yearly overview or jump between months/years.
	•	Clicking a day allows the user to see the morning/evening entries in detail:
	•	Which symptoms were present + any severities
	•	Notes for that day
	•	Possibly show a summary icon or color-coded indicator for each day based on how many symptoms or average severity.
	4.	Reports / Statistics (Optional, can be phase 2)
	•	A page or section that shows aggregated stats (e.g., “Fatigue: logged 20 times this month”).
	•	Could include a line chart for trending severity of a specific symptom over time.
	5.	Settings / Data Management
	•	Export Data:
	•	Button that exports all recorded entries to a .json file (e.g., hashimoto_backup.json).
	•	Import Data:
	•	File upload or drag-and-drop.
	•	Offer the user a choice to merge or replace existing data.
	•	Handle conflicts (e.g., same timestamp) by skipping duplicates or overwriting existing entries.
	•	(Optional) Basic user preferences (e.g., reminder times, color themes).
	6.	Responsiveness & Accessibility
	•	The UI should be mobile-friendly, allowing quick symptom logging from phones or tablets.
	•	Provide sufficient color contrast and clear text for users who may have vision or cognitive challenges.

3. Symptom List & Severity

Fixed Symptom List
	1.	Fatigue and sluggishness
	2.	Increased sensitivity to cold
	3.	Increased sleepiness
	4.	Dry skin
	5.	Constipation
	6.	Muscle weakness
	7.	Muscle aches, tenderness and stiffness
	8.	Joint pain and stiffness
	9.	Irregular or excessive menstrual bleeding
	10.	Depression
	11.	Problems with memory or concentration
	12.	Swelling of the thyroid (goiter)
	13.	A puffy face
	14.	Brittle nails
	15.	Hair loss
	16.	Enlargement of the tongue

Severity
	•	Optionally allow severity for certain symptoms, e.g., Fatigue, Muscle weakness, Joint pain, Depression, etc.
	•	Implement either a dropdown (1–5) or slider for severity.
	•	For those symptoms where severity is not relevant, a simple checkbox or toggle is enough.

4. Technical Details

4.1 Technology Stack
	•	TypeScript for type safety.
	•	Next.js (React) for structure, routing, and potential SSR.
	•	SCSS for styling.
	•	IndexedDB (via a wrapper library like idb or a custom approach) for local storage.

4.2 Data Model

A possible interface in TypeScript (simplified example):

// The data for one "check-in" or "entry"
export interface SymptomEntry {
  id: string;             // unique ID (e.g., UUID)
  timestamp: string;      // ISO8601 date-time, e.g. 2025-01-11T08:00:00Z
  symptoms: {
    [symptomKey: string]: number | boolean; 
    // e.g., "fatigue": 3, "drySkin": true
  };
  notes?: string;
}

	•	Symptom keys might be a string like "fatigue", "coldSensitivity", etc.
	•	Severity is stored as a number (1–5) where relevant, or a boolean if the symptom is present/absent only.
	•	Multiple entries per day: each has its own unique id and timestamp.

4.3 IndexedDB Structure
	•	Database Name: hashimotoTrackerDB
	•	Object Store: symptomEntries
	•	Primary Key: id
	•	Basic indexes on timestamp if needed for efficient date-based queries.

Implementation detail (pseudo-code):

// Using idb library or similar
const db = await openDB('hashimotoTrackerDB', 1, {
  upgrade(db) {
    const store = db.createObjectStore('symptomEntries', {
      keyPath: 'id'
    });
    // Optional index for date/time
    store.createIndex('byTimestamp', 'timestamp');
  }
});

5. Features & Pages

5.1 Pages/Routes (Next.js)
	1.	/ (Home/Dashboard)
	•	Displays calendar component.
	•	Quick overview of the current month.
	•	Button or link to “Add Entry” or “New Check-In.”
	2.	/add (Add Entry)
	•	Bingo-card style selection of symptoms + optional severity.
	•	Date/time picker (default to now).
	•	Text area for notes.
	•	“Save” button that commits to IndexedDB and redirects back to the Home.
	3.	/settings (or /profile)
	•	Export button: triggers JSON download of all data.
	•	Import button: opens file picker for JSON.
	•	Possibly additional user preferences if needed.
	4.	/report (Optional for advanced stats)
	•	Aggregated charts or lists.
	•	Filter by symptom or date range.

5.2 Calendar Component
	•	Implementation can be custom or use a lightweight library.
	•	Each day cell shows:
	•	If an entry exists, show an icon or color-coded badge.
	•	Clicking a day opens a modal (or navigates to a day-details page) showing all entries for that day.

5.3 Export/Import Flow
	1.	Export
	•	Gather all SymptomEntry records from symptomEntries object store.
	•	Package them into a JSON object:

{
  "symptomEntries": [
    { "id": "...", "timestamp": "...", "symptoms": {...}, "notes": "..."},
    ...
  ]
}


	•	Trigger a file download (e.g., hashimoto_backup.json).

	2.	Import
	•	Let the user upload a .json file.
	•	Parse the file and check for validity (must contain a symptomEntries array).
	•	Offer an option to either merge or replace.
	•	Handle conflicts if merging (e.g., same id or same timestamp).
	•	Insert validated entries into IndexedDB.

6. Styling & Design
	•	SCSS for styling.
	•	Keep a simple, clean layout.
	•	Possibly a single color accent that differentiates the headers, buttons, etc. from the white background.
	•	The bingo card grid can be styled with simple squares or boxes for each symptom.
	•	Ensure responsive design: the grid should stack or wrap on smaller screens.

7. Security & Privacy
	•	All data is stored locally in IndexedDB; no server data is collected.
	•	If needed, consider a password-protected gate to the site (though this is purely local and can be circumvented if someone has device access).
	•	Inform users that once the data is exported, the JSON file is unencrypted, so they should store it securely.

8. Potential Future Enhancements
	1.	Reminders: Local notifications or push notifications if turned into a Progressive Web App (PWA).
	2.	Medication Tracking or Diet Tracking for correlation with symptoms.
	3.	Advanced Reports: Graphing severity trends or comparing multiple symptoms side by side.
	4.	Cloud Sync (optional, in a future version).

9. Development Steps
	1.	Project Setup
	•	Initialize Next.js with TypeScript and SCSS support (create-next-app --example with-typescript).
	•	Configure the folder structure (/pages, /components, /styles).
	2.	IndexedDB Setup
	•	Decide on a library (e.g., idb) or a custom approach.
	•	Create a utility file for opening/storing/retrieving from symptomEntries.
	3.	Data Model
	•	Create a TypeScript interface for SymptomEntry.
	•	Create a list or config file for the fixed symptoms (indicating which have severity).
	4.	Pages & Components
	•	Calendar Component:
	•	Renders a monthly view, highlights days with entries, handles clicks.
	•	Add Entry Component:
	•	Bingo card grid of symptoms (checkbox/slider).
	•	Date/time input.
	•	Notes input.
	•	Save logic to IndexedDB.
	•	Settings:
	•	Export & import handlers.
	•	Buttons & file input.
	5.	Testing & Validation
	•	Ensure that adding entries, editing, and exporting all work as expected.
	•	Test the import flow with different JSON files.
	•	Validate layout responsiveness.
	6.	Deployment
	•	Host as a static or server-rendered Next.js app (e.g., on Vercel, Netlify, or any Node-capable hosting).
	•	(Optional) If you want an offline PWA experience, add a service worker.

10. Conclusion

This specification outlines the core functionality, user experience, data model, and technical approach for a Next.js + TypeScript + SCSS Hashimoto’s symptom tracker. By following this plan, a developer (or an AI) can implement a robust, offline-first tracking system that allows users to easily manage and review their symptom history—all stored locally in the browser’s IndexedDB, with full export/import support for backups.