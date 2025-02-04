import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast';
import { db } from '@/utils/dbConfig';
import { Budgets, Transactions } from '@/utils/schema';
import { Loader } from 'lucide-react';
import moment from 'moment/moment';
import React, { useState } from 'react'

function AddExpense({ budgetId, user, refreshData }) {
    const [name, setName] = useState();
    const [amount, setAmount] = useState();
    const [Loading, setLoading] = useState(false);


    //add new transaction
    const addNewTransaction = async () => {
        setLoading(true);
        const result = await db.insert(Transactions).values({
            name: name,
            amount: amount,
            budgetId: budgetId,
            createdAt: moment().format('DD/MM/YYYY'),
        }).returning({ insertedId: Budgets.id });

        setAmount('');
        setName('');
        console.log(result);
        if (result) {
            setLoading(false);
            refreshData();
            toast({
                title: "Add new Transaction ",
                description: "Success!",
            })
        }
        setLoading(false);
    }
    return (
        <div className='border p-5 rounded-lg'>
            <h2 className='font-bold text-lg'>
                Add Transactions
            </h2>
            <div className='mt-2'>
                <h2 className='text-black bold'>Transaction name</h2>
                <Input value={name} onChange={(e) => { setName(e.target.value) }} placeholder="eg. First Semester" />
            </div>
            <div className='mt-2'>
                <h2 className='text-black bold'>Transaction Amount</h2>
                <Input value={amount} type="number" onChange={(e) => { setAmount(e.target.value) }} placeholder="eg. 2000 " />
            </div>
            <Button onClick={() => addNewTransaction()}
                disabled={!(name && amount)} className="mt-3 w-full">{Loading ? <Loader className='animate-spin' /> : "Add new Transaction"}</Button>
        </div>
    )
}

export default AddExpense