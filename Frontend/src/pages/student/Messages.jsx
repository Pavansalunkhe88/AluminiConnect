import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import CreateMessage from '../../components/ui/CreateMessage';
import MessageThread from '../../components/ui/MessageThread';

const StudentMessages = () => {
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState(null);
  const [conversations, setConversations] = useState([
    {
      id: 1,
      contact: {
        name: 'Dr. Sarah Chen',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen',
        role: 'teacher'
      },
      lastMessage: 'Hi, I reviewed your project submission. Great work on the implementation!',
      timestamp: '2 hours ago',
      unreadCount: 1
    },
    {
      id: 2,
      contact: {
        name: 'Career Services',
        avatar: 'https://ui-avatars.com/api/?name=Career+Services',
        role: 'department'
      },
      lastMessage: 'We have several internship positions available at top companies.',
      timestamp: '1 day ago',
      unreadCount: 0
    },
    {
      id: 3,
      contact: {
        name: 'Alex Thompson',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Thompson',
        role: 'alumni'
      },
      lastMessage: 'Thanks for reaching out! I\'d be happy to schedule a mentorship session.',
      timestamp: '3 days ago',
      unreadCount: 0
    }
  ]);

  const handleCreateMessage = (newMessage) => {
    // Find existing conversation or create new one
    const existingConversation = conversations.find(conv =>
      conv.contact.name.toLowerCase() === newMessage.recipient.toLowerCase()
    );

    if (existingConversation) {
      // Update existing conversation
      setConversations(conversations.map(conv =>
        conv.id === existingConversation.id
          ? { ...conv, lastMessage: newMessage.content, timestamp: newMessage.timestamp, unreadCount: 0 }
          : conv
      ));
    } else {
      // Create new conversation
      const newConversation = {
        id: Date.now(),
        contact: {
          name: newMessage.recipient,
          avatar: 'https://ui-avatars.com/api/?name=' + newMessage.recipient,
          role: 'unknown'
        },
        lastMessage: newMessage.content,
        timestamp: newMessage.timestamp,
        unreadCount: 0
      };
      setConversations([newConversation, ...conversations]);
    }
  };

  if (selectedContact) {
    return (
      <div className="h-[calc(100vh-200px)] bg-white rounded-lg shadow-sm border border-gray-200">
        <MessageThread
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Stay connected with your network</p>
        </div>
        <CreateMessage onSubmit={handleCreateMessage} />
      </div>

      <div className="space-y-2">
        {conversations.map(conversation => (
          <Card
            key={conversation.id}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedContact(conversation.contact)}
          >
            <div className="flex items-center space-x-4">
              <img
                src={conversation.contact.avatar}
                alt={conversation.contact.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {conversation.contact.name}
                  </h3>
                  <span className="text-sm text-gray-500">{conversation.timestamp}</span>
                </div>
                <p className="text-gray-600 text-sm truncate">{conversation.lastMessage}</p>
                <p className="text-xs text-gray-500 capitalize">{conversation.contact.role}</p>
              </div>
              {conversation.unreadCount > 0 && (
                <div className="flex flex-col items-end">
                  <span className="bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {conversation.unreadCount}
                  </span>
                </div>
              )}
            </div>
          </Card>
        ))}

        {conversations.length === 0 && (
          <Card className="p-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-gray-600">Start a conversation by clicking "Compose Message"</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentMessages;
