"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { SymptomEntry } from "@/types";
import { getEntry, updateEntry } from "@/lib/db";
import BingoCard from "@/components/BingoCard";
export default function EditEntry() {
  const params = useParams<{ entry: string }>();
  const entryId = decodeURIComponent(params.entry);
  const router = useRouter();
  const [entry, setEntry] = useState<Partial<SymptomEntry>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadEntry = async () => {
      try {
        const entry = await getEntry(entryId);
        if (entry) {
          setEntry(entry);
        } else {
          console.error(entryId);
          throw new Error("Entry not found");
        }
      } catch (error) {
        console.error("Failed to load entry:", error);
        alert("Failed to load entry");
        router.push("/");
      }
      setLoading(false);
    };
    loadEntry();
  }, [entryId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateEntry({
        id: entry.id || "",
        timestamp: entry.timestamp || new Date().toISOString(),
        symptoms: entry.symptoms || {},
        notes: entry.notes?.trim() || undefined,
      });

      router.push("/");
    } catch (error) {
      console.error("Failed to update entry:", error);
      alert("Failed to update entry. Please try again.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
        <Typography variant="h4">Edit Entry</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Box>
      <BingoCard entry={entry} setEntry={setEntry} />
    </Box>
  );
}
