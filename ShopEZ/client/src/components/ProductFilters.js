import React from 'react';
import '../styles/Common/ProductFilters.css';

const ProductFilters = ({
    categories,
    categoryFilter,
    genderFilter,
    sortFilter,
    handleCategoryCheckBox,
    handleGenderCheckBox,
    handleSortFilterChange,
    clearFilters, // Add a new prop for clearing filters
}) => {
    return (
        <div className="products-filter">
            <div className="filter-header">
                <h4>Filters</h4>
                <span className="clear-filters" onClick={clearFilters}>
                <i className="fa-solid fa-filter clear-icon"></i>  Clear Filters
                </span>
            </div>
            <div className="product-filters-body">

                {/* Sort Filter */}
                <div className="filter-sort">
                    <h6><i className="fa fa-sort"></i> Sort By</h6>
                    <div className="filter-sort-body sub-filter-body">

                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio1" value="popularity" checked={sortFilter === 'popularity'} onChange={handleSortFilterChange} />
                            <label className="form-check-label" htmlFor="filter-sort-radio1">
                                Popular
                            </label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio2" value="low-price" checked={sortFilter === 'low-price'} onChange={handleSortFilterChange} />
                            <label className="form-check-label" htmlFor="filter-sort-radio2">
                                Price (low to high)
                            </label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio3" value="high-price" checked={sortFilter === 'high-price'} onChange={handleSortFilterChange} />
                            <label className="form-check-label" htmlFor="filter-sort-radio3">
                                Price (high to low)
                            </label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio4" value="discount" checked={sortFilter === 'discount'} onChange={handleSortFilterChange} />
                            <label className="form-check-label" htmlFor="filter-sort-radio4">
                                Discount
                            </label>
                        </div>

                    </div>
                </div>

                {/* Category Filter */}
                {categories.length > 0 && (
                    <div className="filter-categories">
                        <h6><i className="fa fa-tags"></i> Categories</h6>
                        <div className="filter-categories-body sub-filter-body">
                            {categories.map((category) => (
                                <div className="form-check" key={category}>
                                    <input className="form-check-input" type="checkbox" value={category} id={'productCategory' + category} checked={categoryFilter.includes(category)} onChange={handleCategoryCheckBox} />
                                    <label className="form-check-label" htmlFor={'productCategory' + category}>
                                        {category}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Gender Filter */}
                <div className="filter-gender">
                    <h6><i className="fa fa-venus-mars"></i> Gender</h6>
                    <div className="filter-gender-body sub-filter-body">

                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="Men" id="filter-gender-check-1" checked={genderFilter.includes('Men')} onChange={handleGenderCheckBox} />
                            <label className="form-check-label" htmlFor="filter-gender-check-1">
                                Men
                            </label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="Women" id="filter-gender-check-2" checked={genderFilter.includes('Women')} onChange={handleGenderCheckBox} />
                            <label className="form-check-label" htmlFor="filter-gender-check-2">
                                Women
                            </label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="Unisex" id="filter-gender-check-3" checked={genderFilter.includes('Unisex')} onChange={handleGenderCheckBox} />
                            <label className="form-check-label" htmlFor="filter-gender-check-3">
                                Unisex
                            </label>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductFilters;
