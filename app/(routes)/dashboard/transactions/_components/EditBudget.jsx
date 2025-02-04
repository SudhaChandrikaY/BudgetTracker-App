"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmojiPicker from 'emoji-picker-react';
import { Input } from "@/components/ui/input";
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbConfig';
import { Budgets } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { toast } from '@/components/ui/use-toast';

function EditBudget({ budgetInfo }) {
    const [emoji, setEmoji] = useState("😄");
    const [openPicker, setOpenPicker] = useState(false);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [formattedAmount, setFormattedAmount] = useState("");
    const [updatedBudget, setUpdatedBudget] = useState(budgetInfo || {}); // Initialize with a default object
    const { user } = useUser();

    // Function to format currency in USD
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    useEffect(() => {
        if (budgetInfo) {
            setEmoji(budgetInfo.icon || "😄");
            setName(budgetInfo.name || "");
            setAmount(budgetInfo.amount || "");
            setUpdatedBudget(budgetInfo);
        }
    }, [budgetInfo]);

    useEffect(() => {
        if (amount) {
            setFormattedAmount(formatCurrency(amount));
        }
    }, [amount]);

    const onUpdateBudget = async () => {
        const result = await db.update(Budgets).set({
            name: name,
            amount: amount,
            icon: emoji,
        }).where(eq(Budgets.id, budgetInfo.id)).returning();

        if (result.length > 0) {
            toast({
                title: "Budget Update",
                description: "Success!",
            });

            setUpdatedBudget({
                ...updatedBudget,
                name: name,
                amount: amount,
                icon: emoji,
            });
        }
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="bg-green-500 flex gap-2"><Edit />Edit</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Budget</DialogTitle>
                        <div className='mt-5'>
                            <Button className="text-lg" variant="outline" onClick={() => setOpenPicker(!openPicker)}>{emoji}</Button>
                            {openPicker && (
                                <div className='absolute z-20'>
                                    <EmojiPicker onEmojiClick={(e) => { setEmoji(e.emoji); setOpenPicker(false); }} />
                                </div>
                            )}
                        </div>
                        <div className='mt-2'>
                            <h2 className='text-black bold'>Budget Name</h2>
                            <Input value={name} onChange={(e) => { setName(e.target.value); }} placeholder="e.g., Groceries" />
                        </div>
                        <div className='mt-2'>
                            <h2 className='text-black bold'>Amount (USD)</h2>
                            <Input
                                value={amount}
                                type="number"
                                onChange={(e) => { setAmount(e.target.value); }}
                                placeholder="e.g., 3000"
                            />
                            <p className="text-sm text-gray-500 mt-1">Current Amount: {formattedAmount}</p>
                        </div>
                        <DialogDescription />
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button onClick={() => onUpdateBudget()} disabled={!(name && amount)} className="mt-5">Update Budget</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Conditionally display updated budget info */}
            {updatedBudget && (
                <div className="mt-5 p-5 border rounded-lg">
                    <h2 className="text-lg font-bold">Updated Budget Info</h2>
                    <p>Name: {updatedBudget.name || 'N/A'}</p>
                    <p>Amount: {formatCurrency(updatedBudget.amount || 0)}</p>
                    <p>Icon: {updatedBudget.icon || 'N/A'}</p>
                </div>
            )}
        </div>
    );
}

export default EditBudget;
