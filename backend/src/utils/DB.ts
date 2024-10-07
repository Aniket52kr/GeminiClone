import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL!, {
      dbName: "gemini-clone",
      serverSelectionTimeoutMS: 15000, // Set the timeout to 15 seconds to avoid long waits
    });

    console.log(`Database connected successfully: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Database connection error: ${error.message}`);

    // Optional: Retry the connection after a delay if needed (for more resilience)
    setTimeout(connectDB, 5000);  // Retry connection in 5 seconds if failed
  }

  // Optional: Listen for connection errors during runtime
  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.log("MongoDB disconnected. Retrying connection...");
    setTimeout(connectDB, 5000); // Reconnect after 5 seconds
  });
};




// import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.DATABASE_URL!, {
//       dbName: "gemini-clone",
//       useNewUrlParser: true,       // Ensures correct parsing of MongoDB connection string
//       useUnifiedTopology: true,    // Opts into using MongoDB's unified topology engine
//       serverSelectionTimeoutMS: 15000, // Set the timeout to 15 seconds to avoid long waits
//     });
    
//     console.log(`Database connected successfully: ${conn.connection.host}`);
//   } catch (error: any) {
//     console.error(`Database connection error: ${error.message}`);
    
//     // Optional: Retry the connection after a delay if needed (for more resilience)
//     setTimeout(connectDB, 5000);  // Retry connection in 5 seconds if failed
//   }

//   // Optional: Listen for connection errors during runtime
//   mongoose.connection.on('error', (err) => {
//     console.error(`MongoDB connection error: ${err.message}`);
//   });

//   mongoose.connection.on('disconnected', () => {
//     console.log("MongoDB disconnected. Retrying connection...");
//     setTimeout(connectDB, 5000); // Reconnect after 5 seconds
//   });
// };