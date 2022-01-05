import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { apiData } from "../services/api";

interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string;
}

// interface TransactionInput {
//     title: string;
//     amount: number;
//     type: string;
//     category: string;
// }
// type TransactionInput = Pick<Transaction, 'fields' | ''>;
type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;


interface TransactionsProviderProps {
    children: ReactNode;
}

interface TransactionsContextData {
    transactions: Transaction[];
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData
);

export function TransactionsProvider ({children}: TransactionsProviderProps) {
    const [ transactions, setTransactions ] = useState<Transaction[]>([]);

    useEffect(()=>{
        apiData.get('transactions')
        .then(response=> {
            setTransactions(response.data.transactions);
        })
    },[])

    async function createTransaction(transactionInput: TransactionInput) {
        const response = await apiData.post('/transactions', {
            ...transactionInput, 
            createdAt: new Date()
        })        
        const { transaction } = response.data;

        setTransactions([
            ...transactions,
            transaction
        ])
    }

    return (
        <TransactionsContext.Provider value={{transactions, createTransaction }}>
            {children}
        </TransactionsContext.Provider>
    )

}

export function useTransactions() {
    const context = useContext(TransactionsContext)
    return context;
}