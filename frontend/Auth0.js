exports.onExecutePostLogin = async (event, api) => {
  // Check if the user has a role assigned
  if (
    event.authorization &&
    event.authorization.roles &&
    event.authorization.roles.length > 0
  ) {
    return;
  }

  // Create management API client instance
  const ManagementClient = require("auth0").ManagementClient;

  const management = new ManagementClient({
    domain: event.secrets.DOMAIN,
    clientId: event.secrets.CLIENT_ID,
    clientSecret: event.secrets.CLIENT_SECRET,
  });

  const userId = event.user.user_id;

  try {
    await management.users.roles.assign(userId, {
      roles: ["rol_N5Na3rgMmIe9qom4"],
    });
  } catch (e) {
    console.log(e);
  }
};
