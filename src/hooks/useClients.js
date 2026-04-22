import { useEffect, useState } from 'react';
import { sampleClients } from '../data/sampleClients';

const STORAGE_KEY = 'insuranceCRM';

export function useClients() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setClients(JSON.parse(saved));
    } else {
      setClients(sampleClients);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleClients));
    }
  }, []);

  useEffect(() => {
    if (clients.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    }
  }, [clients]);

  const addClient = (data) => {
    const today = new Date().toISOString().split('T')[0];
    const created = data.createdDate || today;
    const newClient = {
      ...data,
      id: Date.now(),
      policies: [],
      interactions: [],
      createdDate: created,
      lastReviewDate: '',
      totalBankBalance: data.totalBankBalance || '0',
      bankBalanceHistory: data.totalBankBalance
        ? [{ date: created, balance: data.totalBankBalance, notes: 'Initial client onboarding' }]
        : [],
    };
    setClients((prev) => [...prev, newClient]);
  };

  const updateClient = (id, data) =>
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));

  const deleteClient = (id) => setClients((prev) => prev.filter((c) => c.id !== id));

  const addPolicy = (clientId, policy) =>
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId ? { ...c, policies: [...c.policies, { ...policy, id: Date.now() }] } : c,
      ),
    );

  const updatePolicy = (clientId, policyId, policy) =>
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? { ...c, policies: c.policies.map((p) => (p.id === policyId ? { ...policy, id: p.id } : p)) }
          : c,
      ),
    );

  const deletePolicy = (clientId, policyId) =>
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId ? { ...c, policies: c.policies.filter((p) => p.id !== policyId) } : c,
      ),
    );

  const addInteraction = (clientId, interaction) =>
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? { ...c, interactions: [...c.interactions, { ...interaction, id: Date.now() }] }
          : c,
      ),
    );

  const updateInteraction = (clientId, interactionId, interaction) =>
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              interactions: c.interactions.map((i) =>
                i.id === interactionId ? { ...interaction, id: i.id } : i,
              ),
            }
          : c,
      ),
    );

  const deleteInteraction = (clientId, interactionId) =>
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? { ...c, interactions: c.interactions.filter((i) => i.id !== interactionId) }
          : c,
      ),
    );

  const addBankBalance = (clientId, record) =>
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              totalBankBalance: record.balance,
              bankBalanceHistory: [...(c.bankBalanceHistory || []), record],
              lastReviewDate: record.date,
            }
          : c,
      ),
    );

  const updateBankBalance = (clientId, index, record) =>
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              totalBankBalance: record.balance,
              bankBalanceHistory: c.bankBalanceHistory.map((r, idx) => (idx === index ? record : r)),
              lastReviewDate: record.date,
            }
          : c,
      ),
    );

  const deleteBankBalance = (clientId, index) =>
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        const history = c.bankBalanceHistory.filter((_, idx) => idx !== index);
        const total = history.length > 0 ? history[history.length - 1].balance : '0';
        return { ...c, bankBalanceHistory: history, totalBankBalance: total };
      }),
    );

  return {
    clients,
    addClient,
    updateClient,
    deleteClient,
    addPolicy,
    updatePolicy,
    deletePolicy,
    addInteraction,
    updateInteraction,
    deleteInteraction,
    addBankBalance,
    updateBankBalance,
    deleteBankBalance,
  };
}
