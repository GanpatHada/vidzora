import React, { useEffect, useRef, useState } from "react";
import { searchVideos } from "../../services/videoService";
import VideoCard from "../../components/VideoCard";
import SearchSkeleton from "./SearchSkeleton";
import { IoMdClose } from "react-icons/io";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const Search = () => {
  const [query, setQuery] = useState("");
  const [displayQuery, setDisplayQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setDisplayQuery(query);
    try {
      const res = await searchVideos(query);
      if (res.success && res.data.hits) setResults(res.data.hits);
      else setResults([]);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setDisplayQuery("");
    setResults([]);
    setSearched(false);
    inputRef.current?.focus();
  };

  const handleMicSearch = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      toast.dismiss("listening");
      setIsListening(false);
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      toast.loading("Listening…", { id: "listening" });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setSearched(false);
    };

    recognition.onerror = (event: any) => {
      toast.dismiss("listening");
      toast.error(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      toast.dismiss("listening");
      setIsListening(false);
      inputRef.current?.focus();
    };

    recognition.start();
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      toast.dismiss("listening");
    };
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSearched(false);
  };

  return (
    <div className="text-white min-h-screen">
      <div className="fixed top-16 left-0 right-0 bg-black z-20 py-4 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative w-full flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="Search for videos..."
              className="w-full bg-gray-800 border-2 border-gray-700 text-white rounded-full py-3 pl-6 pr-24 text-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
            <div className="absolute right-0 top-0 h-full flex items-center pr-2 gap-2">
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-2 text-gray-400 hover:text-white"
                >
                  <IoMdClose size={24} />
                </button>
              )}
              <button
                type="button"
                onClick={handleMicSearch}
                className="relative w-10 h-10 flex items-center justify-center rounded-full overflow-hidden"
              >
                {isListening && (
                  <span className="absolute inset-1 rounded-full bg-green-500/80 animate-pulse"></span>
                )}
                {isListening ? (
                  <FaMicrophoneSlash size={18} className="relative z-10 text-gray-100" />
                ) : (
                  <FaMicrophone size={18} className="relative z-10 text-gray-400 hover:text-white" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="pt-[150px] px-4 md:px-8">
        {searched && !loading && results.length > 0 && (
          <h2 className="text-md text-gray-300 mb-2 ml-4">
            Showing {results.length} results for "{displayQuery}"
          </h2>
        )}
        {loading ? (
          <SearchSkeleton />
        ) : searched && results.length === 0 ? (
          <div className="text-center text-gray-400 mt-16">
            <h2 className="text-2xl">No results found for "{displayQuery}"</h2>
            <p className="mt-2">Try searching for something else.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
