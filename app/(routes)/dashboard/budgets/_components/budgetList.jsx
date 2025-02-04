"use client";
import React, { useEffect, useState } from 'react'
import CreateBudget from './createBudget'
import { db } from '@/utils/dbConfig'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { Budgets, Transactions } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import BudgetItem from './budgetItem'


function budgetList() {

  const [budgetList, setBudgetList] = useState([]);


  const {user} = useUser();
  useEffect(() => { 
    user&&getBudgets();
  },[user])
  /**
   * Get all budgets with total spend and total item
   */
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
    <div className='mt-7'>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
    <CreateBudget refreshData={() => getBudgets()}/>
    {budgetList?.length>0? budgetList.map((budget,index) => (
      <BudgetItem key={index} budget={budget}/>
    )
    ):[1,2,3,4,5].map((item,index) => (
      <div key={index} className='w-full bg-slate-200 rounded-lg h-[150px] animate-pulse'>

      </div>

    ))}
    </div>
        
    </div>
  )
}

export default budgetList