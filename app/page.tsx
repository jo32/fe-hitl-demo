import React from 'react';

interface SearchResult {
  title: string;
  url: string;
  points: number;
  author: string;
  age: string;
  comments: number;
}

const SearchResults: React.FC = () => {
  const results: SearchResult[] = [
    {
      title: "Bye Bye Mongo, Hello Postgres",
      url: "https://www.theguardian.com/info/2018/nov/30/bye-bye-mongo-hello-postgres",
      points: 1562,
      author: "philliphaydon",
      age: "6 years ago",
      comments: 417
    },
    {
      title: "Hello, GitHub",
      url: "https://natfriedman.github.io/hello/",
      points: 1498,
      author: "rafaelc",
      age: "5 years ago",
      comments: 644
    },
    // ... more results can be added here
  ];

  return (
    <div className="bg-orange-500 min-h-screen font-sans">
      <header className="bg-orange-500 p-2 flex items-center">
        <div className="w-8 h-8 bg-white rounded-full mr-2"></div>
        <h1 className="text-white font-bold mr-4">Search Hacker News</h1>
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="hello"
            className="w-full p-2 pr-10 rounded"
          />
          <div className="absolute right-3 top-2.5 text-gray-500 h-20 w-20"></div>
        </div>
        <div className="text-white ml-4 h-20 w-20">Search</div>
      </header>
      
      <main className="bg-gray-100 p-4">
        <div className="mb-4 text-sm text-gray-600">
          15,737 results (0.013 seconds)
        </div>
        
        {results.map((result, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-lg">
              <a href={result.url} className="text-black hover:underline">
                {result.title}
              </a>
            </h2>
            <div className="text-sm text-gray-600">
              {result.points} points | {result.author} | {result.age} | {result.comments} comments
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default SearchResults;