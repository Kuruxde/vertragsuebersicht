import { useState, useMemo } from 'react';
import { Grid, Box, Typography, Snackbar, Alert } from '@mui/material';
import EuroOutlinedIcon from '@mui/icons-material/EuroOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';

import StatCard from '../components/StatCard.jsx';
import ContractTable from '../components/ContractTable.jsx';
import ContractFormDialog from '../components/ContractFormDialog.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

import { useContracts } from '../hooks/useContracts.js';
import { useDashboardStats } from '../hooks/useDashboardStats.js';

const currencyFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

/**
 * Dashboard-Seite: Info-Karten + durchsuchbare Vertragstabelle.
 * Zentrale Seite der Anwendung, wird direkt nach dem (zukünftigen) Login angezeigt.
 */
export default function DashboardPage() {
  const { contracts, loading, createContract, updateContract, deleteContract } = useContracts();
  const { stats, refetch: refetchStats } = useDashboardStats();

  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const filteredContracts = useMemo(() => {
    if (!searchTerm) return contracts;
    const term = searchTerm.toLowerCase();
    return contracts.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.provider.toLowerCase().includes(term) ||
        c.category.toLowerCase().includes(term)
    );
  }, [contracts, searchTerm]);

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  const handleAddClick = () => {
    setEditingContract(null);
    setFormOpen(true);
  };

  const handleEdit = (contract) => {
    setEditingContract(contract);
    setFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingContract) {
        await updateContract(editingContract.id, formData);
        showSnackbar('Vertrag wurde aktualisiert.');
      } else {
        await createContract(formData);
        showSnackbar('Vertrag wurde angelegt.');
      }
      refetchStats();
    } catch (err) {
      showSnackbar('Es ist ein Fehler aufgetreten.', 'error');
      throw err;
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteContract(deleteTarget.id);
      showSnackbar('Vertrag wurde gelöscht.');
      refetchStats();
    } catch (err) {
      showSnackbar('Löschen fehlgeschlagen.', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Übersicht
      </Typography>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Monatliche Kosten (aktiv)"
            value={currencyFormatter.format(stats.totalMonthlyCost)}
            icon={<EuroOutlinedIcon sx={{ color: '#4F46E5' }} />}
            accentColor="#4F46E5"
            subtitle="Summe aller aktiven Verträge"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Aktive Verträge"
            value={stats.activeContractsCount}
            icon={<DescriptionOutlinedIcon sx={{ color: '#0EA5E9' }} />}
            accentColor="#0EA5E9"
            subtitle="Derzeit laufende Verträge"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Weitere Statistiken"
            value="Bald verfügbar"
            icon={<InsightsOutlinedIcon sx={{ color: '#16A34A' }} />}
            accentColor="#16A34A"
            subtitle="Platzhalter für zukünftige Auswertungen"
          />
        </Grid>
      </Grid>

      <ContractTable
        contracts={filteredContracts}
        loading={loading}
        onSearch={setSearchTerm}
        onAddClick={handleAddClick}
        onEdit={handleEdit}
        onDeleteRequest={setDeleteTarget}
      />

      <ContractFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingContract}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Vertrag löschen"
        description={`Möchtest du den Vertrag "${deleteTarget?.name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`}
        confirmLabel="Löschen"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
