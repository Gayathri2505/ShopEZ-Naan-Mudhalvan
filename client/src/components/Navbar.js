import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/Common/Navbar.css";

function Navbar() {
  const { user, logout, cartCount, updateCartCount } = useContext(AuthContext);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleClickOutside = (event) => {
    if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
      setIsProfileMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdmin = user && user.usertype === "admin";

  useEffect(() => {
    updateCartCount();
  }, [user, updateCartCount]);

  return (
    <nav className="navbar">
      <h2 className="brand">
        <Link to={isAdmin ? "/admin" : "/"} className="brand-link">
          {isAdmin ? "ShopEZ Admin" : "ShopEZ"}
        </Link>
      </h2>
      {!isAdmin && (
        <form onSubmit={handleSearchSubmit} className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search"
          />
          <button type="submit" className="search-button">
            <i className="fas fa-search" aria-hidden="true"></i>
            <span className="visually-hidden">Search</span>
          </button>
        </form>
      )}
      <ul className="nav-links">
        {user ? (
          <>
            <li className="profile-icon">
              <button
                onClick={toggleProfileMenu}
                aria-expanded={isProfileMenuOpen}
                aria-controls="profile-menu"
              >
                <i className="fas fa-user-circle" aria-hidden="true"></i>
              </button>
              {isProfileMenuOpen && (
                <div
                  id="profile-menu"
                  ref={profileMenuRef}
                  className={`profile-menu ${isProfileMenuOpen ? "open" : ""}`}
                  aria-hidden={!isProfileMenuOpen}
                >
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => navigate("/admin")}
                        className="menu-item"
                      >
                        Admin Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="menu-item logout-button"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate("/profile")}
                        className="menu-item"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="menu-item logout-button"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </li>

            {/* Wishlist Icon - Only visible for customers */}
            {!isAdmin && (
              <li className="wishlist-icon-nav">
                <Link to="/wishlist">
                  <i className="fas fa-heart" aria-hidden="true"></i>
                </Link>
              </li>
            )}
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}

        {/* Cart Icon - Visible only for non-admin users */}
        {!isAdmin && (
          <li className="cart-icon">
            <Link to="/cart">
              <i className="fas fa-shopping-cart" aria-hidden="true"></i>
              <span className="cart-count-badge">{cartCount}</span>
            </Link>
          </li>
        )}

      </ul>
    </nav>
  );
}

export default Navbar;
