import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CategoryService } from '@/services';
import { ok } from '@/helpers/response';
import { logger } from '@/config';

export const CategoryController = {
  getCategoryList: async (req: Request, res: Response) => {
    logger.info('Get category list');
    const page = Number(req.query.page) || 1;

    const data = await CategoryService.getCategories(page);
    res.status(StatusCodes.OK).json(ok(data, 'Category List Retrieved.'));
  },

  getCategoryById: async (req: Request, res: Response) => {
    logger.info('Get category by id');
    const { categoryId } = req.params;
    const data = await CategoryService.getCategoryById(Number(categoryId));
    res.status(StatusCodes.OK).json(ok(data, 'Category Retrieved.'));
  },

  createCategory: async (req: Request, res: Response) => {
    logger.info('Create category');
    const body = req.body;
    const data = await CategoryService.createCategory(body);
    res.status(StatusCodes.CREATED).json(ok(data, 'New Category Created.'));
  },

  updateCategory: async (req: Request, res: Response) => {
    logger.info('Update category');
    const { categoryId } = req.params;
    const body = req.body;
    const data = await CategoryService.updateCategory(Number(categoryId), body);
    res.status(StatusCodes.OK).json(ok(data, 'Successfully updated the category.'));
  },

  deleteCategory: async (req: Request, res: Response) => {
    logger.info('Delete category');
    const { categoryId } = req.params;
    const data = await CategoryService.deleteCategory(Number(categoryId));
    res.status(StatusCodes.OK).json(ok(data, 'Category Deleted.'));
  },
};
