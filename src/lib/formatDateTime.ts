export const formatDateTime = (timestamp: any) => {
  if (!timestamp?.toDate) return '';
  const date = timestamp.toDate();
  const dateStr = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const timeStr = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${dateStr} at ${timeStr}`;
};
