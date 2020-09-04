import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;

  type: 'income' | 'outcome';

  value: number;

  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('You have not enought balance');
    }

    let categoryVerification = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categoryVerification) {
      categoryVerification = categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(categoryVerification);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: categoryVerification,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
