import { sql } from '../config/db.js';
export async function getTransactionsByUserId(req,res) {
        try {
            const { userId } = req.params;
            console.log("🔍 Fetching transactions for user:", userId);
    
            const transactions = await sql`
                SELECT * FROM tractions
                WHERE user_id = ${userId}
                ORDER BY created_at DESC
            `;
    
                // Ensure `amount` is returned as a number (not a string) for clients
                const tidyTransactions = transactions.map(t => ({
                    ...t,
                    amount: t.amount !== null && t.amount !== undefined ? parseFloat(t.amount) : 0
                }));
    
                console.log(`✅ Found ${tidyTransactions.length} transactions for user ${userId}`);
                console.log("📊 Transactions:", JSON.stringify(tidyTransactions, null, 2));
                return res.status(200).json(tidyTransactions);
    
        } 
        catch (error) {
            console.error("Error fetching transactions:", error);
            res.status(500).json(
                { 
                    message: "Internal server error"
                }
            );
        }
};

export async function createTransaction(req, res) {
  //title, amount, category, user_id  
    try {
        const { title, amount, category, user_id } = req.body;
                // Accept amount = 0; only reject when amount is null/undefined
                if (!title || amount === undefined || amount === null || !category || !user_id) {
            return res.status(400).json(
                { 
                    error: "All fields are required: title, amount, category, user_id"
                }
            );
        }
    
            // Ensure amount is numeric
            const numericAmount = Number(amount);

            const tractions = await sql 
                 `INSERT INTO tractions (title, amount, category, user_id)
                 VALUES (${title}, ${numericAmount}, ${category}, ${user_id})
                 RETURNING *`;
    
         res.status(201).json(
            {
                message: "Transaction created successfully",
                transaction: {
                    ...tractions[0],
                    amount: tractions[0].amount !== null && tractions[0].amount !== undefined ? parseFloat(tractions[0].amount) : 0
                }
            }
         )
      } 
      catch (error) {
    
        console.error("Error creating transaction:", error);
    
        res.status(500).json
        (
            { 
                message: "Internal server error"
            }
        );
      }
};

export async function deleteTransaction(req, res) {
     try {
            const { id } = req.params;
            if(isNaN(parseInt(id))){
                return res.status(400).json(
                    {
                        message: "Invalid transaction ID"
                    }
                );
            }
    
           const result =  await sql`
                DELETE FROM tractions
                WHERE id = ${id}
            `;
            if(result.count === 0){
                return res.status(404).json(
                    {
                        message: "Transaction not found"
                    }
                );
            }
    
            res.status(200).json(
                {
                    message: "Transaction deleted successfully"
                }
            );
        } 
    
        catch (error) {
            console.error("Error deleting transaction:", error);
    
            res.status(500).json
            (
                { 
                    message: "Internal server error"
                }
            );
        }
};

export async function getSummaryByUserId(req, res) {
        try {
        const { userId } = req.params;

        // Normalize amounts using category when category indicates Income/Expense
        // This handles two data styles: expenses stored as negative amounts, or as positive amounts with category='Expense'
        const summaryResult = await sql`
            SELECT
                COALESCE(SUM(normalized), 0) AS balance,
                COALESCE(SUM(CASE WHEN normalized > 0 THEN normalized ELSE 0 END), 0) AS income,
                COALESCE(SUM(CASE WHEN normalized < 0 THEN -normalized ELSE 0 END), 0) AS expense
            FROM (
                SELECT
                    CASE
                        WHEN lower(COALESCE(category, '')) LIKE '%exp%' THEN -ABS(amount)
                        WHEN lower(COALESCE(category, '')) LIKE '%inc%' THEN ABS(amount)
                        ELSE amount
                    END AS normalized
                FROM tractions
                WHERE user_id = ${userId}
            ) s
        `;

        // Extract values from query results (fallback to 0)
        const row = summaryResult[0] || {};
        const balance = row.balance ?? 0;
        const income = row.income ?? 0;
        const expense = row.expense ?? 0;

        // Coerce string/decimal results to numbers for consistent JSON output
        const numericBalance = typeof balance === 'string' ? parseFloat(balance) : Number(balance);
        const numericIncome = typeof income === 'string' ? parseFloat(income) : Number(income);
        const numericExpense = typeof expense === 'string' ? parseFloat(expense) : Number(expense);

        // Indian currency formatting
        const inrFormatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        });

        res.status(200).json({
            balance: numericBalance,
            income: numericIncome,
            expense: numericExpense,
            formatted: {
                balance: inrFormatter.format(numericBalance),
                income: inrFormatter.format(numericIncome),
                expense: inrFormatter.format(numericExpense)
            }
        });

    } catch (error) {
       console.error("Error getting summary:", error);

       res.status(500).json
       (
           { 
               message: "Internal server error in summary"
           }
       );  
    }
};