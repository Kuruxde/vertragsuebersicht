import { useState, useEffect, useCallback } from 'react';
import { contractService } from '../services/contractService.js';

/**
 * Lädt die Dashboard-Kennzahlen (Karte 1 & 2).
 */
export function useDashboardStats() {
  const [stats, setStats] = useState({ totalMonthlyCost: 0, activeContractsCount: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contractService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Dashboard-Statistiken konnten nicht geladen werden.', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
}
