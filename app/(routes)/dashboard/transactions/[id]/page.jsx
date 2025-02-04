"use client";
import { db } from '@/utils/dbConfig';
import { Budgets, Transactions  } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { eq, sql, getTableColumns, desc } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import BudgetItem from '../../budgets/_components/budgetItem';
import AddExpense from '../_components/AddExpense';
import TransactionList from '../_components/TransactionList';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import EditBudget from '../_components/EditBudget';


function Expenses({params}) {

  const {user} = useUser();
  const [budgetInfo, setBudgetInfo] = useState();
  const [transactionList, setTransactionList] = useState([]);
  const route = useRouter();

  useEffect(() => {
    
    user&&getBudgetInfo();
    
  },[user])

  //delete budget
  const deleteBudget = async () => {
    const trasacresult = await db.delete(Transactions)
    .where(eq(Transactions.budgetId,params.id)).returning();
    if(trasacresult){
      const result = await db.delete(Budgets)
      .where(eq(Budgets.id,params.id))
      .returning();
      if(result){
        toast({
          title: "Budget Deletion",
          description: "Success!",
        })
        route.replace('/dashboard/budgets');
        console.log(result);
      }
    }
    
    
    
  }
  //get current buget info
  const getBudgetInfo = async () => {
    const result = await db.select({
      ...getTableColumns(Budgets),
      totalSpend:sql `sum(${Transactions.amount})`.mapWith(Number),
      totalItem:sql `count(${Transactions.id})`.mapWith(Number)
    }).from(Budgets)
    .leftJoin(Transactions, eq(Budgets.id,Transactions.budgetId))
    .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
    .where(eq(Budgets.id,params.id))
    .groupBy(Budgets.id)

    setBudgetInfo(result[0]);
    //calling item list from here
    getTransactionList();
  }
//get the list of transaction items
  const getTransactionList = async() =>{
    const result = await db.select().from(Transactions).where(eq(Transactions.budgetId, params.id))
    .orderBy(desc(Transactions.id));
    setTransactionList(result);
  }

  const goBack = () => {
    route.replace('/dashboard/budgets')
  }
  return (
    <div className='p-10'>
  <div className='flex items-center gap-2'>
    <ArrowLeft onClick={()=>goBack()} />
    <h2 className='text-1xl font-bold md:text-2xl lg:text-2xl'>My Transactions</h2>
  </div>
  <div className='flex justify-between mt-4'>
    <div className='flex gap-2'>
      <EditBudget budgetInfo={budgetInfo} refreshData={() => getBudgetInfo()} />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className='flex gap-2'>
            <Trash />Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this budget
              and remove its transaction data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteBudget()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </div>
  
  <div className='grid grid-col-1 md:grid-cols-2 mt-6 gap-5'>
    {budgetInfo ? <BudgetItem budget={budgetInfo} /> : <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'>Loading...</div>}
    <AddExpense budgetId={params.id} user={user} refreshData={() => getBudgetInfo()} />
  </div>
  <div className='mt-5'>
    <h2 className='font-bold text-lg'>Latest Transactions</h2>
    <TransactionList transactionList={transactionList} refreshData={() => getBudgetInfo()} />
  </div>
</div>

  )
}

export default Expenses