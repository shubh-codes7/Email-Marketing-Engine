import { useState, useEffect } from 'react';
import VerifyEmails from './VerifyEmails';

export default function ContactList({setContacts}) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUplLoading] = useState(false);
  const [contactLists, setContactLists] = useState([]);
  const [selected, setSelected] = useState(null)
  const [listName, setListName] = useState('')

  // Fetch contact lists on component mount
  useEffect(() => {
    fetchContactLists();
  }, []);

  const fetchContactLists = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/contact`);
      const data = await res.json();
      setContactLists(data.contactList);
    } catch (error) {
      console.error("Error fetching contact lists:", error);
    }
  };

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
      setIsUplLoading(true)
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/contact`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log("Upload response:", result);
      alert("Contacts uploaded!")

      // Refresh the contact lists after upload
      fetchContactLists();
    } catch (err) {
      console.error("Error uploading contact list:", err);
    } finally{
      setIsUplLoading(false)
      setFile(null)
      setListName('')
    }
  };

  const handleSelect = async(list, index) => {
    setSelected(index)
    setContacts(list)
  }

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
          disabled={isUploading}
          className=" bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {/* verify emails */}
      <hr/>
      <VerifyEmails />
      <hr/>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Your Contact List</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactLists.length > 0 && contactLists.map((list, index) => (
              <div key={index} style={{backgroundColor: selected == index ? "#f0b100" : "inherit"}} onClick={()=>handleSelect(list, index)} className="border cursor-pointer rounded-lg p-4 shadow-sm bg-gray-50">
                <h4 className="font-semibold text-gray-800 mb-2">{list.name}</h4>
                <p className="text-sm text-gray-600">
                  Contacts: {list.contacts ? list.contacts.length : 0}
                </p>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}