export const ExportJson = (jsonData) => {
  // Convert JSON to string
  const jsonString = JSON.stringify(jsonData, null, 2); // Pretty print with 2 spaces

  // Create a Blob
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create a link element
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "cases.json"; // Specify the file name

  // Trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
};
