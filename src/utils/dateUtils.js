export const formatDate = (date, time = null) => {
  if (!date) return 'N/A';
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return time ? `${formattedDate}, ${time}` : formattedDate;
};
