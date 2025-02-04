"use client";
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogClose,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { db } from '@/utils/dbConfig';
import { Budgets } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { toast } from '@/components/ui/use-toast';


function CreateBudget({refreshData}) {
    const [emoji, setEmoji] = useState("😄");
    const [openPicker, setOpenPicker] = useState(false);
    const [name, setName] = useState(); 
    const [amount, setAmount] = useState();

    const {user} = useUser();
    /**create new budget */
    const onCreateBudget = async () => {
        const result = await db.insert(Budgets).values({
            name:name,
            amount:amount,
            createdBy:user.primaryEmailAddress.emailAddress,
            icon:emoji
        }).returning({insertedId:Budgets.id})

        if(result){
          refreshData();
            toast({
                title: "New Budget Creation",
                description: "Success!",
              })
        }
    }
  return (
    <div>
    
    <Dialog>
  <DialogTrigger asChild>
  <div className='bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md'>
        <h2 className='text-3xl'>
            +
        </h2>
        <h2>Create new Budget</h2>
    </div>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create new Budget</DialogTitle>
      <div className='mt-5'>
      <Button className="text-lg" variant="outline" onClick={() => setOpenPicker(!openPicker)}>{emoji}</Button>
        <div className='absolute z-20'>
            <EmojiPicker open={openPicker} onEmojiClick={(e)=>{setEmoji(e.emoji)
            setOpenPicker(false)}}/>
        </div>
      </div>
      
      <div className='mt-2'>
      <h2 className='text-black bold'>Budget Name</h2>
      <Input onChange={(e) =>{setName(e.target.value)}} placeholder="eg. College Fee" />
      </div>
      <div className='mt-2'>
      <h2 className='text-black bold'>Amount</h2>
      <Input type="number" onChange={(e) =>{setAmount(e.target.value)}} placeholder="eg. 2000000" />
      </div>
        
        
        <DialogDescription>
      </DialogDescription>
    </DialogHeader>
    <DialogFooter >
          <DialogClose asChild>
          <Button onClick={()=>onCreateBudget()} disabled={!(name&&amount)} className="mt-5">Create Budget</Button>
          </DialogClose>
        </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  )
}

export default CreateBudget