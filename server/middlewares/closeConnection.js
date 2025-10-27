const sequelize = require("../config/sequelizedb");

const closeUnusedConnections = async (req, res, next) => {
  let connectionReleased = false;

  const releaseConnection = async () => {
    if (connectionReleased) return; // Prevent double execution
    connectionReleased = true;

    try {
      const connection = await sequelize.connectionManager.getConnection();
      await sequelize.connectionManager.releaseConnection(connection);
      // console.log("✅ Unused connection released.");
    } catch (error) {
      console.error("❌ Error releasing unused connection:", error);
    }
  };

  res.on("finish", releaseConnection); // When response is fully sent
  res.on("close", releaseConnection); // When client disconnects early

  next();
};

module.exports = { closeUnusedConnections };
