import { Router } from 'express';
import { TransactionService } from '@/services/transaction';
import { TransactionController } from '@/controllers/transaction.controller';
import { BranchService, CategoryService, ProductService } from '@/services';

const transactionRoute = Router();

const categoryService = new CategoryService();
const branchService = new BranchService();
const productService = new ProductService(categoryService, branchService);
const transactionService = new TransactionService(productService);
const transactionController = new TransactionController(transactionService);

transactionRoute.post('/', transactionController.createTransaction.bind(transactionController));
transactionRoute.get('/', transactionController.getTransactions.bind(transactionController));

export { transactionRoute };
