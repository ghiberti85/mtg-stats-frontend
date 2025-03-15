// pages/decks.tsx (excerpt)
import { useState, useEffect } from 'react';
import api from '../services/api';
import useAuthProtection from '../hooks/useAuthProtection';

interface Deck {
  id: string;
  player_id: string;
  name: string;
  archetype: string;
}

export default function Decks() {
  useAuthProtection();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [formData, setFormData] = useState({ player_id: '', name: '', archetype: '' });
  const [error, setError] = useState<string | null>(null);

  const fetchDecks = async () => {
    try {
      const res = await api.get('/decks');
      setDecks(res.data);
    } catch (err) {
      console.error('Error fetching decks:', err);
      setError('Failed to load decks.');
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  // Delete functionality
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/decks/${id}`);
      fetchDecks();
    } catch (err) {
      console.error('Error deleting deck:', err);
      setError('Failed to delete deck.');
    }
  };

  // Update functionality: inline editing
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [updateData, setUpdateData] = useState<Partial<Deck>>({});

  const handleEdit = (deck: Deck) => {
    setEditingDeck(deck);
    setUpdateData(deck);
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeck) return;
    try {
      await api.patch(`/decks/${editingDeck.id}`, updateData);
      setEditingDeck(null);
      fetchDecks();
    } catch (err) {
      console.error('Error updating deck:', err);
      setError('Failed to update deck.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/decks', formData);
      fetchDecks();
      setFormData({ player_id: '', name: '', archetype: '' });
    } catch (err) {
      console.error('Error creating deck:', err);
      setError('Failed to create deck.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Deck Management</h1>
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleCreateDeck} className="bg-white p-6 rounded shadow-md mb-8 max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Create a New Deck</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="name">Deck Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter deck name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="archetype">Archetype</label>
          <input
            id="archetype"
            name="archetype"
            type="text"
            placeholder="Enter deck archetype"
            value={formData.archetype}
            onChange={handleInputChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition">
          Create Deck
        </button>
      </form>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Decks</h2>
        {decks.length === 0 ? (
          <p>No decks created yet.</p>
        ) : (
          decks.map((deck) => (
            <div key={deck.id} className="p-4 mb-2 bg-white rounded shadow flex justify-between items-center">
              {editingDeck?.id === deck.id ? (
                <form onSubmit={handleUpdateSubmit} className="w-full">
                  <input
                    type="text"
                    name="name"
                    value={updateData.name}
                    onChange={handleUpdateChange}
                    className="p-2 border rounded mr-2"
                  />
                  <input
                    type="text"
                    name="archetype"
                    value={updateData.archetype}
                    onChange={handleUpdateChange}
                    className="p-2 border rounded mr-2"
                  />
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                  <button type="button" onClick={() => setEditingDeck(null)} className="ml-2 bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                </form>
              ) : (
                <>
                  <div>
                    <p className="text-gray-800 font-medium">{deck.name}</p>
                    <p className="text-sm text-gray-600">Archetype: {deck.archetype}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(deck)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
                    <button onClick={() => handleDelete(deck.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
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
