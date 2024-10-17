import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Nav, Form, Modal, Table } from 'react-bootstrap';
import { Layout } from '../components/Layout/Layout';
import { Line, Pie } from 'react-chartjs-2';
import './Homepage.css';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Footer component
const Footer = () => (
    <footer className="footer bg-primary text-white text-center py-3">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
    </footer>
);

// TotalAmount component to display total income and expenses
const TotalAmount = ({ transactions }) => {
    const totalAmount = transactions.reduce((acc, transaction) => {
        const amount = parseFloat(transaction.amount);
        return transaction.transactionType === 'Income' ? acc + amount : acc - amount;
    }, 0);

    return (
        <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            margin: '20px 0',
            color: totalAmount < 0 ? 'red' : 'green'
        }}>
            Total Amount: {totalAmount.toFixed(2)} {/* Show total with two decimal places */}
        </div>
    );
};

export const Homepage = () => {
    const [formData, setFormData] = useState({
        amount: '',
        transactionType: 'Expense',
        category: 'Food',
        reference: '',
        description: '',
        date: ''
    });

    const [showModal, setShowModal] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [viewTransactions, setViewTransactions] = useState(false);
    const [showModify, setShowModify] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/transactions/get-transaction', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTransactions(response.data);
        } catch (error) {
            console.log('Error fetching transactions:', error);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleShow = () => setShowModal(true);
    const handleClose = () => {
        setShowModal(false);
        setShowModify(false);
        setCurrentTransaction(null); // Reset current transaction
        setFormData({
            amount: '',
            transactionType: 'Expense',
            category: 'Food',
            reference: '',
            description: '',
            date: ''
        });
    };

    const processTransactionsByMonth = () => {
        const monthlyData = Array(12).fill(0);
        transactions.forEach(transaction => {
            const month = new Date(transaction.date).getMonth();
            monthlyData[month] += parseFloat(transaction.amount);
        });
        return monthlyData;
    };

    const lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Transactions',
                data: processTransactionsByMonth(),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        layout: {
            padding: {
                top: 20,
                bottom: 20,
            }
        }
    };

    const processPieData = (type) => {
        const filteredTransactions = transactions.filter(transaction => transaction.transactionType === type);
        const categories = [...new Set(filteredTransactions.map(tx => tx.category))];
        const categoryTotals = categories.map(category => {
            return filteredTransactions
                .filter(tx => tx.category === category)
                .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
        });

        return {
            labels: categories,
            datasets: [
                {
                    data: categoryTotals,
                    backgroundColor: type === 'Income'
                        ? 'rgba(75, 192, 192, 0.6)'
                        : 'rgba(255, 99, 132, 0.6)',
                    borderWidth: 1,
                }
            ],
        };
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        layout: {
            padding: {
                top: 20,
                bottom: 20,
            },
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (currentTransaction) {
                // Update existing transaction
                await axios.put(`http://localhost:8000/api/transactions/modify-transaction/${currentTransaction._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                alert('Transaction updated successfully');
            } else {
                // Add new transaction
                await axios.post('http://localhost:8000/api/transactions/add-transaction', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                alert('Transaction added successfully');
            }
            handleClose();
            fetchTransactions();
        } catch (error) {
            alert('Error processing transaction: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleViewAll = () => {
        setViewTransactions(true);
    };

    const handleBackToChart = () => {
        setViewTransactions(false);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8000/api/transactions/delete-transaction/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTransactions(transactions.filter(transaction => transaction._id !== id));
            alert('Transaction deleted successfully');
        } catch (error) {
            alert('Error deleting transaction: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login'; // Adjust the redirect URL as needed
    };

    const handleModify = (transaction) => {
        setCurrentTransaction(transaction);
        setShowModify(true);
        setFormData({
            amount: transaction.amount,
            transactionType: transaction.transactionType,
            category: transaction.category,
            reference: transaction.reference,
            description: transaction.description,
            date: transaction.date,
        });
    };

    return (
        <div>
            <Layout>
                <Container fluid className="dashboard-container">
                    {/* Navbar */}
                    <Nav className="navbar navbar-expand-lg navbar-light bg-primary mb-4 justify-content-between">
                        <Nav.Link className="text-white" onClick={() => setViewTransactions(false)}>Expense Tracker</Nav.Link>
                        <div>
                            <Button variant="outline-light" className="ml-2" onClick={handleShow}>Add Transaction</Button>
                            <Button variant="outline-light" className="ml-2" onClick={handleViewAll}>View Transactions</Button>
                            <Button variant="outline-light" className="ml-2" onClick={handleLogout}>Logout</Button>
                        </div>
                    </Nav>

                    <Row>
                        <Col className="content-area py-4">
                            <h3 className="text-center mb-4">{viewTransactions ? "Your Transactions" : "Your Expenses Overview"}</h3>

                            {viewTransactions ? (
                                <Table bordered className="mt-3">
                                    <thead>
                                        <tr>
                                            <th>Amount</th>
                                            <th>Type</th>
                                            <th>Category</th>
                                            <th>Description</th>
                                            <th>Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map(transaction => (
                                            <tr key={transaction._id}>
                                                <td>{transaction.amount}</td>
                                                <td>{transaction.transactionType}</td>
                                                <td>{transaction.category}</td>
                                                <td>{transaction.description}</td>
                                                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                                <td>
                                                    <Button variant="danger" onClick={() => handleDelete(transaction._id)}>Delete</Button>
                                                    <Button variant="warning" onClick={() => handleModify(transaction)}>Modify</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <>
                                    {/* Total Amount Display */}
                                    <TotalAmount transactions={transactions} />

                                    <Row className="mb-4">
                                        <Col md={6}>
                                            <div className="chart-container d-flex justify-content-center">
                                                <Pie data={processPieData('Expense')} options={pieOptions} />
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="chart-container d-flex justify-content-center">
                                                <Pie data={processPieData('Income')} options={pieOptions} />
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="graph-container">
                                        <Line data={lineChartData} options={options} height={400} />
                                    </div>
                                </>
                            )}
                        </Col>
                    </Row>
                </Container>
            </Layout>

            {/* Add/Modify Transaction Modal */}
            <Modal show={showModal || showModify} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentTransaction ? "Modify Transaction" : "Add Transaction"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group controlId="formAmount">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="number" name="amount" value={formData.amount} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formTransactionType">
                            <Form.Label>Type</Form.Label>
                            <Form.Control as="select" name="transactionType" value={formData.transactionType} onChange={handleChange}>
                                <option value="Expense">Expense</option>
                                <option value="Income">Income</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formCategory">
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">Select Category</option>
                                <option value="Food">Food</option>
                                <option value="Travel">Travel</option>
                                <option value="Mess">Mess</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formReference">
                            <Form.Label>Reference</Form.Label>
                            <Form.Control type="text" name="reference" value={formData.reference} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" name="description" value={formData.description} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formDate">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit">{currentTransaction ? "Update Transaction" : "Add Transaction"}</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Footer />
        </div>
    );
};
