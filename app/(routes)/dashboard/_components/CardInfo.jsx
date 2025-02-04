import { PiggyBank, ReceiptText, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';

function CardInfo({ budgetList }) {
    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);

    // Function to format currency in USD
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const calculateCardInfo = () => {
        let totalBudget_ = 0;
        let totalSpent_ = 0;
        budgetList.forEach(element => {
            totalBudget_ += Number(element.amount);
            totalSpent_ += element.totalSpend;
        });
        setTotalBudget(totalBudget_);
        setTotalSpent(totalSpent_);
    };

    useEffect(() => {
        budgetList && calculateCardInfo();
    }, [budgetList]);

    return (
        <div>
            {budgetList?.length > 0 ? (
                <div className='mt-7 grid grid-col-1 md:grid-col-2 lg:grid-cols-3 gap-5'>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm text-[#283841]'>Total Budgets:</h2>
                            <h2 className='font-bold text-2xl text-[#283841]'>
                                {formatCurrency(totalBudget)}
                            </h2>
                        </div>
                        <PiggyBank className='rounded-full p-3 h-12 w-12 text-white' style={{ backgroundColor: '#283841' }} />
                    </div>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm text-[#283841]'>Total Spent:</h2>
                            <h2 className='font-bold text-2xl text-[#283841]'>
                                {formatCurrency(totalSpent)}
                            </h2>
                        </div>
                        <ReceiptText className='rounded-full p-3 h-12 w-12 text-white' style={{ backgroundColor: '#283841' }} />
                    </div>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm text-[#283841]'>No of Budgets:</h2>
                            <h2 className='font-bold text-2xl text-[#283841]'>{budgetList.length}</h2>
                        </div>
                        <Wallet className='rounded-full p-3 h-12 w-12 text-white' style={{ backgroundColor: '#283841' }} />
                    </div>
                </div>
            ) : (
                <div className='mt-7 grid grid-col-1 md:grid-col-2 lg:grid-cols-3 gap-5'>
                    {[1, 2, 3].map((item, index) => (
                        <div key={index} className='h-[120px] w-full bg-slate-200 rounded-lg animate-pulse'></div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CardInfo;
