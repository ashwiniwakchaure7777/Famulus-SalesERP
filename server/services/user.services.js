const USER_MODEL = require("../models/user.model");

module.exports.createUserService = async (payload) => {
  try {
    const user = await USER_MODEL.create(payload);
    return user ? user.toJSON() : null;
  } catch (error) {
    throw new Error("Error while creating user");
  }
};

module.exports.findSingleUserService = async (query, options = {}) => {
  try {
    const user = await USER_MODEL.findOne(query);
    return user ? user.toJSON() : null;
  } catch (error) {
    throw new Error("Error while getting a user");
  }
};

module.exports.findSingleUserWithPasswordService = async (query) => {
  try {
    const user = await USER_MODEL.findOne(query);
    return user;
  } catch (error) {
    throw new Error("Error while getting a user");
  }
};

module.exports.findAllUserService = async (query) => {
  try {
    const users = await USER_MODEL.findAll(query);
    return users ? users.map((i) => i.toJSON()) : null;
  } catch (error) {
    throw new Error("Error while getting all users");
  }
};

module.exports.findAllWithCountUserService = async (query) => {
  try {
    const { count, rows } = await USER_MODEL.findAndCountAll(query);
    const users = rows ? rows.map((i) => i.get({ plain: true })) : null;
    return { count, rows: users };
  } catch (error) {
    throw new Error("Error while getting users with count");
  }
};

module.exports.updateUserService = async (query, payload) => {
  try {
    const [updatedCount, updatedRows] = await USER_MODEL.update(payload, {
      ...query,
      returning: true,
    });
    return { updatedCount, updatedRows };
  } catch (error) {
    console.error("Error while updating user:", error.message);
    throw new Error("Error while updating user");
  }
};

module.exports.deleteUserService = async (query) => {
  try {
    const deletedCount = await USER_MODEL.destroy(query);
    return deletedCount;
  } catch (error) {
    console.error("Error while deleting user:", error.message);
    throw new Error("Error while deleting user");
  }
};

module.exports.findUserByEmailService = async (email) => {
  try {
    const user = await USER_MODEL.findOne({ where: { email } });
    return user;
  } catch (error) {
    throw new Error("Error while finding user by email");
  }
};

module.exports.findUserByUsernameService = async (username) => {
  try {
    const user = await USER_MODEL.findOne({ where: { username } });
    return user;
  } catch (error) {
    throw new Error("Error while finding user by username");
  }
};

module.exports.updateUserPasswordService = async (userId, newPassword) => {
  try {
    const [updatedCount, updatedRows] = await USER_MODEL.update(
      { password: newPassword },
      {
        where: { ID: userId },
        returning: true,
      }
    );
    return { updatedCount, updatedRows };
  } catch (error) {
    console.error("Error while updating user password:", error.message);
    throw new Error("Error while updating user password");
  }
};

module.exports.updateLastLoginService = async (userId) => {
  try {
    const [updatedCount, updatedRows] = await USER_MODEL.update(
      { last_login: new Date() },
      {
        where: { ID: userId },
        returning: true,
      }
    );
    return { updatedCount, updatedRows };
  } catch (error) {
    console.error("Error while updating last login:", error.message);
    throw new Error("Error while updating last login");
  }
};

module.exports.getUsersByRoleService = async (role) => {
  try {
    const users = await USER_MODEL.findAll({
      where: { role },
      attributes: [
        "ID",
        "username",
        "email",
        "first_name",
        "last_name",
        "status",
        "created_at",
      ],
    });
    return users ? users.map((i) => i.toJSON()) : null;
  } catch (error) {
    throw new Error("Error while getting users by role");
  }
};

module.exports.getActiveUsersService = async () => {
  try {
    const users = await USER_MODEL.findAll({
      where: { status: "Active" },
      attributes: [
        "ID",
        "username",
        "email",
        "first_name",
        "last_name",
        "role",
        "department",
      ],
    });
    return users ? users.map((i) => i.toJSON()) : null;
  } catch (error) {
    throw new Error("Error while getting active users");
  }
};

module.exports.getUserStatsService = async () => {
  try {
    const [totalUsers, activeUsers, adminUsers, managerUsers, salesUsers] =
      await Promise.all([
        USER_MODEL.count(),
        USER_MODEL.count({ where: { status: "Active" } }),
        USER_MODEL.count({ where: { role: "Admin" } }),
        USER_MODEL.count({ where: { role: "Manager" } }),
        USER_MODEL.count({ where: { role: "Sales" } }),
      ]);

    return {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      byRole: {
        admin: adminUsers,
        manager: managerUsers,
        sales: salesUsers,
        user: totalUsers - adminUsers - managerUsers - salesUsers,
      },
    };
  } catch (error) {
    throw new Error("Error while getting user statistics");
  }
};
