import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const DiscountCodes = () => {
  const [codes, setCodes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const [newCode, setNewCode] = useState({
    code: "",
    type: "percentage",
    value: "",
    expiry_date: "",
    usage_limit: ""
  });

  const fetchCodes = async () => {
    setIsLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/admin/discount-codes`, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) setCodes(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.code || !newCode.value) return;
    setIsCreating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const payload = {
        code: newCode.code.trim().toUpperCase(),
        type: newCode.type,
        value: Number(newCode.value),
        expiry_date: newCode.expiry_date || null,
        usage_limit: newCode.usage_limit ? Number(newCode.usage_limit) : null
      };
      
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/admin/discount-codes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success("Discount code created");
      setIsCreateOpen(false);
      setNewCode({ code: "", type: "percentage", value: "", expiry_date: "", usage_limit: "" });
      fetchCodes();
    } catch (err: any) {
      toast.error(err.message || "Failed to create");
    } finally {
      setIsCreating(false);
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/admin/discount-codes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ active: !currentActive })
      });
      fetchCodes();
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const deleteCode = async (id: string) => {
    if (!confirm("Delete this code forever?")) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/admin/discount-codes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      fetchCodes();
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-light tracking-tight">Discount Codes</h3>
          <p className="text-sm text-muted-foreground font-light">Create and manage promotional codes</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="text-[11px] uppercase tracking-wider font-normal bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              New Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-light">Create Discount Code</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider">Code Name</Label>
                <Input placeholder="e.g. WELCOME10" value={newCode.code} onChange={(e) => setNewCode({...newCode, code: e.target.value.toUpperCase()})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider">Type</Label>
                  <select 
                    value={newCode.type} 
                    onChange={(e) => setNewCode({...newCode, type: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (RM)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider">Value</Label>
                  <Input type="number" placeholder={newCode.type === 'percentage' ? "e.g. 10" : "e.g. 50"} value={newCode.value} onChange={(e) => setNewCode({...newCode, value: e.target.value})} required min="1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider">Expiry (Optional)</Label>
                  <Input type="date" value={newCode.expiry_date} onChange={(e) => setNewCode({...newCode, expiry_date: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider">Usage Limit (Optional)</Label>
                  <Input type="number" placeholder="e.g. 100" value={newCode.usage_limit} onChange={(e) => setNewCode({...newCode, usage_limit: e.target.value})} min="1" />
                </div>
              </div>
              <Button type="submit" disabled={isCreating} className="w-full">
                {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Code"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border border-border shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[11px] uppercase tracking-wider">Code</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Discount</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Usage</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Expiry</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-6 text-sm text-muted-foreground">Loading...</TableCell></TableRow>
            ) : codes.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-6 text-sm text-muted-foreground font-light">No discount codes found</TableCell></TableRow>
            ) : (
              codes.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.code}</TableCell>
                  <TableCell className="font-light">
                    {c.type === 'percentage' ? `${c.value}%` : `RM${c.value}`}
                  </TableCell>
                  <TableCell className="font-light">
                    {c.times_used} {c.usage_limit ? `/ ${c.usage_limit}` : 'uses'}
                  </TableCell>
                  <TableCell className="font-light text-muted-foreground">
                    {c.expiry_date ? new Date(c.expiry_date).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={c.active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700 cursor-pointer"} onClick={() => toggleActive(c.id, c.active)}>
                      {c.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => deleteCode(c.id)} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
