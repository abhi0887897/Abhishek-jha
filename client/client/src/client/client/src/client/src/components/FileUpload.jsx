import { useState } from "react";
import axios from "axios";

export default function FileUpload() {
  const [file, setFile] = useState(null);

  const uploadFile = async () => {
    const form = new FormData();
    form.append("file", file);

    await axios.post("http://localhost:5000/upload", form);
    alert("File uploaded!");
  };

  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={uploadFile} disabled={!file}>Upload</button>
    </div>
  );
}
