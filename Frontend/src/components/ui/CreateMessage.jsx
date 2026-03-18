// import React, { useState } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { Card } from './Card';

// const CreateMessage = ({ onSubmit }) => {
//   const { user } = useAuth();
//   const [isOpen, setIsOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     recipient: '',
//     subject: '',
//     content: ''
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.recipient || !formData.subject || !formData.content) return;

//     onSubmit({
//       ...formData,
//       sender: user.name,
//       timestamp: 'Just now',
//       isRead: false
//     });

//     setFormData({ recipient: '', subject: '', content: '' });
//     setIsOpen(false);
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   return (
//     <>
//       <button
//         onClick={() => setIsOpen(true)}
//         className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//       >
//         Compose Message
//       </button>

//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <Card className="w-full max-w-md mx-4">
//             <div className="p-6">
//               <h3 className="text-lg font-semibold mb-4">Compose Message</h3>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     To
//                   </label>
//                   <input
//                     type="text"
//                     name="recipient"
//                     value={formData.recipient}
//                     onChange={handleChange}
//                     placeholder="Enter recipient name or email"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Subject
//                   </label>
//                   <input
//                     type="text"
//                     name="subject"
//                     value={formData.subject}
//                     onChange={handleChange}
//                     placeholder="Enter subject"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Message
//                   </label>
//                   <textarea
//                     name="content"
//                     value={formData.content}
//                     onChange={handleChange}
//                     placeholder="Type your message here..."
//                     rows={4}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//                     required
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={() => setIsOpen(false)}
//                     className="px-4 py-2 text-gray-600 hover:text-gray-800"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     Send
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </Card>
//         </div>
//       )}
//     </>
//   );
// };

// export default CreateMessage;

import React, { useState } from "react";

const CreateMessage = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState("");
  const [text, setText] = useState("");

  const submit = () => {
    if (!to || !text) return;
    onSubmit({ to, text });
    setTo("");
    setText("");
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
      >
        New
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-96">
            <input
              placeholder="Recipient userId"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full border p-2 mb-2"
            />
            <textarea
              placeholder="Message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border p-2 mb-2"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button onClick={submit} className="bg-blue-600 text-white px-3">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateMessage;

