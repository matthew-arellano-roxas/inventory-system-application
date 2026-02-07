import { StatusCodes } from 'http-status-codes';
import { categoryService } from '@/services';
import { ok } from '@/helpers/response';
import { Controller } from '@/types/controller.type';

// Get paginated category list
const getCategoryList: Controller = async (req, res, _next) => {
  const page = Number(req.query.page) || 1;
  const search = req.query.search as string | undefined;
  const data = await categoryService.getCategories(page, search);
  res.status(StatusCodes.OK).json(ok(data, 'Category List Retrieved.'));
};

// Get a single category by ID
const getCategoryById: Controller = async (req, res, _next) => {
  const { categoryId } = req.params;
  const data = await categoryService.getCategoryById(Number(categoryId));
  res.status(StatusCodes.OK).json(ok(data, 'Category Retrieved.'));
};

// Create a new category
const createCategory: Controller = async (req, res, _next) => {
  const body = req.body;
  const data = await categoryService.createCategory(body);
  res.status(StatusCodes.CREATED).json(ok(data, 'New Category Created.'));
};

// Update a category
const updateCategory: Controller = async (req, res, _next) => {
  const { categoryId } = req.params;
  const body = req.body;
  const data = await categoryService.updateCategory(Number(categoryId), body);
  res.status(StatusCodes.OK).json(ok(data, 'Successfully updated the category.'));
};

// Delete a category
const deleteCategory: Controller = async (req, res, _next) => {
  const { categoryId } = req.params;
  const data = await categoryService.deleteCategory(Number(categoryId));
  res.status(StatusCodes.OK).json(ok(data, 'Category Deleted.'));
};

export const categoryController = {
  getCategoryList,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
