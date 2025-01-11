"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  TextField,
  Slider,
  Card,
  CardContent,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { SYMPTOMS } from "@/types";
import { addEntry } from "@/lib/db";

export default function AddEntry() {
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] = useState<{
    [key: string]: number | boolean;
  }>({});
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSymptomToggle = (symptomId: string, hasSeverity: boolean) => {
    setSelectedSymptoms((prev) => {
      if (hasSeverity) {
        // If it's already selected with a severity, remove it
        if (typeof prev[symptomId] === "number") {
          const { [symptomId]: _, ...rest } = prev;
          return rest;
        }
        // Otherwise , add it with severity 3 (middle value)
        return { ...prev, [symptomId]: 3 };
      }
      // For boolean symptoms, toggle between true and undefined
      if (prev[symptomId]) {
        const { [symptomId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [symptomId]: true };
    });
  };

  const handleSeverityChange = (symptomId: string, severity: number) => {
    setSelectedSymptoms((prev) => ({
      ...prev,
      [symptomId]: severity,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await addEntry({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        symptoms: selectedSymptoms,
        notes: notes.trim() || undefined,
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

      <Grid container spacing={2}>
        {SYMPTOMS.map((symptom) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={symptom.id}>
            <Card
              sx={{
                cursor: "pointer",
                bgcolor: selectedSymptoms[symptom.id]
                  ? "primary.light"
                  : "background.paper",
              }}
              onClick={() =>
                handleSymptomToggle(symptom.id, symptom.hasSeverity)
              }
            >
              <CardContent>
                <Typography>{symptom.label}</Typography>
                {symptom.hasSeverity && selectedSymptoms[symptom.id] && (
                  <Slider
                    min={1}
                    max={5}
                    value={selectedSymptoms[symptom.id] as number}
                    onChange={(_, value) =>
                      handleSeverityChange(symptom.id, value as number)
                    }
                    onClick={(e) => e.stopPropagation()}
                    sx={{ mt: 2 }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <TextField
        label="Notes"
        multiline
        rows={4}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add any additional notes here..."
        fullWidth
      />
    </Box>
  );
}
