const express = require("express");
const router = express.Router();
const Product = require("../../models/product");
const Review = require("../../models/review");
const WishList = require("../../models/wishlist");
const { ObjectId } = require("mongodb");
const auth = require("../../middleware/auth");
const sharedAccess = require("../../middleware/sharedAccess");

router.post("/", sharedAccess, async (req, res) => {
  try {
    const { productsClicked, cartItemsIds } = req.body;

    const user = req.user;

    // Array of Products which were clicked
    let productIdArray =
      productsClicked === "" ? [] : productsClicked.split(",");
    // Items that were added to Cart
    let cartItemsIdsArray = cartItemsIds === "" ? [] : cartItemsIds.split(",");
    const excludedCartProductIds = cartItemsIdsArray.map((id) => ObjectId(id));
    // Items that were added to Cart
    let excludedReviewProductIds = [];

    // Used to keep track of merged products from reviews,whishlist,clicked
    const mergedMap = new Map();
    // Check if user has logged in
    if (user) {
      const userId = ObjectId(user._id);
      const isRecommendReview =
        process.env.RECOMMEND_BASED_ON_REVIEWS === "true";
      const isRecommendWhishList =
        process.env.RECOMMEND_BASED_ON_WHISHLIST === "true";
      if (isRecommendReview) {
        // Get Product Ratings
        const productReviews = await Review.find({
          user: userId,
        });
        // Get Whishlist in correct Format
        const productReviewItems = productReviews.map((reviewItem) => {
          const _productId = ObjectId(reviewItem.product);
          excludedReviewProductIds.push(_productId);
          return {
            productId: _productId,
            value: reviewItem.rating,
          };
        });
        productReviewItems.forEach(({ productId, value }) => {
          if (!mergedMap.has(productId)) {
            mergedMap.set(productId, { productId, value });
          }
        });
      }
      if (isRecommendWhishList) {
        // Get Whishlisted Products
        const userWhishlist = await WishList.find({
          user: userId,
          isLiked: true,
        });

        // Get Whishlisted Array of Objects
        const productWhishListItems = userWhishlist.map((whishlistItem) => {
          return { productId: ObjectId(whishlistItem.product), value: 3 };
        });

        // Add productWhishListItems to the map
        productWhishListItems.forEach(({ productId, value }) => {
          if (!mergedMap.has(productId)) {
            mergedMap.set(productId, { productId, value });
          }
        });
      }
    }

    // Merged Excluded Product Ids
    const excludeProductIds = [
      ...excludedCartProductIds,
      ...excludedReviewProductIds,
    ];

    // Initialize an array to store valid clicked ratings
    let clickedRatings = [];

    // Count occurrences of each product ID
    let productIdCountMap = productIdArray.reduce((countMap, productId) => {
      countMap[productId] = (countMap[productId] || 0) + 1;
      return countMap;
    }, {});

    // Convert the count map to the desired format
    for (let productId in productIdCountMap) {
      try {
        const validObjectId = new ObjectId(productId); // Attempt to create ObjectId
        clickedRatings.push({
          productId: validObjectId,
          value: productIdCountMap[productId],
        });
      } catch (error) {}
    }

    // --------- Merge the Clicked Products,Whishlist and Reviews ---------

    // Add userRatings to the map if the productId is not already in the map
    clickedRatings.forEach(({ productId, value }) => {
      if (!mergedMap.has(productId)) {
        mergedMap.set(productId, { productId, value });
      }
    });

    // Convert the merged map back to an array
    const userRatings = Array.from(mergedMap.values());

    // Recommended Enviroment Variables
    const numberofRecommendedItems =
      process.env.NUMBER_OF_RECOMMENDED_ITEMS || 4;
    let isRecommendBrand = process.env.RECOMMEND_BASED_ON_BRAND === "true";
    let isRecommendCategory =
      process.env.RECOMMEND_BASED_ON_CATEGORY === "true";
    //  Get User Ratings

    // Get Each Product With Brand Name
    const products = await Product.aggregate([
      {
        $match: {
          _id: { $nin: excludeProductIds },
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brandInfo",
        },
      },
      {
        $unwind: {
          path: "$brandInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: {
          path: "$categoryInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          price: 1,
          isActive: 1,
          tags: 1,
          brand: "$brandInfo",
          category: "$categoryInfo",
        },
      },
    ]);
    // Get all Tags for every roduct

    let tags = products.reduce((allTags, product) => {
      const productTags = product.tags || [];
      const productBrandName = product.brand.name.toString().toLowerCase();
      const productCategoryName = product.category.name
        .toString()
        .toLowerCase();
      if (isRecommendBrand && isRecommendCategory) {
        return allTags.concat([
          ...productTags,
          productBrandName,
          productCategoryName,
        ]);
      } else if (isRecommendBrand) {
        return allTags.concat([...productTags, productBrandName]);
      } else if (isRecommendCategory) {
        return allTags.concat([...productTags, productCategoryName]);
      } else {
        return allTags.concat([...productTags]);
      }
    }, []);

    // // Generate Unique Tags
    let uniqueTags = Array.from(new Set(tags));
    // // Generate a Product Id array
    let productIds = userRatings.map((rating) => rating.productId);
    // Products that user has rated
    let userRatedProducts = await Product.aggregate([
      {
        $match: {
          _id: { $in: productIds.map((id) => ObjectId(id)) },
        },
      },
      {
        $lookup: {
          from: "brands", // Collection name for the Brand model
          localField: "brand",
          foreignField: "_id",
          as: "brandInfo",
        },
      },
      {
        $unwind: {
          path: "$brandInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: {
          path: "$categoryInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          userRating: {
            $arrayElemAt: [
              {
                $filter: {
                  input: userRatings,
                  as: "rating",
                  cond: { $eq: ["$$rating.productId", "$_id"] },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $project: {
          name: 1,
          price: 1,
          isActive: 1,
          tags: 1,
          brand: "$brandInfo", // Embed brand object
          userRating: 1,
          category: "$categoryInfo",
        },
      },
    ]);
    //  2D Weighted Matrix
    let weightedTagsMatrix = {};
    // User Profile Sum
    let uniqueTagsLength = uniqueTags.length;
    const userProfileSum = new Array(uniqueTagsLength).fill(0);
    // Run for Each User Rated Producted
    for (let i = 0; i < userRatedProducts.length; i++) {
      const currentProductId = userRatedProducts[i]._id.toString();
      weightedTagsMatrix[currentProductId] = {};
      let currentProductTags = userRatedProducts[i].tags || [];
      let ratingforProduct = userRatedProducts[i].userRating.value;

      // Run through Each unique Tag
      for (let j = 0; j < uniqueTags.length; j++) {
        let currentTag = uniqueTags[j];
        // Check if System Recommend Brand
        if (isRecommendBrand) {
          let brandName = userRatedProducts[i].brand.name
            .toString()
            .toLowerCase();
          // Check for Brand
          if (brandName === currentTag) {
            weightedTagsMatrix[currentProductId][currentTag] = ratingforProduct;
            userProfileSum[j] += ratingforProduct;
            continue;
          }
        }
        // Check if System Recommend Category
        if (isRecommendCategory) {
          let categoryName = userRatedProducts[i].category.name
            .toString()
            .toLowerCase();
          // Check for Brand
          if (categoryName === currentTag) {
            weightedTagsMatrix[currentProductId][currentTag] = ratingforProduct;
            userProfileSum[j] += ratingforProduct;
            continue;
          }
        }

        // Check for Tags
        let tagMatrixValue = currentProductTags.includes(currentTag) ? 1 : 0;
        let weightValue = tagMatrixValue * ratingforProduct;
        weightedTagsMatrix[currentProductId][currentTag] = weightValue;
        // Get Sum of Tags
        userProfileSum[j] += weightValue;
      }
    }
    // Get sum of user Profile
    const totalUserProfileSum = userProfileSum.reduce(
      (acc, curr) => acc + curr,
      0
    );
    // Create Aggregated User Profile Array
    let aggregateUserProfiles = userProfileSum.map((userProfile) => {
      let result = (userProfile / totalUserProfileSum).toFixed(2);
      return parseFloat(result);
    });
    // ---------- Building the Potential Canidate Profiles ----------
    // Canidate 2D Matrix
    let canidatesTagsMatrix = {};
    // User Profile Sum
    const canidateProfileSum = {};
    // Create a User Rating Ids of String
    let productStrIds = userRatings.map((rating) =>
      rating.productId.toString()
    );
    // Run for Each Canidated Product
    for (let i = 0; i < products.length; i++) {
      const canidateProductId = products[i]._id.toString();

      //   Skip Loop if the Product is User Rated
      if (productStrIds.includes(canidateProductId)) continue;
      canidatesTagsMatrix[canidateProductId] = {};
      let canidateProductTags = products[i].tags || [];
      canidateProfileSum[canidateProductId] = [];
      // Run through Each unique Tag
      for (let j = 0; j < uniqueTags.length; j++) {
        let canidateCurrentTag = uniqueTags[j];
        let canidateAgregateValue = aggregateUserProfiles[j];
        let canidateBrandName = products[i].brand.name.toString().toLowerCase();
        let canidateCategoryName = products[i].category.name
          .toString()
          .toLowerCase();
        // Check for Brand
        if (isRecommendBrand) {
          if (canidateBrandName === canidateCurrentTag) {
            canidateProfileSum[canidateProductId].push(canidateAgregateValue);
            continue;
          }
        }

        // Check for Category
        if (isRecommendCategory) {
          if (canidateCategoryName === canidateCurrentTag) {
            canidateProfileSum[canidateProductId].push(canidateAgregateValue);
            continue;
          }
        }

        // Check for Tags
        let canidateTagMatrixValue = canidateProductTags.includes(
          canidateCurrentTag
        )
          ? 1
          : 0;
        let canidateWeightValue =
          canidateTagMatrixValue * canidateAgregateValue;
        canidateProfileSum[canidateProductId].push(canidateWeightValue);
      }
      //   Sum Entire Row and save in sum Object
      canidateProfileSum[canidateProductId] = canidateProfileSum[
        canidateProductId
      ].reduce((acc, curr) => acc + curr, 0);
    }
    // Create an array which has other arrays in it with key,value pairs [ [key,value] ]
    const canidateProfileSumArray = Object.entries(canidateProfileSum);

    // Sort the array based on values in descending order
    canidateProfileSumArray.sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));

    // Determine the number of entries to retrieve incase the items are less
    const numEntriesToRetrieve = Math.min(
      canidateProfileSumArray.length,
      numberofRecommendedItems
    );

    // Extract the highest entries
    const highestIds = canidateProfileSumArray
      .slice(0, numEntriesToRetrieve)
      .map((entry) => entry[0]);
    // Get Products which have highest Aggregate
    const recommendedProducts = await Product.aggregate([
      {
        $match: {
          _id: { $in: highestIds.map((id) => ObjectId(id)) },
        },
      },
      {
        $lookup: {
          from: "brands", // Replace 'brands' with the actual name of the Brand collection
          localField: "brand", // Assuming 'brand' is the field storing the brand foreign id in the Product collection
          foreignField: "_id",
          as: "brand",
        },
      },
      {
        $unwind: "$brand", // If you expect only one brand per product
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "product",
          as: "reviews",
        },
      },
      {
        $addFields: {
          totalRatings: { $sum: "$reviews.rating" },
          totalReviews: { $size: "$reviews" },
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: [
              { $eq: ["$totalReviews", 0] },
              0,
              { $divide: ["$totalRatings", "$totalReviews"] },
            ],
          },
        },
      },
    ]);
    // Sort Products based on highest aggregate
    const sortedRecommendedProducts = highestIds.map((id) =>
      recommendedProducts.find((product) => product._id.toString() === id)
    );

    res.status(200).json({
      recommendedProducts: sortedRecommendedProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

router.get("/", sharedAccess, async (req, res) => {
  try {
    const user = req.user;
    let userObj;
    if (user) {
      userObj = user;
    } else {
      userObj = "not defiend";
    }
    res.json({ user: userObj });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

module.exports = router;
