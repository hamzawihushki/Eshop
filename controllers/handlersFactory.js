const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const AppError = require("../utils/apiError");
const ApiFeature = require("../utils/apiFeatures");

exports.get = (modal) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }
    const documentsCount = await modal.countDocuments();
    const ApiFeatures = new ApiFeature(modal.find(filter), req.query)
      .filter()
      .sort()
      .search()
      .fields()
      .paginate(documentsCount);

    const { pagination, mongooseQuery } = ApiFeatures;

    const categories = await mongooseQuery;
    res
      .status(200)
      .json({ result: categories.length, pagination, data: categories });
  });

exports.delete = (Modal) =>
  asyncHandler(async (req, res, next) => {
    // Delete a document by ID
    const document = await Modal.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(
        new AppError(`document not found with id ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      data: null,
      message: "document deleted successfully.",
    });
  });

exports.update = (Modal) =>
  asyncHandler(async (req, res, next) => {
    // Update an existing document

    const document = await Modal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new AppError(`document not found with id ${req.params.id}`, 404)
      );
    }
    res
      .status(200)
      .json({ data: document, message: "document updated successfully." });
  });

exports.create = (Model) =>
  asyncHandler(async (req, res) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({ data: newDoc });
  });

exports.getById = (Modal, populateOpt) =>
  asyncHandler(async (req, res, next) => {
    let query = Modal.findById(req.params.id);
    if (populateOpt) {
      query = query.populate(populateOpt);
    }
    const document = await query;
    if (!document) {
      return next(new AppError("document not found.", 404));
    }
    res.status(200).json({ data: document });
  });
