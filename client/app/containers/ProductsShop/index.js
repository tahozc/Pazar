/**
 *
 * ProductsShop
 *
 */

import React, { Fragment } from "react";

import { connect } from "react-redux";

import actions from "../../actions";

import ProductList from "../../components/Store/ProductList";
import NotFound from "../../components/Common/NotFound";
import LoadingIndicator from "../../components/Common/LoadingIndicator";
import Recommendations from "../Recommendations";

class ProductsShop extends React.PureComponent {
  componentDidMount() {
    const slug = this.props.match.params.slug;
    this.props.filterProducts(slug);
  }

  render() {
    const {
      products,
      isLoading,
      authenticated,
      updateWishlist,

    } = this.props;

    const displayProducts = products && products.length > 0;


    return (
      <Fragment>
        <div className="products-shop">
          {isLoading && <LoadingIndicator />}
          {displayProducts && (
            <ProductList
              products={products}
              authenticated={authenticated}
              updateWishlist={updateWishlist}
            />
          )}
          {!isLoading && !displayProducts && (
            <NotFound message="No products found." />
          )}
        </div>
        <Recommendations />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    products: state.product.storeProducts,
    isLoading: state.product.isLoading,
    authenticated: state.authentication.authenticated,
  };
};

export default connect(mapStateToProps, actions)(ProductsShop);
