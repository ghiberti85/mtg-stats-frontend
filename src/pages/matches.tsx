// pages/matches.tsx (excerpt)
import { useState, useEffect } from 'react';
import api from '../services/api';
import useAuthProtection from '../hooks/useAuthProtection';

interface Match {
  id: string;
  player_id: string;
  deck_id: string;
  opponent_id?: string;
  opponent_deck_id?: string;
  format: string;
  result: 'win' | 'loss' | 'draw';
  duration: number;
  match_date: string;
}

export default function Matches() {
  useAuthProtection();
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    try {
      // Replace 'current-player-id' with a dynamic value
      const res = await api.get('/matches', { params: { playerId: 'current-player-id' } });
      setMatches(res.data);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to load matches.');
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/matches/${id}`);
      // Refresh list after deletion
      fetchMatches();
    } catch (err) {
      console.error('Error deleting match:', err);
      setError('Failed to delete match.');
    }
  };

  // For update, we could either show a modal or inline edit form.
  // Here’s a simplified approach using inline editing:
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [updateData, setUpdateData] = useState<Partial<Match>>({});

  const handleEdit = (match: Match) => {
    setEditingMatch(match);
    setUpdateData(match);
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatch) return;
    try {
      await api.patch(`/matches/${editingMatch.id}`, updateData);
      setEditingMatch(null);
      fetchMatches();
    } catch (err) {
      console.error('Error updating match:', err);
      setError('Failed to update match.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Matches</h1>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      {/* Registration form remains here */}
      {/* ... registration form code ... */}

      <div>
        <h2 className="text-2xl font-semibold mb-4">Registered Matches</h2>
        {matches.length === 0 ? (
          <p>No matches registered yet.</p>
        ) : (
          matches.map((match) => (
            <div key={match.id} className="p-4 mb-2 bg-white rounded shadow flex justify-between items-center">
              {editingMatch?.id === match.id ? (
                <form onSubmit={handleUpdateSubmit} className="w-full">
                  <input
                    type="text"
                    name="format"
                    value={updateData.format}
                    onChange={handleUpdateChange}
                    className="p-2 border rounded mr-2"
                  />
                  <select
                    name="result"
                    value={updateData.result}
                    onChange={handleUpdateChange}
                    className="p-2 border rounded mr-2"
                  >
                    <option value="win">Win</option>
                    <option value="loss">Loss</option>
                    <option value="draw">Draw</option>
                  </select>
                  <input
                    type="number"
                    name="duration"
                    value={updateData.duration}
                    onChange={handleUpdateChange}
                    className="p-2 border rounded mr-2"
                  />
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                  <button type="button" onClick={() => setEditingMatch(null)} className="ml-2 bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                </form>
              ) : (
                <>
                  <div>
                    <p className="text-gray-800 font-medium">{match.format} - {match.result}</p>
                    <p className="text-sm text-gray-600">Duration: {match.duration} minutes</p>
                    <p className="text-sm text-gray-600">Date: {new Date(match.match_date).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(match)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
                    <button onClick={() => handleDelete(match.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
