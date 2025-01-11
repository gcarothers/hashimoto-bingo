import { useState } from "react";

import { Card, CardContent, Typography, Slider, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { SYMPTOMS, SymptomEntry } from "@/types";

interface BingoCardProps {
  entry: Partial<SymptomEntry>;
  setEntry: (entry: Partial<SymptomEntry>) => void;
}

const BingoCard: React.FC<BingoCardProps> = ({ entry, setEntry }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<{
    [key: string]: number | boolean;
  }>(entry.symptoms || {});
  const [notes, setNotes] = useState(entry.notes || "");

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
    setEntry({ ...entry, symptoms: selectedSymptoms });
  };

  const handleSeverityChange = (symptomId: string, severity: number) => {
    setSelectedSymptoms((prev) => ({
      ...prev,
      [symptomId]: severity,
    }));
    setEntry({ ...entry, symptoms: selectedSymptoms });
  };

  return (
    <>
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
      />  </>
  );
};

export default BingoCard;
