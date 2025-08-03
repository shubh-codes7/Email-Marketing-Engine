import { useState } from "react";

export default function VerifyEmails() {
  const [emails, setEmails] = useState("");

  const handleVerify = async () => {
    const emailArray = emails
      .split(",")
      .map(email => email.trim())
      .filter(email => email.length > 0);

    if (emailArray.length === 0) {
      alert("Please enter at least one email.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/mail/verify-emails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: emailArray }),
      });

      const data = await res.json();
      console.log("Response:", data);
      alert("Verification email(s) sent!");
    } catch (err) {
      console.error("Verification failed:", err);
      alert("Error sending verification emails.");
    }
  };

  return (
    <div className=" mt-4 bg-white">
      <h2 className="text-xl font-semibold mb-2">Verify Emails</h2>
      <p className="text-xs pb-2"><span className="text-red-500">Warning: </span>Mails can be sent only to verified users. Enter comma seperated emails here to verify, each mail will get <span className="text-red-500 font-medium">AWS verification link. </span> Only after verification users can recieve mails.</p>
      <textarea
        className="w-full p-3 border border-gray-300 rounded mb-4 resize-none"
        rows={4}
        placeholder="Enter comma-separated emails"
        value={emails}
        onChange={e => setEmails(e.target.value)}
      />
      <button
        onClick={handleVerify}
        className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded w-full"
      >
        Send Verification Emails
      </button>
    </div>
  );
}
