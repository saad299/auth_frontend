import axios, { AxiosError } from "axios"; // imported AxiosError for proper error typing instead of casting to generic Error
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

// ─── TYPES ────────────────────────────────────────────────────────────────────

// added Form interface to type the shared form state across all components
interface Form {
  name: string;
  email: string;
  password: string;
}

// added User interface to type the user objects returned from the API
interface User {
  _id: number;
  name: string;
  email: string;
}

// added Status interface to type the status messages shown in the UI
interface Status {
  message: string;
}

// added prop interfaces for each component for full TypeScript safety
interface RegisterProps {
  form: Form;
  setForm: (form: Form) => void;
  onRegister: () => void;
  loading: boolean;
  status: Status | null;
  setCurrentView: (view: string) => void;
}

interface LoginProps {
  form: Form;
  setForm: (form: Form) => void;
  onLogin: () => void;
  loading: boolean;
  status: Status | null;
  setCurrentView: (view: string) => void;
}

interface DashboardProps {
  token: string | null;
  users: User[];
  loggedInUser: User | null;
  selectedUser: User | null;
  onSelectUser: (id: string) => void;
  onLogout: () => void;
}

// ─── REGISTER ─────────────────────────────────────────────────────────────────

const Register = ({ form, setForm, onRegister, loading, status, setCurrentView }: RegisterProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create an account</h2>

        {/* changed type="name" to type="text" — "name" is not a valid HTML input type */}
        <input
          type="text"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={onRegister}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* status message shown on API success or error */}
        {status && (
          <p className="mt-3 text-sm text-center text-gray-500">{status.message}</p>
        )}

        <p className="mt-5 text-sm text-center text-gray-500">
          Already have an account?{" "}
          <button onClick={() => setCurrentView("login")} className="text-blue-600 hover:underline font-medium">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────

const Login = ({ form, setForm, onLogin, loading, status, setCurrentView }: LoginProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome back</h2>

        {/* removed name field — login only requires email and password */}
        <input
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={onLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {status && (
          <p className="mt-3 text-sm text-center text-gray-500">{status.message}</p>
        )}

        <p className="mt-5 text-sm text-center text-gray-500">
          Don't have an account?{" "}
          <button onClick={() => setCurrentView("register")} className="text-blue-600 hover:underline font-medium">
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

const Dashboard = ({ users, loggedInUser, selectedUser, onSelectUser, onLogout }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">

        {/* header row with welcome message and logout button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            {loggedInUser && (
              <p className="text-sm text-gray-500 mt-0.5">Welcome back, {loggedInUser.name}</p>
            )}
          </div>
          <button
            onClick={onLogout}
            className="text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* users list panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-base font-semibold text-gray-700 mb-4">All Users</h3>
            <ul className="space-y-2">
              {users.map((user) => (
                <li key={user._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <button onClick={() => onSelectUser(user._id)} className="text-xs text-blue-600 hover:underline">
                    View
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* selected user detail panel — only shown when a user is clicked */}
          {selectedUser && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-base font-semibold text-gray-700 mb-4">User Detail</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Name</p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">ID</p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">#{selectedUser._id}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────

const App = () => {
  const [currentView, setCurrentView] = useState<string>("login");
  const [token, setToken] = useState<string | null>(null); // typed as string | null — null means unauthenticated
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null); // typed with User interface
  const [users, setUsers] = useState<User[]>([]); // typed as User array
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // typed with User interface
  const [form, setForm] = useState<Form>({ name: "", email: "", password: "" }); // typed with Form interface
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<Status | null>(null); // typed with Status interface

  const handleRegister = async () => {
    setLoading(true);
    setStatus(null);
    try {
      await axios.post(`${API_URL}/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setStatus({ message: "Registered! Please login." });
      setForm({ name: "", email: "", password: "" });
      setCurrentView("login");
    } catch (error) {
      // changed Error to AxiosError — AxiosError has the .response property that generic Error does not
      const err = error as AxiosError<{ message: string }>;
      setStatus({ message: err.response?.data?.message || "Registration failed." });
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        // removed name field — login endpoint only accepts email and password
        email: form.email,
        password: form.password,
      });
      setToken(data.token);
      setLoggedInUser(data.user);
      setForm({ name: "", email: "", password: "" });
      const { data: usersData } = await axios.get(`${API_URL}/users`, {
        // fixed "Bearer:" to "Bearer " — the colon was breaking the Authorization header format
        headers: { Authorization: `Bearer ${data.token}` },
      });
      setUsers(usersData);
      setCurrentView("dashboard");
    } catch (error) {
      // changed Error to AxiosError for correct typing
      const err = error as AxiosError<{ message: string }>;
      setStatus({ message: err.response?.data?.message || "Login failed." });
    }
    setLoading(false);
  };

  const handleSelectUser = async (id: string) => {
    try {
      const { data } = await axios.get(`${API_URL}/users/${id}`, {
        // fixed "Bearer:" to "Bearer " — same header format fix as handleLogin
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(data);
    } catch {
      console.log("Failed to fetch user");
    }
  };

  const handleLogout = () => {
    setToken(null);
    setLoggedInUser(null);
    setUsers([]);
    setSelectedUser(null);
    setStatus(null);
    setCurrentView("login"); // added missing redirect — without this the view stays on "dashboard" after logout
  };

  // removed "dashboard" from nav tabs — dashboard should only be accessible after login, not a manual tab
  const currentViews = [
    { id: "register", label: "Register" },
    { id: "login", label: "Login" },
  ];

  return (
    <>
      {/* nav tabs only visible when user is not authenticated */}
      {!token && (
        <div className="flex gap-2 p-4 bg-white border-b border-gray-100 shadow-sm">
          {currentViews.map((view) => (
            <button
              key={view.id}
              onClick={() => setCurrentView(view.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === view.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {/* changed from view.charAt() to view.label — view is an object not a string, charAt does not exist on objects */}
              {view.label}
            </button>
          ))}
        </div>
      )}

      <div>
        {currentView === "login" && (
          <Login
            form={form}
            setForm={setForm}
            onLogin={handleLogin}
            loading={loading}
            status={status}
            setCurrentView={setCurrentView}
          />
        )}
        {currentView === "register" && (
          <Register
            form={form}
            setForm={setForm}
            onRegister={handleRegister}
            loading={loading}
            status={status}
            setCurrentView={setCurrentView}
          />
        )}
        {/* added token guard — dashboard must not render without a valid token */}
        {currentView === "dashboard" && token && (
          <Dashboard
            token={token}
            users={users}
            loggedInUser={loggedInUser}
            selectedUser={selectedUser}
            onSelectUser={handleSelectUser}
            onLogout={handleLogout}
          />
        )}
      </div>
    </>
  );
};

export default App;