import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CategoryService } from '@/services';
import { ok } from '@/helpers/response';
import { logger } from '@/config';

export class CategoryController {
  private categoryService: CategoryService;

  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  // Get paginated category list
  getCategoryList = async (req: Request, res: Response) => {
    logger.info('Get category list');
    const page = Number(req.query.page) || 1;
    const search = req.query.search as string | undefined;
    const data = await this.categoryService.getCategories(page, search);
    res.status(StatusCodes.OK).json(ok(data, 'Category List Retrieved.'));
  };

  // Get a single category by ID
  getCategoryById = async (req: Request, res: Response) => {
    logger.info('Get category by id');
    const { categoryId } = req.params;
    const data = await this.categoryService.getCategoryById(Number(categoryId));
    res.status(StatusCodes.OK).json(ok(data, 'Category Retrieved.'));
  };

  // Create a new category
  createCategory = async (req: Request, res: Response) => {
    logger.info('Create category');
    const body = req.body;
    const data = await this.categoryService.createCategory(body);
    res.status(StatusCodes.CREATED).json(ok(data, 'New Category Created.'));
  };

  // Update a category
  updateCategory = async (req: Request, res: Response) => {
    logger.info('Update category');
    const { categoryId } = req.params;
    const body = req.body;
    const data = await this.categoryService.updateCategory(Number(categoryId), body);
    res.status(StatusCodes.OK).json(ok(data, 'Successfully updated the category.'));
  };

  // Delete a category
  deleteCategory = async (req: Request, res: Response) => {
    logger.info('Delete category');
    const { categoryId } = req.params;
    const data = await this.categoryService.deleteCategory(Number(categoryId));
    res.status(StatusCodes.OK).json(ok(data, 'Category Deleted.'));
  };
}
