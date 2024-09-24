const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand name is required"],
      unique: [true, "brand name already exists"],
      minlength: [2, "brand name must be at least 2 characters long"],
      maxlength: [50, "brand name must be at most 50 characters long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const imageUrl = (doc) => {
  if (doc.image) {
    const imageName = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageName;
  }
};
// findAll findOne Updates
brandSchema.post("init", (doc) => imageUrl(doc));
brandSchema.post("save", (doc) => imageUrl(doc));

const BrandModel = mongoose.model("Brand", brandSchema);

module.exports = BrandModel;
