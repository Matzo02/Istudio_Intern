import React, { useEffect, useState } from "react";
import { Navbar, Footer } from "../components";
import { useLocation } from "react-router-dom";

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
  const query = useQuery();
  const rawSearchTerm = query.get("q") || "";
  const searchTerm = rawSearchTerm.trim().toLowerCase();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Categories definitions
  const allowedCategories = [
    "fragrances",
    "makeup",
    "skincare",
    "mens-shirts",
    "mens-shoes",
    "womens-dresses",
    "womens-shoes",
    "sunglasses",
  ];

  const menCategories = ["mens-shirts", "mens-shoes"];
  const womenCategories = ["womens-dresses", "womens-shoes"];

  useEffect(() => {
    if (!searchTerm) {
      setProducts([]);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm)}`
        );
        const data = await res.json();

        // Determine categories filter based on exact word match of 'men' or 'women'
        const menRegex = /\bmen\b/;
        const womenRegex = /\bwomen\b/;

        let filteredCategories = allowedCategories;

        const hasMen = menRegex.test(searchTerm);
        const hasWomen = womenRegex.test(searchTerm);

        if (hasMen && !hasWomen) {
          filteredCategories = menCategories;
        } else if (hasWomen && !hasMen) {
          filteredCategories = womenCategories;
        }
        // else keep all allowed categories

        // Filter products by allowed categories first
        let filteredProducts = (data.products || []).filter((product) =>
          filteredCategories.includes(product.category)
        );

        // Additional filter: ensure product title or description matches search term loosely
        // This can improve accuracy if API returns loosely matching products
        filteredProducts = filteredProducts.filter((product) => {
          const title = product.title.toLowerCase();
          const desc = product.description.toLowerCase();

          // Match if searchTerm is inside title or description
          return title.includes(searchTerm) || desc.includes(searchTerm);
        });

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">
          Search Results for: <em>{rawSearchTerm || "..."}</em>
        </h2>
        {loading ? (
          <p>Loading products...</p>
        ) : !searchTerm ? (
          <p>Please enter a search term.</p>
        ) : products.length > 0 ? (
          <div className="row">
            {products.map((product) => (
              <div key={product.id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <img
                    src={product.images?.[0]}
                    className="card-img-top"
                    alt={product.title}
                    style={{ height: "300px", objectFit: "contain" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text">${product.price}</p>
                    <a
                      href={`/product/${product.id}`}
                      className="btn btn-outline-dark"
                    >
                      View Product
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No products found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;
