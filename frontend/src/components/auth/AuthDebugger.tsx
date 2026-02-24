import { useAuth0 } from "@auth0/auth0-react";

export const AuthDebugger = () => {
  const {
    isAuthenticated,
    isLoading,
    user,
    getAccessTokenSilently,
    loginWithRedirect,
    logout,
  } = useAuth0();

  const checkToken = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log("Token acquired:", token.substring(0, 15) + "...");
      alert("Token acquired successfully! (Check console)");
    } catch (e) {
      console.error("Token error:", e);
      alert("Failed to get token: " + (e as Error).message);
    }
  };

  return (
    <div className="p-10 font-mono border-4 border-dashed border-slate-300 m-10 rounded-2xl space-y-6 bg-slate-50">
      <h1 className="text-2xl font-bold text-indigo-600">
        Auth0 Debugger Mode
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-slate-500">Status</p>
          <p className="text-xl font-bold">
            {isLoading
              ? "⏳ Loading..."
              : isAuthenticated
                ? "✅ Authenticated"
                : "❌ Logged Out"}
          </p>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-slate-500">Current URL</p>
          <p className="text-sm font-bold truncate">{window.location.href}</p>
        </div>
      </div>

      {isAuthenticated && (
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <p className="font-bold">User: {user?.email}</p>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => loginWithRedirect()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Force Login
        </button>

        <button
          onClick={checkToken}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Test Silent Token Refresh
        </button>

        <button
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>

        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-slate-800 text-white rounded"
        >
          🔄 Refresh Page
        </button>
      </div>

      <div className="text-xs text-slate-400">
        <p>Instructions:</p>
        <ol className="list-decimal ml-4">
          <li>
            Click <strong>Force Login</strong> and finish the flow.
          </li>
          <li>
            Once back, click <strong>Test Silent Token Refresh</strong>.
          </li>
          <li>
            Now, hit <strong>Refresh Page</strong>.
          </li>
          <li>
            If it says "Logged Out" after refresh, your{" "}
            <strong>Silent Auth</strong> is failing.
          </li>
        </ol>
      </div>
    </div>
  );
};
