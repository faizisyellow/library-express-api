import dotenv from "dotenv";
import { app } from "./app";

dotenv.config();

app.listen(5000, () => {
  console.log(`Server is running at http://localhost:5000`);
});
