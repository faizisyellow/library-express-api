import dotenv from "dotenv";
import { app } from "./app";

dotenv.config();

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
