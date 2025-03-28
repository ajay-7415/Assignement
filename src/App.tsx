import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import axios from "axios";

const BASE_URL = "https://reqres.in/api/users";
const LOGIN_URL = "https://reqres.in/api/login";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  return token ? <UserManagement /> : <Login setToken={setToken} />;
}

interface LoginProps {
  setToken: (token: string) => void;
}

function Login({ setToken }: LoginProps) {
  const [email, setEmail] = useState("eve.holt@reqres.in");
  const [password, setPassword] = useState("cityslicka");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(LOGIN_URL, { email, password });
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="p-6 w-96">
        <CardContent>
          <h1 className="text-xl font-bold mb-4">Login</h1>
          {error && <p className="text-red-500">{error}</p>}
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-2" />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4" />
          <Button onClick={handleLogin} className="w-full">Login</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editData, setEditData] = useState<Omit<User, "id" | "avatar">>({ first_name: "", last_name: "", email: "" });

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}?page=${page}`);
      setUsers(response.data.data as User[]);
      setTotalPages(response.data.total_pages);
    } catch {
      console.error("Failed to fetch users.");
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditData({ first_name: user.first_name, last_name: user.last_name, email: user.email || "" });
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    try {
      const response = await axios.put(`${BASE_URL}/${editingUser.id}`, editData);
      if (response.status === 200) {
        setUsers((prevUsers: User[]) => prevUsers.map((user) => (user.id === editingUser.id ? { ...user, ...editData } : user)));
        setEditingUser(null);
      }
    } catch {
      console.error("Failed to update user.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setUsers((prevUsers: User[]) => prevUsers.filter((user) => user.id !== id));
    } catch {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">User Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <motion.div key={user.id} whileHover={{ scale: 1.05 }}>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <img src={user.avatar} alt={user.first_name} className="w-16 h-16 rounded-full" />
                <div>
                  <p className="font-semibold">{user.first_name} {user.last_name}</p>
                  <p className="text-sm text-gray-600">{user.email || "No email"}</p>
                  <div className="flex gap-2 mt-2">
                    <Button onClick={() => handleEdit(user)} size="sm">Edit</Button>
                    <Button onClick={() => handleDelete(user.id)} size="sm" >Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</Button>
        <span>Page {page} of {totalPages}</span>
        <Button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</Button>
      </div>
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="p-6 w-96 bg-white">
            <CardContent>
              <h2 className="text-xl font-bold mb-4">Edit User</h2>
              <Input placeholder="First Name" value={editData.first_name} onChange={(e) => setEditData({ ...editData, first_name: e.target.value })} className="mb-2" />
              <Input placeholder="Last Name" value={editData.last_name} onChange={(e) => setEditData({ ...editData, last_name: e.target.value })} className="mb-2" />
              <Input placeholder="Email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="mb-4" />
              <Button onClick={handleUpdate} className="w-full mb-2">Update</Button>
              <Button onClick={() => setEditingUser(null)} variant="destructive" className="w-full text-black">Cancel</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
