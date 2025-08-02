import { useEffect, useState } from "react";
import ContactList from "./ContactList";
import SendMails from './SendMails'

export default function Pipeline() {
  const [pipelineName, setPipelineName] = useState("");
  const [templates, setTemplates] = useState([]);
  const [contacts, setContacts] = useState()
  const [listName, setListName] = useState("");
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);

  const [steps, setSteps] = useState([
    { templateId: "", delayMinutes: 0 },
  ]);

  const fetchPipelines = async () => {
    try {
      const res = await fetch('http://localhost:3000/pipeline');
      const data = await res.json();
      console.log("pipelines", data);
      setPipelines(data.pipelines);
    } catch (err) {
      console.error("Error fetching pipelines:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch("http://localhost:3000/template");
        const data = await res.json()
        console.log("templates", data);
        setTemplates(data.templates);
      } catch (err) {
        console.error("Error fetching templates", err);
      }
    };

    fetchTemplates();
    fetchPipelines();
  }, []);


  const handleStepChange = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index][field] = field === "delayMinutes" ? parseInt(value) : value;
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, { templateId: "", delayMinutes: 0 }]);
  };

  const removeStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name: pipelineName, steps, listname: listName, contacts: contacts.contactList.contacts };
    console.log("Submitting Pipeline:", payload);

    try {
      const res = await fetch("http://localhost:3000/pipeline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      alert(data.message || "Pipeline created");
      console.log(data);

      await fetchPipelines();

      setPipelineName("");
      setSteps([{ templateId: "", delayMinutes: 0 }]);
      setContacts(null);
      setListName("");
    } catch (err) {
      console.error(err);
      alert("Error creating pipeline");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Create Pipeline</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pipeline Name</label>
          <input
            type="text"
            value={pipelineName}
            onChange={(e) => setPipelineName(e.target.value)}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <ContactList setContacts = {setContacts} listName={listName} setListName={setListName}/>


        {steps.map((step, index) => (
          <div key={index} className="p-4 flex justify-between items-center bg-gray-100 rounded-md space-y-4">
            <h4 className="font-semibold text-gray-700">Step {index + 1}</h4>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Template ID</label>
              <select
              className="w-full p-2 border rounded mb-2"
              value={step.templateId}
              onChange={(e) =>
                handleStepChange(index, "templateId", e.target.value)
              }
              required
            >
              <option value="">Select a template</option>
              { templates.length > 0 && templates.map((template) => (
                <option key={template._id} value={template._id}>
                  {template.name || template.subject || "Unnamed Template"}
                </option>
              ))}
            </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Delay (in minutes)</label>
              <input
                type="number"
                value={step.delayMinutes}
                onChange={(e) => handleStepChange(index, "delayMinutes", e.target.value)}
                min={0}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="flex justify-end">
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-red-500 hover:underline"
                >
                  Remove Step
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addStep}
          className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600"
        >
          + Add Step
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900"
        >
          Create Pipeline
        </button>
      </div>


      <SendMails 
        pipelines={pipelines} 
        loading={loading} 
        onRefresh={fetchPipelines}
      />



    </div>
  );
}
