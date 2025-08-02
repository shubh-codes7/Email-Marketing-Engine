import React, { useState } from 'react';

export default function SendMails({ pipelines, loading }) {
  const [sending, setSending] = useState(false);

  const handleSendMails = async (pipelineId) => {
    setSending(true);
    try {
      const res = await fetch('http://localhost:3000/mail/send-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipelineId }), // Adjust this payload if your API expects more
      });

      const result = await res.json();
      console.log(result);
      if (res.ok) {
        alert(`Mails sent successfully for pipeline: ${pipelineId}`);
      } else {
        console.error(result);
        alert("Failed to send mails.");
      }
    } catch (error) {
      console.error("Error sending mails:", error);
      alert("Error sending mails.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p>Loading pipelines...</p>;

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pipelines.map(pipeline => (
        <div key={pipeline._id} className="border rounded-xl p-4 shadow-md bg-white">
          <h2 className="text-xl font-semibold">{pipeline.name}</h2>
          <p className="text-gray-600">List: {pipeline.listname}</p>
          <p className="text-gray-600">Steps: {pipeline.steps.length}</p>
          <button
            onClick={() => handleSendMails(pipeline._id)}
            disabled={sending}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send Mails'}
          </button>
        </div>
      ))}
    </div>
  );
}