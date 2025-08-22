import { useState } from "react";
import { Search, Plus, Download, FileText, Mail, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const filteredEstimates = mockEstimates.filter(estimate => {
    const matchesSearch = 
      estimate.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimate.estimateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimate.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "ALL" || estimate.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const getMonthlyTotal = (month: string) => {
    return mockEstimates
      .filter(estimate => estimate.date.includes(month))
      .reduce((sum, estimate) => sum + estimate.amount, 0);
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
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Use Template
            <Badge className="ml-1 bg-primary text-primary-foreground text-xs">PRO</Badge>
          </Button>
          <Button size="sm">
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
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="PENDING" className="text-sm">PENDING</TabsTrigger>
          <TabsTrigger value="APPROVED" className="text-sm">APPROVED</TabsTrigger>
          <TabsTrigger value="DECLINED" className="text-sm">DECLINED</TabsTrigger>
          <TabsTrigger value="ALL" className="text-sm">ALL</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {Object.entries(groupedEstimates).map(([month, estimates]) => (
            <div key={month} className="space-y-4">
              {/* Month Header */}
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="text-lg font-semibold text-foreground">{month}</h3>
                <p className="text-sm text-muted-foreground">
                  Total: ${getMonthlyTotal(month.split(' ')[0]).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Estimates List */}
              {estimates.map((estimate) => (
                <Card key={estimate.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-4">
                          <div>
                            <h4 className="font-semibold text-foreground">
                              {estimate.clientName} - {estimate.estimateNumber}
                            </h4>
                            <p className="text-sm text-muted-foreground">{estimate.date}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status="ISSUED" />
                            <SyncIndicator status={estimate.syncStatus} />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">{estimate.address}</p>
                            <p className="text-muted-foreground">{estimate.city}</p>
                            <p className="text-muted-foreground">{estimate.phone}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {estimate.emailStatus === 'sent' ? (
                              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                                <Mail className="w-3 h-3" />
                                Email sent
                              </div>
                            ) : estimate.emailStatus === 'opened' ? (
                              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                                <MailOpen className="w-3 h-3" />
                                Email opened
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xl font-bold text-foreground">
                            ${estimate.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Open</Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};