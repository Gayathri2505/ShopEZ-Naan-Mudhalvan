import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Products from './Products';

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    if (query) {
      const fetchSearchResults = async () => {
        setLoading(true);
        setError(null); // Reset error state
        try {
          const response = await axios.get(`http://localhost:3001/api/search?query=${query}`); 
          setSearchResults(response.data); // endpoint returns an array of products
        } catch (error) {
          console.error("Error fetching search results:", error);
          setError("Error fetching search results. Please try again later."); // Set error message for UI
        } finally {
          setLoading(false);
        }
      };

      fetchSearchResults(); 
    }
  }, [query]); 

  return (
    <div>
      <h4>Search Results for "{query}"</h4>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>} 
      {!loading && !error && (
        searchResults.length > 0 ? (
          <Products products={searchResults} /> // Pass search results
        ) : (
          <p>No results found.</p>
        )
      )}
    </div>
  );
};

export default SearchResults;
