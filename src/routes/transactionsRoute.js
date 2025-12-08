import express from 'express';
import { sql } from '../config/db.js';
import  {getTransactionsByUserId,createTransaction,deleteTransaction,getSummaryByUserId}   from '../controllers/transactionsController.js';
const router = express.Router();

// router.get("/api/transactions/:userId", async (req, res) => {
//     try {
//         const { userId } = req.params;
//         console.log("user id is", userId);

//         const transactions = await sql`
//             SELECT * FROM tractions
//             WHERE user_id = ${userId}
//             ORDER BY created_at DESC
//         `;

//             // Ensure `amount` is returned as a number (not a string) for clients
//             const tidyTransactions = transactions.map(t => ({
//                 ...t,
//                 amount: t.amount !== null && t.amount !== undefined ? parseFloat(t.amount) : 0
//             }));

//             return res.status(200).json({ transactions: tidyTransactions });

//     } 
//     catch (error) {
//         console.error("Error fetching transactions:", error);
//         res.status(500).json(
//             { 
//                 message: "Internal server error"
//             }
//         );
//     }
// });

// router.post("/api/transactions",async(req,res) => {
//     //title, amount, category, user_id
//   try {
//     const { title, amount, category, user_id } = req.body;
    
//     if(!title || !amount || !category || !user_id){
//         return res.status(400).json(
//             { 
//                 error: "All fields are required: title, amount, category, user_id"
//             }
//         );
//     }

//   const tractions = await sql 
//      `INSERT INTO tractions (title, amount, category, user_id)
//      VALUES (${title}, ${amount}, ${category}, ${user_id})
//      RETURNING *`;

//      res.status(201).json(
//         {
//             message: "Transaction created successfully",
//             transaction: {
//                 ...tractions[0],
//                 amount: tractions[0].amount !== null && tractions[0].amount !== undefined ? parseFloat(tractions[0].amount) : 0
//             }
//         }
//      )
//   } 
//   catch (error) {

//     console.error("Error creating transaction:", error);

//     res.status(500).json
//     (
//         { 
//             message: "Internal server error"
//         }
//     );
//   }
// });

// router.delete("/api/transactions/:id", async (req,res) => {
//     try {
//         const { id } = req.params;
//         if(isNaN(parseInt(id))){
//             return res.status(400).json(
//                 {
//                     message: "Invalid transaction ID"
//                 }
//             );
//         }

//        const result =  await sql`
//             DELETE FROM tractions
//             WHERE id = ${id}
//         `;
//         if(result.count === 0){
//             return res.status(404).json(
//                 {
//                     message: "Transaction not found"
//                 }
//             );
//         }

//         res.status(200).json(
//             {
//                 message: "Transaction deleted successfully"
//             }
//         );
//     } 

//     catch (error) {
//         console.error("Error deleting transaction:", error);

//         res.status(500).json
//         (
//             { 
//                 message: "Internal server error"
//             }
//         );
//     }
// }
// );   

// router.get('/api/transactions/summary/:userId', async (req, res) => {
//     try {
//         const { userId } = req.params;

//         const balanceresult = await sql`
//             SELECT 
//                 COALESCE(SUM(amount), 0) as balance
//             FROM tractions
//             WHERE user_id = ${userId}
//         `;
//         const incomeResult = await sql`
//             SELECT
//                 COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) as income
//             FROM tractions
//             WHERE user_id = ${userId}
//         `;
//         const expenseResult = await sql`
//             SELECT
//                 COALESCE(SUM(CASE WHEN amount < 0 THEN -amount ELSE 0 END), 0) as expense
//             FROM tractions
//             WHERE user_id = ${userId}
//         `;

//         // const summary = {
//         //     balance: balanceresult[0]?.balance ?? 0,
//         //     income: incomeResult[0]?.income ?? 0,
//         //     expense: expenseResult[0]?.expense ?? 0
//         // };

//         // Coerce string/decimal results to numbers for consistent JSON output
//         const balance = balanceresult[0]?.balance ?? 0;
//         const income = incomeResult[0]?.income ?? 0;
//         const expense = expenseResult[0]?.expense ?? 0;

//         res.status(200).json({
//             balance: typeof balance === 'string' ? parseFloat(balance) : Number(balance),
//             income: typeof income === 'string' ? parseFloat(income) : Number(income),
//             expense: typeof expense === 'string' ? parseFloat(expense) : Number(expense)
//         });

//     } catch (error) {
//        console.error("Error getting summary:", error);

//        res.status(500).json
//        (
//            { 
//                message: "Internal server error in summary"
//            }
//        );  
//     }
// });
// // console.log("my port",process.env.PORT)

router.get("/:userId",getTransactionsByUserId);

router.post("/",createTransaction); 

router.delete("/:id",deleteTransaction);

router.get('/summary/:userId',getSummaryByUserId);

// console.log("my port",process.env.PORT)

export default router;