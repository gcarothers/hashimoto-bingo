import { openDB, DBSchema } from "idb";
import { SymptomEntry, SYMPTOMS } from "@/types";

interface HashimotoDB extends DBSchema {
  symptomEntries: {
    key: string;
    value: SymptomEntry;
    indexes: { "by-timestamp": string };
  };
}

const DB_NAME = "hashimotoTrackerDB";
const STORE_NAME = "symptomEntries";

export async function initDB() {
  return openDB<HashimotoDB>(DB_NAME, 1, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
      store.createIndex("by-timestamp", "timestamp");
    },
  });
}

export async function addEntry(entry: SymptomEntry) {
  const db = await initDB();
  return db.add(STORE_NAME, entry);
}

export async function getEntries(startDate?: Date, endDate?: Date) {
  const db = await initDB();
  const entries = await db.getAllFromIndex(STORE_NAME, "by-timestamp");

  if (!startDate || !endDate) return entries;

  return entries.filter((entry) => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= startDate && entryDate <= endDate;
  });
}

export async function exportData() {
  const db = await initDB();
  const entries = await db.getAll(STORE_NAME);
  return { symptomEntries: entries };
}

export async function importData(
  data: { symptomEntries: SymptomEntry[] },
  replace = false,
) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");

  if (replace) {
    await tx.store.clear();
  }

  for (const entry of data.symptomEntries) {
    await tx.store.put(entry);
  }

  await tx.done;
}

export async function deleteAllData() {
  const db = await initDB();
  await db.clear(STORE_NAME);
}

export async function generateSampleMonth(baseDate = new Date()) {
  const entries: SymptomEntry[] = [];

  // Get the first day of the month
  const startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const daysInMonth = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth() + 1,
    0,
  ).getDate();

  // Generate entries for each day
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      day,
    );

    // Randomly select 2-5 symptoms for each day
    const numSymptoms = Math.floor(Math.random() * 4) + 2;
    const dailySymptoms = [...SYMPTOMS]
      .sort(() => Math.random() - 0.5)
      .slice(0, numSymptoms);

    const entry: SymptomEntry = {
      id: `sample-${currentDate.toISOString()}`,
      timestamp: currentDate.toISOString(),
      symptoms: Object.assign(
        {},
        ...dailySymptoms.map((s) => ({
          [s.id]: s.hasSeverity ? Math.floor(Math.random() * 5) + 1 : true,
        })),
      ),
      notes: "",
    };
    entries.push(entry);
  }

  // Import the generated data
  await importData({ symptomEntries: entries }, true);
  return entries;
}
