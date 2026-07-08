import { useState, useCallback, useEffect } from 'react';
import { contractService } from '../services/contractService.js';

/**
 * Kapselt State und Logik rund um das Laden/Anlegen/Bearbeiten/Löschen
 * von Verträgen. Hält Seiten-Komponenten schlank.
 */
export function useContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContracts = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contractService.getAll(params);
      setContracts(data);
    } catch (err) {
      setError('Verträge konnten nicht geladen werden.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const createContract = async (data) => {
    const newContract = await contractService.create(data);
    setContracts((prev) => [newContract, ...prev]);
    return newContract;
  };

  const updateContract = async (id, data) => {
    const updated = await contractService.update(id, data);
    setContracts((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const deleteContract = async (id) => {
    await contractService.remove(id);
    setContracts((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    contracts,
    loading,
    error,
    fetchContracts,
    createContract,
    updateContract,
    deleteContract,
  };
}
