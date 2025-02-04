"use client";   
import React, { useEffect, useState } from 'react'
import TransactionList from './_components/TransactionList'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Transactions } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbConfig';

function page() {
    const [listofTransactions, setTransactionList] = useState([]);
    const [budgetList, setBudgetList] = useState([]);
    const {user} = useUser();
    useEffect(() => { 
        user&&getBudgets();
        getAllExpenses();
      },[user])
    
    const getAllExpenses = async () => {
        const result = await db.select({
          id:Transactions.id,
          name:Transactions.name,
          amount:Transactions.amount,
          createdAt:Transactions.createdAt,
        }).from(Budgets)
        .rightJoin(Transactions, eq(Budgets.id,Transactions.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(Transactions.id));
        setTransactionList(result);
       
      }
    const getBudgets = async () => {
        const result = await db.select({
          ...getTableColumns(Budgets),
          totalSpend:sql `sum(${Transactions.amount})`.mapWith(Number),
          totalItem:sql `count(${Transactions.id})`.mapWith(Number)
        }).from(Budgets)
        .leftJoin(Transactions, eq(Budgets.id,Transactions.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .groupBy(Budgets.id).orderBy(desc(Budgets.id));
        
        setBudgetList(result);
        
      }
  return (
    <div className='p-5'>
        <h2 className='font-bold text-lg'>Latest Transactions</h2>
        <TransactionList transactionList={listofTransactions} refreshData={() => getBudgets()}/>
    </div>
  )
}

export default page