// pages/dashboard.tsx
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import api from '../services/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import useAuthProtection from '../hooks/useAuthProtection';

interface WinData {
  month: string;
  wins: number;
}

export default function Dashboard() {
  // Protect the route for authenticated users
  useAuthProtection();

  // Local state for chart data
  const [data, setData] = useState<WinData[]>([
    { month: 'Jan', wins: 10 },
    { month: 'Feb', wins: 15 },
    { month: 'Mar', wins: 12 },
    { month: 'Apr', wins: 18 },
    { month: 'May', wins: 20 },
  ]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get('/stats/leaderboard');
        // Assume API returns an array of { month, wins } objects
        setData(res.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }
    fetchStats();
  }, []);

  // Use the RootState type to type the auth slice; now TypeScript knows that state.auth is of type AuthState.
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {user && (
        <p className="mb-4 text-gray-700">
          Welcome, <span className="font-semibold">{user.email}</span>!
        </p>
      )}
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Wins Over Time</h2>
        <LineChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="wins" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </div>
    </div>
  );
}
