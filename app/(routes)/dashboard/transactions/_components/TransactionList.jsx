import { toast } from '@/components/ui/use-toast'
import { db } from '@/utils/dbConfig'
import { Transactions } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Trash } from 'lucide-react'
import React from 'react'

function TransactionList({transactionList, refreshData}) {  
    const deleteTransaction = async (trasac) => {
        const result = await db.delete(Transactions)
        .where(eq(Transactions.id,trasac.id))
        .returning();

        if(result){
            toast({
                title: "Delete Transaction",
                description: "Success!",
              })        
              refreshData();
        }
    }
  return (
    <div className='mt-3'>
    <div className='grid grid-cols-4 bg-slate-200 p-2'>
        <h2 className='font-bold'>Name</h2>
        <h2 className='font-bold'>Amount</h2>
        <h2 className='font-bold'>Date</h2>
        <h2 className='font-bold'>Action</h2>
    </div>
        {transactionList.map((trasac, index) => (
        <div key={index} className='grid grid-cols-4 bg-slate-50 p-2'>
        <h2>{trasac.name}</h2>
        <h2>${trasac.amount}</h2>
        <h2>{trasac.createdAt}</h2>
        <h2 className='pl-10'><Trash className='text-red-600 cursor-pointer' onClick={()=>deleteTransaction(trasac)}/>    </h2>
    </div>
        ))}
    </div>
  )
}

export default TransactionList