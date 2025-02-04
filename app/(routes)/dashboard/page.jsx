"use client";
import React, { useEffect, useState } from 'react';
import CardInfo from './_components/CardInfo';
import { db } from '@/utils/dbConfig';
import { useUser } from '@clerk/nextjs';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Transactions } from '@/utils/schema';
import BarchartDash from './_components/barchartDash';
import BudgetItem from './budgets/_components/budgetItem';
import TransactionList from './transactions/_components/TransactionList';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function Page() {
  const [budgetList, setBudgetList] = useState([]);
  const [listofTransactions, setTransactionList] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => { 
    user && getBudgets();
    getAllExpenses();
  }, [user]);

  const goToBudgets = () => {
    
    router.replace('/dashboard/budgets');
  }

  // Fetch all transactions belonging to the user
  const getAllExpenses = async () => {
    const result = await db
      .select({
        id: Transactions.id,
        name: Transactions.name,
        amount: Transactions.amount,
        createdAt: Transactions.createdAt,
      })
      .from(Budgets)
      .rightJoin(Transactions, eq(Budgets.id, Transactions.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(Transactions.id));
    setTransactionList(result);
  };

  // Fetch all budgets with total spend and total items (transactions)
  const getBudgets = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Transactions.amount})`.mapWith(Number),
        totalItem: sql`count(${Transactions.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Transactions, eq(Budgets.id, Transactions.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));
    setBudgetList(result);
  };

  return (
    <div className='p-5'>
      <h2 className='font-bold text-3xl'>Hi, {user?.username} 👋</h2>
      <p className='text-gray-500'>Here is your dashboard, visualize your budgets and transactions here.</p>
      <CardInfo budgetList={budgetList} />
      <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-5'>
        <div className='col-span-2'>
          <BarchartDash budgetList={budgetList} />
          <h2 className='font-bold text-lg'>Latest Transactions</h2>
          <TransactionList transactionList={listofTransactions} refreshData={() => getBudgets()} />
        </div>
        <div className='grid gap-5'>
          <h2 className='font-bold text-lg'>Latest Budgets</h2>
          {budgetList.map((budget, index) => (
            <BudgetItem budget={budget} key={index} />
          ))}
        </div>
      </div>

      {/* Conditional rendering for "Create New Budget" button on small mobile devices */}
      <div className='mt-6 md:hidden flex justify-center'> {/* Show only on small mobile devices */}
        <Button onClick={() => goToBudgets()} className='bg-primary text-white py-2 px-4 rounded shadow-md'>
          Create New Budget
        </Button>
      </div>
    </div>
  );
}

export default Page;
