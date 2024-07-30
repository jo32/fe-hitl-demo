"use client";

import React, { useState } from 'react';
import { Search, Settings } from 'lucide-react';
import useData, { DiscussionStream } from './hook'; // Adjust the import path as needed

const SearchResults: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('hello');
  const { data, error, loading, refresh } = useData(searchTerm);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="bg-orange-500 min-h-screen font-sans">
      <header className="bg-orange-500 p-2 flex items-center">
        <div className="w-8 h-8 bg-white rounded-full mr-2"></div>
        <h1 className="text-white font-bold mr-4">Search Hacker News</h1>
        <div className="flex-grow relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="hello"
            className="w-full p-2 pr-10 rounded text-black"
          />
          <Search className="absolute right-3 top-2.5 text-gray-500" size={20} />
        </div>
        <Settings className="text-white ml-4" size={24} />
      </header>
      
      <main className="bg-gray-100 p-4">
        <div className="mb-4 text-sm text-gray-600">
          {loading ? 'Loading...' : data ? `${data.topics.length} results found` : 'No results'}
        </div>
        
        {error && <div className="text-red-500">Error: {error.message}</div>}

        {data && data.topics.map((topic, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-lg">
              <a href={topic.slug} className="text-black hover:underline">
                {topic.title}
              </a>
            </h2>
            <div className="text-sm text-gray-600">
              {topic.liked} points | {new Date(topic.created_at).toLocaleDateString()} | {topic.reply_count} comments
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default SearchResults;