"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import { SymptomEntry } from "@/types";
import { addEntry } from "@/lib/db";

import BingoCard from "@/components/BingoCard";

export default function AddEntry() {
  const router = useRouter();
  const [entry, setEntry] = useState<Partial<SymptomEntry>>({});
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await addEntry({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        symptoms: entry.symptoms || {},
        notes: entry.notes?.trim() || undefined,
      });

      router.push("/");
    } catch (error) {
      console.error("Failed to save entry:", error);
      alert("Failed to save entry. Please try again.");
      setSaving(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Record a Symptom Bingo Card</Typography>
        <Button type="submit" variant="contained" disabled={saving}>
          {saving ? "Saving..." : "Save Card"}
        </Button>
      </Box>

      <BingoCard entry={entry} setEntry={setEntry} />
    </Box>
  );
}
