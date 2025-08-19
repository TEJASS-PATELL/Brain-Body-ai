const ConnectDB = require("../config/db");

async function ChatHistory() {
    try {
        const connection = await ConnectDB();
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS chat_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL, 
            session_id VARCHAR(255) NOT NULL,
            sender ENUM('user', 'model') NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        `);
        console.log("Chat history table checked/created successfully.");
        return connection;
    } catch (err) {
        console.error("Error creating chat_history table:", err);
    }
}

ChatHistory();

module.exports = ChatHistory;
