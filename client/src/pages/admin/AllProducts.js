import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import ProductFilters from '../../components/ProductFilters';
import '../../styles/Admin/AllProducts.css';

const AllProducts = () => {

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {

    await axios.get('http://localhost:3001/api/products/fetch-products').then(
      (response) => {
        setProducts(response.data);
        setVisibleProducts(response.data);
      }
    )
    await axios.get('http://localhost:3001/api/products/fetch-categories').then(
      (response) => {
        setCategories(response.data);
      }
    )
  }

  const [sortFilter, setSortFilter] = useState('popularity');
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [genderFilter, setGenderFilter] = useState([]);


  const handleCategoryCheckBox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCategoryFilter([...categoryFilter, value]);
    } else {
      setCategoryFilter(categoryFilter.filter(size => size !== value));
    }
  }

  const handleGenderCheckBox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setGenderFilter([...genderFilter, value]);
    } else {
      setGenderFilter(genderFilter.filter(size => size !== value));
    }
  }

  const handleSortFilterChange = (e) => {
    const value = e.target.value;
    setSortFilter(value);
    if (value === 'low-price') {
      setVisibleProducts(visibleProducts.sort((a, b) => a.price - b.price))
    } else if (value === 'high-price') {
      setVisibleProducts(visibleProducts.sort((a, b) => b.price - a.price))
    } else if (value === 'discount') {
      setVisibleProducts(visibleProducts.sort((a, b) => b.discount - a.discount))
    }
  }

  useEffect(() => {
    if (categoryFilter.length > 0 && genderFilter.length > 0) {
      setVisibleProducts(products.filter(product => categoryFilter.includes(product.category) && genderFilter.includes(product.gender)));
    } else if (categoryFilter.length === 0 && genderFilter.length > 0) {
      setVisibleProducts(products.filter(product => genderFilter.includes(product.gender)));
    } else if (categoryFilter.length > 0 && genderFilter.length === 0) {
      setVisibleProducts(products.filter(product => categoryFilter.includes(product.category)));
    } else {
      setVisibleProducts(products);
    }
  }, [categoryFilter, genderFilter])


  return (
    <div >
      <div className="all-products-page-content">
      <div className="all-products-container">
        <ProductFilters
          categories={categories}
          categoryFilter={categoryFilter}
          genderFilter={genderFilter}
          sortFilter={sortFilter}
          handleCategoryCheckBox={handleCategoryCheckBox}
          handleGenderCheckBox={handleGenderCheckBox}
          handleSortFilterChange={handleSortFilterChange}
        />

        <div className="all-products-body">
          <h3>All Products</h3>
          <div className="all-products">

            {visibleProducts.map((product) => {
              return (
                <div className='all-product-item' key={product._id}>
                  <div className="all-product">
                    <img src={product.mainImg} alt="" />
                    <div className="all-product-data">
                      <h6>{product.title}</h6>
                      <p>{product.description.slice(0, 30) + '....'}</p>
                      <h5>&#8377; {parseInt(product.price - (product.price * product.discount) / 100)} <s>{product.price}</s><p>( {product.discount}% off)</p></h5>
                    </div>
                    <button onClick={() => navigate(`/update-product/${product._id}`)}>Update</button>
                  </div>
                </div>
              )
            })}

          </div>
        </div>
      </div>

      
    </div>
    <Footer/>
    </div>
    
  )
}

export default AllProducts;