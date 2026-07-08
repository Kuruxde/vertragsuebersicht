import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  Typography,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { STATUS_OPTIONS, PAYMENT_INTERVAL_OPTIONS, CATEGORY_OPTIONS } from '../constants/contractOptions.js';

const emptyForm = {
  name: '',
  category: '',
  provider: '',
  contractNumber: '',
  startDate: '',
  durationMonths: '',
  cancellationDays: '',
  amount: '',
  paymentTxt: 'MONTHLY',
  status: 'ACTIVE',
  info: '',
};

/**
 * Dialog zum Anlegen bzw. Bearbeiten eines Vertrags.
 * Wird sowohl vom "+"-Button als auch von "Vertrag bearbeiten" verwendet.
 */
export default function ContractFormDialog({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...emptyForm,
        ...initialData,
        startDate: initialData.startDate ? initialData.startDate.substring(0, 10) : '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData, open]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const isValid = form.name && form.category && form.provider && form.startDate && form.amount;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          {isEditMode ? 'Vertrag bearbeiten' : 'Neuen Vertrag anlegen'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Vertragsname"
              fullWidth
              required
              value={form.name}
              onChange={handleChange('name')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Kategorie"
              fullWidth
              required
              value={form.category}
              onChange={handleChange('category')}
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Anbieter / Verkäufer"
              fullWidth
              required
              value={form.provider}
              onChange={handleChange('provider')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Vertragsnummer"
              fullWidth
              value={form.contractNumber}
              onChange={handleChange('contractNumber')}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Beginn"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={form.startDate}
              onChange={handleChange('startDate')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Laufzeit (Monate)"
              type="number"
              fullWidth
              value={form.durationMonths}
              onChange={handleChange('durationMonths')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Kündigungsfrist (Tage)"
              type="number"
              fullWidth
              value={form.cancellationDays}
              onChange={handleChange('cancellationDays')}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Preis"
              type="number"
              fullWidth
              required
              value={form.amount}
              onChange={handleChange('amount')}
              InputProps={{ startAdornment: <InputAdornment position="start">€</InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="Zahlungsintervall"
              fullWidth
              value={form.paymentTxt}
              onChange={handleChange('paymentTxt')}
            >
              {PAYMENT_INTERVAL_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="Status"
              fullWidth
              value={form.status}
              onChange={handleChange('status')}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Notizen / Info"
              fullWidth
              multiline
              minRows={3}
              value={form.info}
              onChange={handleChange('info')}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Abbrechen
        </Button>
        <Button variant="contained" disabled={!isValid || submitting} onClick={handleSubmit}>
          {isEditMode ? 'Speichern' : 'Vertrag anlegen'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
