import "./EvidencesList.css";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Evidence({ evidence }) {
  const downloadFile = async (event) => {
    const id = event.target.id;
    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/evidence/file/evidenceId/${id}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }

      const blob = await response.blob(); // Get the file as a Blob
      const url = window.URL.createObjectURL(blob); // Create a URL for the Blob
      const link = document.createElement("a"); // Create a link element
      link.href = url;

      link.download = "downloaded-file.txt"; // Change extension based on your file type
      link.click(); // Trigger download

      // Clean up
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  return (
    <div className="admin-evidence-card">
      <h3>
        <span>#</span> {evidence._id}
      </h3>
      <p>Name: {evidence.file_path}</p>
      <p>File Type: {evidence.file_type}</p>
      <p>Uploaded By : {evidence.uploaded_by}</p>
      <p>
        Date : {new Date(evidence.createdAt).toLocaleString().split(",")[0]}
      </p>
      <p>
        Time : {new Date(evidence.createdAt).toLocaleString().split(",")[1]}
      </p>
      <p
        id={evidence._id}
        className="admin-evidence__link"
        onClick={downloadFile}
      >
        View File
      </p>
    </div>
  );
}

function EvidencesList({ evidences }) {
  return (
    <div className="admin-evidences-container">
      {evidences ? (
        evidences.map((evidence) => (
          <Evidence key={evidence._id} evidence={evidence} />
        ))
      ) : (
        <div>no evidences found</div>
      )}
    </div>
  );
}

export default EvidencesList;
