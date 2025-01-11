export interface SymptomEntry {
  id: string;
  timestamp: string;
  symptoms: {
    [symptomKey: string]: number | boolean;
  };
  notes?: string;
}

export interface Symptom {
  id: string;
  label: string;
  hasSeverity: boolean;
}

export const SYMPTOMS: Symptom[] = [
  { id: 'fatigue', label: 'Fatigue and sluggishness', hasSeverity: true },
  { id: 'coldSensitivity', label: 'Increased sensitivity to cold', hasSeverity: false },
  { id: 'sleepiness', label: 'Increased sleepiness', hasSeverity: true },
  { id: 'drySkin', label: 'Dry skin', hasSeverity: false },
  { id: 'constipation', label: 'Constipation', hasSeverity: false },
  { id: 'muscleWeakness', label: 'Muscle weakness', hasSeverity: true },
  { id: 'muscleAches', label: 'Muscle aches, tenderness and stiffness', hasSeverity: true },
  { id: 'jointPain', label: 'Joint pain and stiffness', hasSeverity: true },
  { id: 'menstrualIssues', label: 'Irregular or excessive menstrual bleeding', hasSeverity: false },
  { id: 'depression', label: 'Depression', hasSeverity: true },
  { id: 'memoryIssues', label: 'Problems with memory or concentration', hasSeverity: true },
  { id: 'thyroidSwelling', label: 'Swelling of the thyroid (goiter)', hasSeverity: false },
  { id: 'puffyFace', label: 'A puffy face', hasSeverity: false },
  { id: 'brittleNails', label: 'Brittle nails', hasSeverity: false },
  { id: 'hairLoss', label: 'Hair loss', hasSeverity: false },
  { id: 'enlargedTongue', label: 'Enlargement of the tongue', hasSeverity: false },
]; 