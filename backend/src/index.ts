import express, { Request, Response } from 'express';
import cors from 'cors';
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// this is a test endpoint/api route at '/api/test' to make sure everything is working properly  
// you can access using GET at http://localhost:7000/api/test
// and it should return a json object with a message property containing "Hello from express endpoint" (ex: {"message":"Hello from express endpoint"})

app.get("/api/test", async (req: Request, res: Response) => {
    res.json({ message: "Hello from express endpoint" });
});

app.listen(7000, () => {
    console.log("Server is running on port 7000");
})