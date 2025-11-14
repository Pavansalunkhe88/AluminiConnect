import React from 'react';

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isOwn
          ? 'bg-blue-600 text-white rounded-br-none'
          : 'bg-gray-200 text-gray-900 rounded-bl-none'
      }`}>
        <p className="text-sm">{message.content}</p>
        <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
