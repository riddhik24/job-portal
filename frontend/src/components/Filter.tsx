import { useState } from "react";
import { Search, MapPin, DollarSign } from "lucide-react";
import { useJobStore } from "../store/useJobStore";

export default function Filter() {
  const [searchParams, setSearchParams] = useState({
    title: "",
    location: "",
    salary: "",
  });

  const { fetchJobs } = useJobStore();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(searchParams);
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-12 gap-2 text-slate-900"
    >
      {/* Title / Keyword Search */}
      <div className="md:col-span-4 flex items-center bg-slate-100 dark:bg-slate-800/60 px-3 py-2.5 rounded-xl">
        <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Job title or keyword..."
          value={searchParams.title}
          onChange={(e) =>
            setSearchParams({ ...searchParams, title: e.target.value })
          }
          className="w-full bg-transparent text-sm focus:outline-none dark:text-white placeholder-slate-400"
        />
      </div>

      {/* Location Search */}
      <div className="md:col-span-3 flex items-center bg-slate-100 dark:bg-slate-800/60 px-3 py-2.5 rounded-xl">
        <MapPin className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Location (e.g. Remote)"
          value={searchParams.location}
          onChange={(e) =>
            setSearchParams({ ...searchParams, location: e.target.value })
          }
          className="w-full bg-transparent text-sm focus:outline-none dark:text-white placeholder-slate-400"
        />
      </div>

      {/* Salary Filter */}
      <div className="md:col-span-3 flex items-center bg-slate-100 dark:bg-slate-800/60 px-3 py-2.5 rounded-xl">
        <DollarSign className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
        <input
          type="number"
          placeholder="Min Salary (e.g. 50000)"
          value={searchParams.salary}
          onChange={(e) =>
            setSearchParams({ ...searchParams, salary: e.target.value })
          }
          className="w-full bg-transparent text-sm focus:outline-none dark:text-white placeholder-slate-400"
        />
      </div>

      {/* Search Button */}
      <div className="md:col-span-2">
        <button
          type="submit"
          className="w-full h-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center space-x-1 shadow-md shadow-indigo-600/20"
        >
          <span>Search</span>
        </button>
      </div>
    </form>
  );
}