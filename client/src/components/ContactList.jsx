import { useState } from 'react';

export default function ContactList({setContacts, listName, setListName}) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !listName) {
      alert("Please enter a name and select a file");
      return;
    }

    const formData = new FormData();
    formData.append("name", listName);
    formData.append("contacts", file); 

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/contact`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log("Upload response:", result);
      setContacts(result)
    } catch (err) {
      console.error("Error uploading contact list:", err);
    }
  };

  return (
    <div className="  my-10 p-6 bg-white rounded-xl border-2 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Upload CSV Contact List</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
        type="text"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        placeholder="Enter contact list name"
        className="border p-2 w-full"
        />
        
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="text-sm text-gray-700
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-yellow-500 file:text-white
                     hover:file:bg-yellow-600"
        />
        <button
          type="submit"
          className=" bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
