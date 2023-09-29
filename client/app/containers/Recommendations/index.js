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
import { NUMBER_OF_CLICKS } from "../../constants";

class Recommendations extends React.PureComponent {
  componentDidMount() {
    this.getRecommendations();
  }
  componentDidUpdate(prevProps) {
    if (this.props.productId !== prevProps.productId) {
      this.getRecommendations();
    }
  }

  async getRecommendations() {
    const productId = this.props.productId;
    if (productId) {
      await this.addProductIdToLocalStorage(productId);
    }
    this.props.fetchRecommendations();
  }

  addProductIdToLocalStorage = (id) => {
    if (id) {
      const productId = id.toString();
      const numberOfClicksValue = NUMBER_OF_CLICKS;
      const numberOfClicksKey = "number-of-clicks";
      const itemCountKey = "item-count";
      localStorage.setItem(numberOfClicksKey, numberOfClicksValue);
      let itemCountValue = localStorage.getItem(itemCountKey);
      if (itemCountValue === null || itemCountValue >= numberOfClicksValue) {
        localStorage.setItem(itemCountKey, 0);
      }
      itemCountValue = localStorage.getItem(itemCountKey);
      const currentItemKey = `item-${itemCountValue}`;
      localStorage.setItem(currentItemKey, productId);
      let newCountValue = parseInt(itemCountValue) + 1;
      localStorage.setItem(itemCountKey, newCountValue);
    }
  };

  render() {
    const {
      authenticated,
      updateWishlist,
      recommendedProducts,
      isRecommendLoading,
    } = this.props;

    const displayRecommendedProducts =
      recommendedProducts && recommendedProducts.length > 0;

    return (
      <Fragment>
        <div>
          <h5 className="card my-3 p-3 max-content-width">
            Recommendations for you:
          </h5>
          {isRecommendLoading && <LoadingIndicator />}
          {displayRecommendedProducts && (
            <ProductList
              products={recommendedProducts}
              authenticated={authenticated}
              updateWishlist={updateWishlist}
            />
          )}
          {!isRecommendLoading && !displayRecommendedProducts && (
            <NotFound message="No Recommendations at the moment" />
          )}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    recommendedProducts: state.product.recommendedProducts,
    isRecommendLoading: state.product.isRecommendLoading,
    authenticated: state.authentication.authenticated,
  };
};

export default connect(mapStateToProps, actions)(Recommendations);
