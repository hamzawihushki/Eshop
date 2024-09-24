const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      minlength: [3, "Product title must be at least 3 characters long"],
      maxlength: [100, "Product title must be at most 100 characters long"],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [
        10,
        "Product description must be at least 10 characters long",
      ],
      maxlength: [
        500,
        "Product description must be at most 500 characters long",
      ],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      max: [300000, "Product price must be at most 32 long"],
      trim: true,
    },
    priceAfterDiscount: {
      type: Number,
      default: 0,
      min: [0, "Product price after discount must be a positive number"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      min: [0, "Product quantity must be a positive number"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    colors: [String],
    coverImage: {
      type: String,
      required: [true, "Product cover image is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a category"],
    },
    subcategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: [0, "Rating average must be a positive number"],
      max: [5, "Rating average must be a number between 0 and 5"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });

  next();
});
const setImageURL = (doc) => {
  if (doc.coverImage) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.coverImage}`;
    doc.coverImage = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imagesList.push(imageUrl);
    });
    doc.images = imagesList;
  }
};
// findOne, findAll and update
productSchema.post("init", (doc) => {
  setImageURL(doc);
});

// create
productSchema.post("save", (doc) => {
  setImageURL(doc);
});
// Customize the toJSON method to include full image URLs
const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
