import { useState } from 'react';
import { Plus, DollarSign, Filter, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  vendor: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  attachedTo?: string;
}

const mockExpenses: Expense[] = [
  {
    id: '1',
    date: '2024-01-15',
    description: 'Lumber for kitchen renovation',
    category: 'Materials',
    vendor: 'Home Depot',
    amount: 1250.00,
    status: 'approved',
    attachedTo: 'Job #1234',
  },
  {
    id: '2',
    date: '2024-01-14',
    description: 'Electrical supplies',
    category: 'Materials',
    vendor: 'Electrical Wholesale',
    amount: 450.75,
    status: 'approved',
    attachedTo: 'Job #1235',
  },
  {
    id: '3',
    date: '2024-01-13',
    description: 'Gas for company truck',
    category: 'Fleet',
    vendor: 'Shell',
    amount: 95.50,
    status: 'pending',
  },
  {
    id: '4',
    date: '2024-01-12',
    description: 'Tool rental',
    category: 'Equipment',
    vendor: 'United Rentals',
    amount: 320.00,
    status: 'approved',
    attachedTo: 'Job #1234',
  },
];

export default function ExpensesPage() {
  const [expenses] = useState<Expense[]>(mockExpenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || expense.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const approvedExpenses = filteredExpenses
    .filter(e => e.status === 'approved')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = filteredExpenses
    .filter(e => e.status === 'pending')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-primary" />
              Expense Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Track and manage all your business expenses
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  ${approvedExpenses.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  ${pendingExpenses.toFixed(2)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{filteredExpenses.length}</p>
                <p className="text-xs text-muted-foreground">transactions</p>
              </div>
              <Filter className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Materials">Materials</SelectItem>
                <SelectItem value="Equipment">Equipment</SelectItem>
                <SelectItem value="Fleet">Fleet</SelectItem>
                <SelectItem value="Labor">Labor</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expense List</CardTitle>
          <CardDescription>
            All expenses for the current period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Attached To</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.vendor}</TableCell>
                  <TableCell>
                    {expense.attachedTo ? (
                      <Badge variant="outline">{expense.attachedTo}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">${expense.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(expense.status)}>
                      {expense.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}