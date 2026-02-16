import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  Drawer,
  IconButton,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import configData from '../config.json';
import FinanceChart from '../components/FinanceChart.jsx';

const SectorView = () => {
    const theme = useTheme();
    const [sectorList, setSectorList] = useState([]);
    const [sectorCompanyList, setSectorCompanyList] = useState([]);
    const [sectorFinanceList, setSectorFinanceList] = useState([]);
    const [selectedSector, setSelectedSector] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [financeChartVisible, setFinanceChartVisible] = useState(false);
    const [financeChartCompany, setFinanceChartCompany] = useState('');
    const [financeChartData, setFinanceChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        requestSectorList();
    }, []);

    const requestSectorList = async () => {
        try {
            setLoading(true);
            const base = configData.baseUrl || `${configData.protocol}://${configData.server}:${configData.port}`;
            const response = await axios.get(`${base}/sector-list`);
            const data = response.data;
            
            if (data.status === 'success') {
                setSectorList(data.sectorList);
                if (data.sectorList.length > 0) {
                    setSelectedSector(data.sectorList[0]);
                    requestSectorCompanyList(data.sectorList[0]);
                }
            } else {
                setError('セクター一覧の取得に失敗しました。');
            }
        } catch (error) {
            handleRequestError(error);
        } finally {
            setLoading(false);
        }
    };

    const requestSectorCompanyList = async (sector) => {
        try {
            setLoading(true);
            const base = configData.baseUrl || `${configData.protocol}://${configData.server}:${configData.port}`;
            const response = await axios.post(`${base}/sector-company-list`, {
                sector: sector
            });
            const data = response.data;
            
            if (data.status === 'success') {
                setSectorCompanyList(data.companyList);
                setSectorFinanceList(JSON.parse(data.financeList));
                if (data.companyList.length > 0) {
                    setSelectedCompany(data.companyList[0]);
                }
            } else {
                setError('企業一覧の取得に失敗しました。');
            }
        } catch (error) {
            handleRequestError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSectorChange = (event) => {
        const sector = event.target.value;
        setSelectedSector(sector);
        requestSectorCompanyList(sector);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCompanyChange = (event) => {
        const company = event.target.value;
        setSelectedCompany(company);
        // 해당 회사 카드로 스크롤
        const element = document.getElementById(`company-${company}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleFinanceChartClick = (companyName) => {
        setFinanceChartCompany(companyName);
        setFinanceChartVisible(true);
        setFinanceChartData(getFinanceList(companyName));
    };

    const handleRequestError = (error) => {
        if (!error.response) {
            setError('ネットワークエラーが発生しました。');
        } else {
            const code = error.response.status;
            if (code === 401) {
                sessionStorage.removeItem('api_key');
                setError('ログインセッションが終了しました。再度ログインしてください。');
            } else {
                setError('サーバーエラーが発生しました。');
            }
        }
    };

    const getFinanceList = (name) => {
        const retRows = [];
        let found = false;
        for (let i = 0; i < sectorFinanceList.length; i++) {
            if (sectorFinanceList[i].name === name) {
                found = true;
                retRows.push(sectorFinanceList[i]);
            } else {
                if (found === true) break;
            }
        }
        return retRows;
    };

    const formatNumber = (num) => {
        if (num === null || num === undefined) return '-';
        return new Intl.NumberFormat('ja-JP').format(num);
    };

    const renderCompanyCards = () => {
        return sectorCompanyList.map((companyName, index) => {
            const financeRows = getFinanceList(companyName);
            
            return (
                <Card 
                    key={index} 
                    id={`company-${companyName}`}
                    sx={{ mb: 3 }}
                >
                    <CardHeader
                        title={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">{companyName}</Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<BarChartIcon />}
                                    onClick={() => handleFinanceChartClick(companyName)}
                                    size="small"
                                >
                                    チャート表示
                                </Button>
                            </Box>
                        }
                    />
                    <CardContent>
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>年度</TableCell>
                                        <TableCell align="right">資産</TableCell>
                                        <TableCell align="right">負債</TableCell>
                                        <TableCell align="right">資本</TableCell>
                                        <TableCell align="right">売上</TableCell>
                                        <TableCell align="right">営業利益</TableCell>
                                        <TableCell align="right">純利益</TableCell>
                                        <TableCell align="right">時価総額</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {financeRows.map((row, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{row.year}</TableCell>
                                            <TableCell align="right">{formatNumber(row.asset)}</TableCell>
                                            <TableCell align="right">{formatNumber(row.liability)}</TableCell>
                                            <TableCell align="right">{formatNumber(row.capital)}</TableCell>
                                            <TableCell align="right">{formatNumber(row.revenue)}</TableCell>
                                            <TableCell align="right">{formatNumber(row.profit)}</TableCell>
                                            <TableCell align="right">{formatNumber(row.earning)}</TableCell>
                                            <TableCell align="right">{formatNumber(row.marketCap)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            );
        });
    };

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Paper 
                sx={{ 
                    p: 2, 
                    mb: 3,
                    position: 'sticky',
                    top: theme.mixins.toolbar.minHeight, // AppBar/Toolbar 높이만큼 조정
                    zIndex: theme.zIndex.appBar - 1, // AppBar보다 낮은 z-index
                    backgroundColor: 'background.paper',
                    boxShadow: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>セクター選択</InputLabel>
                        <Select
                            value={selectedSector}
                            onChange={handleSectorChange}
                            label="セクター選択"
                        >
                            {sectorList.map((sector, index) => (
                                <MenuItem key={index} value={sector}>
                                    {sector}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>企業選択</InputLabel>
                        <Select
                            value={selectedCompany}
                            onChange={handleCompanyChange}
                            label="企業選択"
                        >
                            {sectorCompanyList.map((company, index) => (
                                <MenuItem key={index} value={company}>
                                    {company}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {selectedSector && (
                        <Chip 
                            label={`${sectorCompanyList.length}社`} 
                            color="primary" 
                            variant="outlined" 
                        />
                    )}
                </Box>
            </Paper>

            {loading ? (
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
            ) : (
                renderCompanyCards()
            )}

            <Drawer
                anchor="right"
                open={financeChartVisible}
                onClose={() => setFinanceChartVisible(false)}
                sx={{ '& .MuiDrawer-paper': { width: '80%', maxWidth: 1200 } }}
            >
                <Box sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">{financeChartCompany} 財務チャート</Typography>
                        <IconButton onClick={() => setFinanceChartVisible(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <FinanceChart data={financeChartData} />
                </Box>
            </Drawer>
        </Box>
    );
};

export default SectorView;
