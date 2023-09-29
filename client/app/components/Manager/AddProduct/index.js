/**
 *
 * AddProduct
 *
 */

import React, { useState } from "react";

import { Row, Col } from "reactstrap";

import { ROLES } from "../../../constants";
import Input from "../../Common/Input";
import Switch from "../../Common/Switch";
import Button from "../../Common/Button";
import SelectOption from "../../Common/SelectOption";
import Select from "react-select";
const taxableSelect = [
  { value: 1, label: "Yes" },
  { value: 0, label: "No" },
];

const AddProduct = (props) => {
  const {
    user,
    productFormData,
    formErrors,
    productChange,
    addProduct,
    brands,
    image,
    categories,
    tags,
    isLoading,
  } = props;

  const handleSubmit = (event) => {
    event.preventDefault();
    addProduct();
  };

  return (
    <div className="add-product">
      <form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col xs="12" lg="6">
            <Input
              type={"text"}
              error={formErrors["sku"]}
              label={"Sku"}
              name={"sku"}
              placeholder={"Product Sku"}
              value={productFormData.sku}
              onInputChange={(name, value) => {
                productChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" lg="6">
            <Input
              type={"text"}
              error={formErrors["name"]}
              label={"Name"}
              name={"name"}
              placeholder={"Product Name"}
              value={productFormData.name}
              onInputChange={(name, value) => {
                productChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="12">
            Add Product
            <Input
              type={"textarea"}
              error={formErrors["description"]}
              label={"Description"}
              name={"description"}
              placeholder={"Product Description"}
              value={productFormData.description}
              onInputChange={(name, value) => {
                productChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" lg="6">
            <Input
              type={"number"}
              error={formErrors["quantity"]}
              label={"Quantity"}
              name={"quantity"}
              decimals={false}
              placeholder={"Product Quantity"}
              value={productFormData.quantity}
              onInputChange={(name, value) => {
                productChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" lg="6">
            <Input
              type={"number"}
              Add
              Product
              error={formErrors["price"]}
              label={"Price"}
              name={"price"}
              min={1}
              placeholder={"Product Price"}
              value={productFormData.price}
              onInputChange={(name, value) => {
                productChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="12">
            <SelectOption
              error={formErrors["taxable"]}
              label={"Taxable"}
              name={"taxable"}
              options={taxableSelect}
              value={productFormData.taxable}
              handleSelectChange={(value) => {
                productChange("taxable", value);
              }}
            />
          </Col>
          <Col xs="12" md="12">
            <SelectOption
              error={formErrors["category"]}
              name={"category"}
              label={"Select Category"}
              value={productFormData.category}
              options={categories}
              handleSelectChange={(value) => {
                productChange("category", value);
              }}
            />
          </Col>
          <Col xs="12" md="12">
            <SelectOption
              disabled={user.role === ROLES.Merchant}
              error={formErrors["brand"]}
              name={"brand"}
              label={"Select Brand"}
              value={
                user.role === ROLES.Merchant ? brands[1] : productFormData.brand
              }
              options={brands}
              handleSelectChange={(value) => {
                productChange("brand", value);
              }}
            />
          </Col>
          <Col xs="12" md="12">
            <SelectOption
              name={"tags"}
              label={"Enter Tags"}
              isCreateable={true}
              value={productFormData.selectedTags}
              options={tags}
              isMulti={true}
              handleSelectChange={(value) => {
                productChange("selectedTags", value);
              }}
              placeholder="Write Tags e.g black and press enter "
            />
          </Col>
          <Col xs="12" md="12">
            <Input
              type={"file"}
              error={formErrors["file"]}
              name={"image"}
              label={"file"}
              placeholder={"Please Upload Image"}
              value={image}
              onInputChange={(name, value) => {
                productChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="12" className="my-2">
            <Switch
              id={"active-product"}
              name={"isActive"}
              label={"Active?"}
              checked={productFormData.isActive}
              toggleCheckboxChange={(value) => productChange("isActive", value)}
            />
          </Col>
        </Row>
        <hr />

        <div className="add-product-actions">
          <Button type="submit" text="Add Product" disabled={isLoading} />
        </div>
      </form>
    </div>
  );
};

export default AddProduct;