import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bug, HelpCircle, Lightbulb, MessageSquare } from "lucide-react";

const FEEDBACK_TYPES = [
  { value: "bug", label: "Bug", icon: <Bug className="w-4 h-4 mr-2 text-red-500" /> },
  { value: "question", label: "Question", icon: <HelpCircle className="w-4 h-4 mr-2 text-blue-500" /> },
  { value: "feature", label: "Feature Request", icon: <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" /> },
  { value: "other", label: "Other", icon: <MessageSquare className="w-4 h-4 mr-2 text-gray-500" /> },
];

const Feedback: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "bug",
    message: "",
    bugDetails: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-8 px-2">
      <div className="container max-w-xl mx-auto">
        <Card className="shadow-2xl rounded-2xl border-0">
          <CardHeader className="w-full text-center mb-2 pt-8 pb-2">
            <CardTitle className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-2">Feedback</CardTitle>
            <p className="text-gray-500 mt-2 text-lg">We value your feedback! Please let us know your thoughts, questions, or report any bugs below.</p>
          </CardHeader>
          <CardContent className="w-full flex flex-col items-center pb-10 pt-2">
            {submitted ? (
              <div className="w-full text-center py-16">
                <h2 className="text-2xl font-semibold text-green-600 mb-4">Thank you for your feedback!</h2>
                <p className="text-gray-600">We appreciate your input and will use it to improve our platform.</p>
              </div>
            ) : (
              <form className="w-full max-w-lg space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feedback Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {FEEDBACK_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                {form.type === "bug" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bug Details</label>
                    <input
                      type="text"
                      name="bugDetails"
                      value={form.bugDetails}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                      placeholder="Describe the bug (e.g. steps to reproduce, error message)"
                      required={form.type === "bug"}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    rows={4}
                    placeholder="Type your feedback here..."
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-200">
                  Submit Feedback
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Feedback; 