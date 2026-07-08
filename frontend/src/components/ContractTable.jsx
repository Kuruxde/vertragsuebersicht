import { useState } from 'react';
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  TextField,
  InputAdornment,
  TableContainer,
  Button,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { getStatusMeta, getIntervalLabel } from '../constants/contractOptions.js';

const currencyFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

function formatDuration(contract) {
  if (contract.durationMonths) return `${contract.durationMonths} Monate`;
  if (contract.endDate) return new Date(contract.endDate).toLocaleDateString('de-DE');
  return 'Unbefristet';
}

/**
 * Tabelle mit allen Verträgen inkl. Suche, Status-Chips und
 * Aktions-Dropdown ("Mehr") pro Zeile.
 */
export default function ContractTable({ contracts, onSearch, onAddClick, onEdit, onDeleteRequest }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeContract, setActiveContract] = useState(null);

  const openMenu = (event, contract) => {
    setAnchorEl(event.currentTarget);
    setActiveContract(contract);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    setActiveContract(null);
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          placeholder="Verträge durchsuchen…"
          size="small"
          onChange={(e) => onSearch(e.target.value)}
          sx={{ maxWidth: { sm: 320 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAddClick} sx={{ whiteSpace: 'nowrap' }}>
          Neuer Vertrag
        </Button>
      </Box>

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Vertragsname</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Kategorie</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Preis</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Laufzeit</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Anbieter</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Info</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                Mehr
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">Keine Verträge gefunden.</Typography>
                </TableCell>
              </TableRow>
            )}
            {contracts.map((contract) => {
              const statusMeta = getStatusMeta(contract.status);
              return (
                <TableRow key={contract.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{contract.name}</TableCell>
                  <TableCell>
                    <Chip label={statusMeta.label} color={statusMeta.color} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{contract.category}</TableCell>
                  <TableCell>
                    {currencyFormatter.format(contract.amount)}
                    <Typography component="span" variant="caption" color="text.secondary">
                      {' '}
                      / {getIntervalLabel(contract.paymentInterval).toLowerCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDuration(contract)}</TableCell>
                  <TableCell>{contract.provider}</TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {contract.info || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => openMenu(e, contract)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            onEdit(activeContract);
            closeMenu();
          }}
        >
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Vertrag bearbeiten</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDeleteRequest(activeContract);
            closeMenu();
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Vertrag löschen</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
}
