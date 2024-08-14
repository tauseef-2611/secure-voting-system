import { stringify } from 'csv-stringify/browser/esm/sync';

const downloadCSV = (rows) => {
  console.log(rows);

  // Convert rows to CSV string
  const csvString = stringify(rows, {
    header: true,
  });

  // Create a Blob from the CSV string
  const blob = new Blob([csvString], { type: 'text/csv' });

  // Create a link element
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'data.csv';

  // Append the link to the document body and trigger a click
  document.body.appendChild(link);
  link.click();

  // Clean up by removing the link
  document.body.removeChild(link);
};

export default downloadCSV;