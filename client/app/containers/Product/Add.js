/*
 *
 * Add
 *
 */

import React from "react";

import { connect } from "react-redux";

import actions from "../../actions";

import AddProduct from "../../components/Manager/AddProduct";
import SubPage from "../../components/Manager/SubPage";

class Add extends React.PureComponent {
  componentDidMount() {
    this.props.fetchBrandsSelect();
    this.props.fetchStoreCategories();
    this.props.fetchTags();
  }

  render() {
    const {
      history,
      user,
      productFormData,
      formErrors,
      brands,
      productChange,
      addProduct,
      categories,
      uniqueTags,
      isLoading
    } = this.props;

    return (
      <SubPage
        title="Add Product"
        actionTitle="Cancel"
        handleAction={() => history.goBack()}
      >
        <AddProduct
          user={user}
          productFormData={productFormData}
          formErrors={formErrors}
          brands={brands}
          productChange={productChange}
          addProduct={addProduct}
          categories={categories}
          tags={uniqueTags}
          isLoading={isLoading}
        />
      </SubPage>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.account.user,
    productFormData: state.product.productFormData,
    formErrors: state.product.formErrors,
    brands: state.brand.brandsSelect,
    categories: state.category.categoriesSelect,
    uniqueTags: state.product.uniqueTags,
    isLoading: state.product.isAddProductLoading,
  };
};

export default connect(mapStateToProps, actions)(Add);
