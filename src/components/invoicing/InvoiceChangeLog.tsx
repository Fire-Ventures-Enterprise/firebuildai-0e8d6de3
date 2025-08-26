import { useState } from 'react';
import { FileText, Clock, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

interface InvoiceChangeLogProps {
  invoiceId: string;
  changeLogs: any[];
}

export default function InvoiceChangeLog({ invoiceId, changeLogs }: InvoiceChangeLogProps) {
  const [filter, setFilter] = useState<string>('all');

  const filteredLogs = changeLogs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'overrides') return log.override_used;
    if (filter === 'changes') return log.change_type.includes('change');
    return log.change_type === filter;
  });

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'override_used':
        return '🔓';
      case 'amount_change':
        return '💰';
      case 'item_added':
        return '➕';
      case 'item_removed':
        return '➖';
      case 'change_order_applied':
        return '📋';
      default:
        return '📝';
    }
  };

  const getChangeBadgeVariant = (changeType: string): "default" | "secondary" | "destructive" | "outline" => {
    if (changeType === 'override_used') return 'destructive';
    if (changeType === 'change_order_applied') return 'default';
    return 'secondary';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Change History
        </CardTitle>
        <CardDescription>
          Complete audit trail of all invoice modifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Changes</TabsTrigger>
            <TabsTrigger value="overrides">Overrides</TabsTrigger>
            <TabsTrigger value="changes">Amounts</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No changes recorded</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getChangeIcon(log.change_type)}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{log.description}</p>
                            <Badge variant={getChangeBadgeVariant(log.change_type)}>
                              {log.change_type.replace('_', ' ')}
                            </Badge>
                            {log.override_used && (
                              <Badge variant="destructive">Override Used</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {format(new Date(log.created_at), 'PPP p')}
                          </p>
                          
                          {/* Show value changes */}
                          {log.old_value && log.new_value && (
                            <div className="mt-2 p-2 bg-muted rounded text-sm">
                              {log.change_type === 'amount_change' && (
                                <div className="flex items-center gap-2">
                                  <span className="text-red-600">
                                    {formatCurrency(log.old_value.total)}
                                  </span>
                                  <span>→</span>
                                  <span className="text-green-600">
                                    {formatCurrency(log.new_value.total)}
                                  </span>
                                </div>
                              )}
                              {log.change_type === 'item_modified' && (
                                <div>
                                  <p>Item: {log.new_value.description}</p>
                                  <div className="flex items-center gap-2">
                                    <span>Qty: {log.old_value.quantity} → {log.new_value.quantity}</span>
                                    <span className="mx-2">|</span>
                                    <span>Rate: {formatCurrency(log.old_value.rate)} → {formatCurrency(log.new_value.rate)}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Show new items */}
                          {log.change_type === 'item_added' && log.new_value && (
                            <div className="mt-2 p-2 bg-green-50 dark:bg-green-950 rounded text-sm">
                              <p>{log.new_value.description}</p>
                              <p>Qty: {log.new_value.quantity} × {formatCurrency(log.new_value.rate)}</p>
                            </div>
                          )}
                          
                          {/* Show removed items */}
                          {log.change_type === 'item_removed' && log.old_value && (
                            <div className="mt-2 p-2 bg-red-50 dark:bg-red-950 rounded text-sm line-through">
                              <p>{log.old_value.description}</p>
                              <p>Qty: {log.old_value.quantity} × {formatCurrency(log.old_value.rate)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="overrides" className="space-y-3">
            {filteredLogs.filter(l => l.override_used).map((log) => (
              <div key={log.id} className="border border-amber-500 rounded-lg p-3 bg-amber-50 dark:bg-amber-950">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-amber-600" />
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    Lock Override Used
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(new Date(log.created_at), 'PPP p')}
                </p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}