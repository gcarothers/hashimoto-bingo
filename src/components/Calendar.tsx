'use client';

import { useState } from 'react';
import { 
  Paper, 
  Typography, 
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { SymptomEntry } from '@/types';

interface CalendarProps {
  entries: SymptomEntry[];
}

interface DayEntry {
  date: Date;
  entries: SymptomEntry[];
  isCurrentMonth: boolean;
}

function getDaysInMonth(year: number, month: number): DayEntry[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: DayEntry[] = [];

  // Add days from previous month to start on Sunday
  const firstDayOfWeek = firstDay.getDay();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push({ date, entries: [], isCurrentMonth: false });
  }

  // Add days of current month
  for (let date = 1; date <= lastDay.getDate(); date++) {
    days.push({
      date: new Date(year, month, date),
      entries: [],
      isCurrentMonth: true,
    });
  }

  // Add days from next month to complete the grid
  const remainingDays = 42 - days.length; // 6 rows * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({ date, entries: [], isCurrentMonth: false });
  }

  return days;
}

export default function Calendar({ entries }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const days = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  // Group entries by date
  entries.forEach(entry => {
    const entryDate = new Date(entry.timestamp);
    const dayEntry = days.find(
      day =>
        day.date.getDate() === entryDate.getDate() &&
        day.date.getMonth() === entryDate.getMonth() &&
        day.date.getFullYear() === entryDate.getFullYear()
    );
    if (dayEntry) {
      dayEntry.entries.push(entry);
    }
  });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Typography>
        <Box>
          <IconButton onClick={previousMonth}>
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={nextMonth}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={1}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Grid key={day} size={12/7}>
            <Typography align="center" variant="subtitle2">
              {day}
            </Typography>
          </Grid>
        ))}
        {days.map((day, index) => (
          <Grid key={index} size={12/7}>
            <Paper
              elevation={0}
              sx={{
                p: 1,
                minHeight: 80,
                bgcolor: day.entries.length > 0 ? 'primary.light' : 'background.paper',
                opacity: day.isCurrentMonth ? 1 : 0.5,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
              onClick={() => setSelectedDate(day.date)}
            >
              <Typography>{day.date.getDate()}</Typography>
              {day.entries.length > 0 && (
                <Typography variant="caption" color="primary">
                  {day.entries.length} entries
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {selectedDate && (
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="h6">
            {selectedDate.toLocaleDateString()}
          </Typography>
          <List>
            {days
              .find(day => day.date.getTime() === selectedDate.getTime())
              ?.entries.map((entry, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={new Date(entry.timestamp).toLocaleTimeString()}
                    secondary={Object.entries(entry.symptoms)
                      .filter(([_, value]) => value)
                      .map(([key]) => key)
                      .join(', ')}
                  />
                </ListItem>
              ))}
          </List>
        </Box>
      )}
    </Paper>
  );
} 