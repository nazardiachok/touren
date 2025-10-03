import type { Qualification, TaskType, ShiftType } from '@/lib/types';

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getQualificationLabel = (qual: Qualification): string => {
  const labels: Record<Qualification, string> = {
    medikamente: 'Medikamentengabe',
    wundversorgung: 'Wundversorgung',
    grundpflege: 'Grundpflege',
    behandlungspflege: 'Behandlungspflege',
    demenzbetreuung: 'Demenzbetreuung',
    palliativpflege: 'Palliativpflege',
    insulinverabreichung: 'Insulinverabreichung',
  };
  return labels[qual] || qual;
};

export const getTaskTypeLabel = (type: TaskType): string => {
  const labels: Record<TaskType, string> = {
    medikamente: 'Medikamente',
    koerperpflege: 'Körperpflege',
    mobilisation: 'Mobilisation',
    wundversorgung: 'Wundversorgung',
    ernaehrung: 'Ernährung',
    dokumentation: 'Dokumentation',
    arztbesuch: 'Arztbesuch',
    freizeitgestaltung: 'Freizeitgestaltung',
  };
  return labels[type] || type;
};

export const getShiftLabel = (shift: ShiftType): string => {
  const labels: Record<ShiftType, string> = {
    early: 'Frühschicht',
    late: 'Spätschicht',
    night: 'Nachtschicht',
  };
  return labels[shift] || shift;
};

export const getShiftTimeRange = (shift: ShiftType): { start: string; end: string } => {
  const ranges: Record<ShiftType, { start: string; end: string }> = {
    early: { start: '06:00', end: '14:00' },
    late: { start: '14:00', end: '22:00' },
    night: { start: '22:00', end: '06:00' },
  };
  return ranges[shift];
};

export const getCareLevelLabel = (level: 1 | 2 | 3 | 4 | 5): string => {
  return `Pflegegrad ${level}`;
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} Min`;
  }
  
  if (mins === 0) {
    return `${hours} Std`;
  }
  
  return `${hours} Std ${mins} Min`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

