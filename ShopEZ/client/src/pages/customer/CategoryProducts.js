import React from 'react'
import { useParams } from 'react-router-dom'
import Footer from '../../components/Footer'
import Products from '../../components/Products'
import '../../styles/Customer/CategoryProducts.css'

const CategoryProducts = () => {

  const {category} = useParams();

  return (
    <div className="categoryProducts-page">

    <h3 className="categoryProducts-page-title">{category}</h3>

    <Products category={category} />
    <Footer/>
    </div>
  )
}

export default CategoryProducts;