import { integer, numeric, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Budgets=pgTable('budgets',{

    id:serial('id').primaryKey(),
    name:varchar('name').notNull(),
    amount: varchar('amount').notNull(),
    icon: varchar('icon'),
    createdBy: varchar('createdBy').notNull()
});

export const Transactions=pgTable('transactions',{
    id:serial('id').primaryKey(),
    amount:numeric('amount').notNull().default(0),
    name:varchar('name').notNull(),
    budgetId:integer('budgetId').references(()=>Budgets.id),
    createdAt:varchar('createdAt').notNull()
});