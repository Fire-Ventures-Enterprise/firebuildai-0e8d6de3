import { useState } from "react";
import { Search, Plus, Download, FileText, Mail, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EstimateDialog } from "./EstimateDialog";
import { EstimateViewDialog } from "./EstimateViewDialog";
import { TemplateDialog } from "./TemplateDialog";
import { toast } from "sonner";

interface Estimate {
  id: string;
  clientName: string;
  estimateNumber: string;
  address: string;
  city: string;
  phone: string;
  amount: number;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
  emailStatus: 'sent' | 'opened' | 'none';
  syncStatus: 'syncing' | 'error' | 'synced';
}

const mockEstimates: Estimate[] = [
  {
    id: '1',
    clientName: 'Michael Manulak',
    estimateNumber: '#21043',
    address: '54 Maple View cres',
    city: 'Ottawa',
    phone: '6132182868',
    amount: 19376.11,
    date: 'August 21st 2025',
    status: 'PENDING',
    emailStatus: 'sent',
    syncStatus: 'syncing'
  },
  {
    id: '2',
    clientName: '911 Restoration Of Ottawa',
    estimateNumber: '#21041',
    address: '11 Tristan Court # 4',
    city: 'Ottawa',
    phone: '6132249292',
    amount: 21607.42,
    date: 'August 15th 2025',
    status: 'PENDING',
    emailStatus: 'opened',
    syncStatus: 'error'
  },
  {
    id: '3',
    clientName: '911 Restoration Of Ottawa',
    estimateNumber: '#21038',
    address: '11 Tristan Court # 4',
    city: 'Ottawa',
    phone: '6132249292',
    amount: 3645.05,
    date: 'June 16th 2025',
    status: 'APPROVED',
    emailStatus: 'opened',
    syncStatus: 'synced'
  }
];

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    ISSUED: "bg-blue-100 text-blue-800 border-blue-200",
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    APPROVED: "bg-green-100 text-green-800 border-green-200",
    DECLINED: "bg-red-100 text-red-800 border-red-200"
  };
  
  return (
    <Badge variant="outline" className={variants[status as keyof typeof variants] || variants.PENDING}>
      {status}
    </Badge>
  );
};

const SyncIndicator = ({ status }: { status: string }) => {
  if (status === 'syncing') {
    return (
      <div className="flex items-center gap-1 text-blue-600 text-xs">
        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        QB Syncing
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="flex items-center gap-1 text-red-600 text-xs">
        <div className="w-3 h-3 bg-current rounded-full"></div>
        Sync Error
      </div>
    );
  }
  return null;
};

export const EstimatesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("PENDING");
  const [estimates, setEstimates] = useState(mockEstimates);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);

  const filteredEstimates = estimates.filter(estimate => {
    const matchesSearch = 
      estimate.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimate.estimateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimate.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "ALL" || estimate.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const getMonthlyTotal = (month: string) => {
    return estimates
      .filter(estimate => estimate.date.includes(month))
      .reduce((sum, estimate) => sum + estimate.amount, 0);
  };

  const handleCreateEstimate = (data: any) => {
    const newEstimate: Estimate = {
      id: String(estimates.length + 1),
      clientName: data.clientName,
      estimateNumber: `#${20000 + estimates.length + 1}`,
      address: data.address,
      city: data.city,
      phone: data.phone,
      amount: parseFloat(data.amount),
      date: data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: data.status,
      emailStatus: 'none',
      syncStatus: 'synced'
    };
    setEstimates(prev => [newEstimate, ...prev]);
    toast.success("Estimate created successfully!");
  };

  const handleEditEstimate = (data: any) => {
    if (!selectedEstimate) return;
    
    const updatedEstimate: Estimate = {
      ...selectedEstimate,
      clientName: data.clientName,
      address: data.address,
      city: data.city,
      phone: data.phone,
      amount: parseFloat(data.amount),
      date: data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: data.status
    };
    
    setEstimates(prev => prev.map(est => est.id === selectedEstimate.id ? updatedEstimate : est));
    toast.success("Estimate updated successfully!");
  };

  const handleOpenEstimate = (estimate: Estimate) => {
    setSelectedEstimate(estimate);
    setShowViewDialog(true);
  };

  const handleEditClick = (estimate: Estimate) => {
    setSelectedEstimate(estimate);
    setShowEditDialog(true);
  };

  const handleUseTemplate = (template: any) => {
    const templateData = {
      clientName: '',
      address: '',
      city: '',
      phone: '',
      amount: template.amount,
      date: new Date(),
      status: 'PENDING',
      workScope: `${template.name} - ${template.description}`,
      materials: template.items.join(', '),
      labor: 'Standard labor rates apply',
      notes: `Template used: ${template.name}`
    };
    
    // Create estimate from template
    handleCreateEstimate(templateData);
  };

  const handleExport = () => {
    const csvContent = [
      ['Client Name', 'Estimate #', 'Address', 'City', 'Phone', 'Amount', 'Date', 'Status'],
      ...estimates.map(est => [
        est.clientName,
        est.estimateNumber,
        est.address,
        est.city,
        est.phone,
        est.amount,
        est.date,
        est.status
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'estimates.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Estimates exported successfully!");
  };

  const groupedEstimates = filteredEstimates.reduce((groups, estimate) => {
    const month = estimate.date.includes('August') ? 'August 2025' : 'June 2025';
    if (!groups[month]) {
      groups[month] = [];
    }
    groups[month].push(estimate);
    return groups;
  }, {} as Record<string, Estimate[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Estimates</h1>
          <p className="text-muted-foreground mt-1">Manage your project estimates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowTemplateDialog(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Use Template
            <Badge className="ml-1 bg-primary text-primary-foreground text-xs">PRO</Badge>
          </Button>
          <Button size="sm" onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Estimate
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search all estimates by Name, Address, Estimate # or PO #"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Status Tabs */}
      <div className="bg-white rounded-lg border shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-lg grid-cols-4 bg-muted/30 p-1 h-12">
            <TabsTrigger value="PENDING" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              PENDING ({mockEstimates.filter(e => e.status === 'PENDING').length})
            </TabsTrigger>
            <TabsTrigger value="APPROVED" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              APPROVED ({mockEstimates.filter(e => e.status === 'APPROVED').length})
            </TabsTrigger>
            <TabsTrigger value="DECLINED" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              DECLINED ({mockEstimates.filter(e => e.status === 'DECLINED').length})
            </TabsTrigger>
            <TabsTrigger value="ALL" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              ALL ({mockEstimates.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6 mt-6">
            {Object.keys(groupedEstimates).length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No estimates found</h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === 'ALL' ? 'No estimates created yet.' : `No ${activeTab.toLowerCase()} estimates found.`}
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Estimate
                </Button>
              </div>
            ) : (
              <>
                {Object.entries(groupedEstimates).map(([month, estimates]) => (
                  <div key={month} className="space-y-4">
                    {/* Month Header */}
                    <div className="flex items-center justify-between bg-muted/30 px-4 py-3 rounded-lg border">
                      <h3 className="text-lg font-semibold text-foreground">{month}</h3>
                      <div className="flex items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                          {estimates.length} estimate{estimates.length !== 1 ? 's' : ''}
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          Total: ${getMonthlyTotal(month.split(' ')[0]).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>

                    {/* Estimates List */}
                    <div className="space-y-3">
                      {estimates.map((estimate) => (
                        <Card key={estimate.id} className="border-2 hover:shadow-lg transition-all duration-200 bg-white">
                          <CardContent className="p-0">
                            <div className="flex items-center">
                              {/* Left side - Estimate info */}
                              <div className="flex-1 p-6">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                      <h4 className="text-lg font-bold text-foreground">
                                        {estimate.estimateNumber}
                                      </h4>
                                      <div className="flex items-center gap-2">
                                        <StatusBadge status={estimate.status} />
                                        <SyncIndicator status={estimate.syncStatus} />
                                      </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">{estimate.date}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">
                                      ${estimate.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-foreground">{estimate.clientName}</p>
                                    <p className="text-sm text-muted-foreground">{estimate.address}</p>
                                    <p className="text-sm text-muted-foreground">{estimate.city}</p>
                                    <p className="text-sm text-muted-foreground">{estimate.phone}</p>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    {estimate.emailStatus === 'sent' && (
                                      <div className="flex items-center gap-1 text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded">
                                        <Mail className="w-3 h-3" />
                                        Email sent
                                      </div>
                                    )}
                                    {estimate.emailStatus === 'opened' && (
                                      <div className="flex items-center gap-1 text-green-600 text-xs bg-green-50 px-2 py-1 rounded">
                                        <MailOpen className="w-3 h-3" />
                                        Email opened
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Right side - Actions */}
                              <div className="border-l bg-muted/20 p-6 flex flex-col gap-2 min-w-[140px]">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleOpenEstimate(estimate)}
                                  className="w-full justify-center font-medium"
                                >
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEditClick(estimate)}
                                  className="w-full justify-center font-medium"
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="w-full justify-center font-medium text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                  Send
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <EstimateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        mode="create"
        onSave={handleCreateEstimate}
      />

      <EstimateDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        estimate={selectedEstimate}
        mode="edit"
        onSave={handleEditEstimate}
      />

      <EstimateViewDialog
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        estimate={selectedEstimate}
        onEdit={() => {
          setShowViewDialog(false);
          setShowEditDialog(true);
        }}
      />

      <TemplateDialog
        open={showTemplateDialog}
        onOpenChange={setShowTemplateDialog}
        onSelectTemplate={handleUseTemplate}
      />
    </div>
  );
};