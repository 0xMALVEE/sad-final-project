'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Message = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Send a new message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !content.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, content }),
      });
      
      if (!response.ok) throw new Error('Failed to send message');
      
      setContent('');
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initial fetch and set up polling
  useEffect(() => {
    fetchMessages();
    
    // Set up polling every 2 seconds
    const intervalId = setInterval(fetchMessages, 2000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen p-4 max-w-4xl mx-auto">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Simple Chat App</h1>
        <p className="text-gray-600 dark:text-gray-400">Messages refresh automatically every 2 seconds</p>
        <div className="mt-2">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            Admin Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Messages container */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-y-auto max-h-[60vh]">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No messages yet. Be the first to send one!
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                  <div className="font-bold text-sm text-blue-600 dark:text-blue-400">{message.name}</div>
                  <div className="mt-1">{message.content}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(message.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message form */}
        <form onSubmit={sendMessage} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <textarea
              id="message"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              placeholder="Type your message here..."
              rows={3}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !name.trim() || !content.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </main>

      <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Simple Chat App with Next.js, Drizzle ORM, and TiDB
      </footer>
    </div>
  );
}
