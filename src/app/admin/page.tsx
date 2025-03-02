'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Message = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
};

export default function AdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<{id: string, status: 'deleting' | 'error' | null}>({id: '', status: null});

  // Fetch messages from the API
  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Delete a message
  const deleteMessage = async (id: string) => {
    setDeleteStatus({id, status: 'deleting'});
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete message');
      
      // Refresh the messages list
      await fetchMessages();
      setDeleteStatus({id: '', status: null});
    } catch (error) {
      console.error('Error deleting message:', error);
      setDeleteStatus({id, status: 'error'});
      // Reset error status after 3 seconds
      setTimeout(() => setDeleteStatus({id: '', status: null}), 3000);
    }
  };

  // Initial fetch
  useEffect(() => {
    setIsLoading(true);
    fetchMessages().finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen p-4 max-w-4xl mx-auto">
      <header className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            Back to Chat
          </Link>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Manage all messages</p>
      </header>

      <main className="flex-1">
        {isLoading ? (
          <div className="text-center py-8">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No messages found.
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {messages.map((message) => (
                  <tr key={message.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{message.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{message.content}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(message.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <button
                        onClick={() => deleteMessage(message.id)}
                        disabled={deleteStatus.id === message.id && deleteStatus.status === 'deleting'}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                      >
                        {deleteStatus.id === message.id && deleteStatus.status === 'deleting' 
                          ? 'Deleting...' 
                          : deleteStatus.id === message.id && deleteStatus.status === 'error'
                            ? 'Error! Try again' 
                            : 'Remove'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Admin Dashboard - Simple Chat App
      </footer>
    </div>
  );
} 