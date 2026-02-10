// import React from 'react';

// const MessageBubble = ({ message, isOwn }) => {
//   return (
//     <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
//       <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//         isOwn
//           ? 'bg-blue-600 text-white rounded-br-none'
//           : 'bg-gray-200 text-gray-900 rounded-bl-none'
//       }`}>
//         <p className="text-sm">{message.content}</p>
//         <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
//           {message.timestamp}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default MessageBubble;


import React from "react";

const MessageBubble = ({ message, isOwn }) => {
  const seenCount = message.seenBy?.length || 0;

  return (
    <div className={`flex mb-2 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-3 py-2 rounded max-w-xs ${
          isOwn ? "bg-green-200" : "bg-white"
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <div className="flex items-center justify-between gap-1 mt-1">
          <p className="text-[10px] text-gray-500">
            {new Date(message.createdAt).toLocaleTimeString()}
          </p>
          {isOwn && seenCount > 0 && (
            <span className="text-[10px] text-blue-600 font-semibold">✓ Seen</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
