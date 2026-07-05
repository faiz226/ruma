import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar, Users, DollarSign, Mail, Phone, ArrowLeft, LogOut, Eye, CheckCircle, XCircle, Plus, Loader2, Edit3 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newBooking, setNewBooking] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: ""
  });

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.name || !newBooking.email || !newBooking.checkIn || !newBooking.checkOut) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setIsCreating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/admin/bookings/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          roomId: 'ruma-homestay',
          checkIn: newBooking.checkIn,
          checkOut: newBooking.checkOut,
          guestName: newBooking.name,
          guestEmail: newBooking.email,
          guestPhone: newBooking.phone
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create booking');
      
      toast.success("Booking created & integrations triggered successfully!");
      setIsCreateOpen(false);
      fetchBookings();
      setNewBooking({ name: "", email: "", phone: "", checkIn: "", checkOut: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to create booking");
    } finally {
      setIsCreating(false);
    }
  };

  const [modifyBookingId, setModifyBookingId] = useState<string | null>(null);
  const [modifyDates, setModifyDates] = useState({ checkIn: "", checkOut: "" });
  const [isModifying, setIsModifying] = useState(false);

  const openModifyDialog = (booking: any) => {
    setModifyBookingId(booking.id);
    setModifyDates({
        checkIn: booking.check_in.split('T')[0],
        checkOut: booking.check_out.split('T')[0]
    });
  };

  const handleModifyBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modifyBookingId || !modifyDates.checkIn || !modifyDates.checkOut) return;
    
    setIsModifying(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/admin/bookings/modify`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          bookingId: modifyBookingId,
          checkIn: modifyDates.checkIn,
          checkOut: modifyDates.checkOut
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to modify booking');
      
      toast.success("Booking dates modified successfully!");
      setModifyBookingId(null);
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message || "Failed to modify booking");
    } finally {
      setIsModifying(false);
    }
  };

  const fetchBookings = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('check_in', { ascending: false });
      
    if (error) {
      toast.error("Failed to load bookings");
    } else if (data) {
      setBookings(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (user) {
      fetchBookings();
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground font-light">Loading...</p>
      </div>
    );
  }

  const handleMarkPaid = async (id: string, ref: string) => {
    if (!window.confirm(`Are you sure you want to manually mark booking ${ref} as PAID?`)) return;
    
    const { error } = await supabase.from('bookings').update({ status: 'PAID' }).eq('id', id);
    if (error) {
        toast.error("Failed to update status");
    } else {
        toast.success(`Booking ${ref} marked as PAID`);
        fetchBookings();
    }
  };

  const handleCancelBooking = async (id: string, ref: string) => {
    if (!window.confirm(`Are you sure you want to CANCEL booking ${ref}? This will delete the calendar event.`)) return;
    
    try {
        const { data: { session } } = await supabase.auth.getSession();
        
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/bookings/cancel`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.access_token}`
            },
            body: JSON.stringify({ bookingId: id })
        });
        
        if (response.ok) {
            toast.success(`Booking ${ref} cancelled`);
            fetchBookings();
        } else {
            const err = await response.json();
            toast.error(err.error || "Failed to cancel booking");
        }
    } catch (e) {
        toast.error("Server error during cancellation");
    }
  };

  const filteredBookings = bookings;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending_payment":
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => new Date(b.check_in) >= new Date() && (b.status === 'PAID' || b.status === 'confirmed')).length,
    pending: bookings.filter(b => b.status === 'PENDING_PAYMENT').length,
  };

  const calculateRevenue = () => {
    return bookings
      .filter(b => b.status === 'PAID' || b.status === 'confirmed')
      .reduce((sum, b) => {
        if (b.total_price_cents) {
          return sum + (b.total_price_cents / 100);
        }
        // Fallback for mock data if any
        const nights = Math.ceil((new Date(b.check_out).getTime() - new Date(b.check_in).getTime()) / (1000 * 60 * 60 * 24));
        const day = new Date(b.check_in).getDay();
        const price = (day === 5 || day === 6) ? 270 : 240;
        return sum + (price * nights);
      }, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation variant="dark" />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-[11px] uppercase tracking-wider font-normal"
              >
                <ArrowLeft className="mr-2 h-3 w-3" />
                Back to Home
              </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-[11px] uppercase tracking-wider font-normal text-destructive hover:text-destructive"
                >
                  <LogOut className="mr-2 h-3 w-3" />
                  Sign Out
                </Button>
            </div>
            
            <div className="flex justify-between items-end mb-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-light tracking-tight">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground font-light mt-1">
                  Manage your property bookings and monitor performance
                </p>
              </div>
              
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="text-[11px] uppercase tracking-wider font-normal bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Booking
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="font-light text-xl">Create Manual Booking</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateBooking} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-medium uppercase tracking-wider">Guest Name</Label>
                      <Input id="name" value={newBooking.name} onChange={(e) => setNewBooking({...newBooking, name: e.target.value})} required className="font-light" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider">Email</Label>
                      <Input id="email" type="email" value={newBooking.email} onChange={(e) => setNewBooking({...newBooking, email: e.target.value})} required className="font-light" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-medium uppercase tracking-wider">Phone</Label>
                      <Input id="phone" value={newBooking.phone} onChange={(e) => setNewBooking({...newBooking, phone: e.target.value})} className="font-light" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="checkIn" className="text-xs font-medium uppercase tracking-wider">Check In</Label>
                        <Input id="checkIn" type="date" value={newBooking.checkIn} onChange={(e) => setNewBooking({...newBooking, checkIn: e.target.value})} required className="font-light" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkOut" className="text-xs font-medium uppercase tracking-wider">Check Out</Label>
                        <Input id="checkOut" type="date" value={newBooking.checkOut} onChange={(e) => setNewBooking({...newBooking, checkOut: e.target.value})} required className="font-light" />
                      </div>
                    </div>
                    <div className="pt-4 flex justify-end">
                      <Button type="submit" disabled={isCreating} className="w-full text-[11px] uppercase tracking-wider font-normal">
                        {isCreating ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
                        ) : "Confirm & Send Automations"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          >
            <Card className="p-6 border border-border shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-light mb-1">{stats.total}</p>
              <p className="text-xs text-muted-foreground font-light">Total Bookings</p>
            </Card>
            
            <Card className="p-6 border border-border shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-light mb-1">{stats.upcoming}</p>
              <p className="text-xs text-muted-foreground font-light">Upcoming</p>
            </Card>
            
            <Card className="p-6 border border-border shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
              <p className="text-2xl font-light mb-1">{stats.pending}</p>
              <p className="text-xs text-muted-foreground font-light">Pending</p>
            </Card>
            
            <Card className="p-6 border border-border shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-light mb-1">RM {calculateRevenue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-muted-foreground font-light">Est. Revenue</p>
            </Card>
          </motion.div>

          {/* Bookings Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border border-border shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-[11px] uppercase tracking-wider font-normal">Guest</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-normal">Dates</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-normal">Status</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-normal">Contact</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-normal text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                       <TableRow>
                         <TableCell colSpan={5} className="text-center py-12 text-sm text-muted-foreground">Loading bookings...</TableCell>
                       </TableRow>
                        ) : filteredBookings.map((booking) => {
                          return (
                            <TableRow key={booking.id} className="border-border">
                              <TableCell>
                                <div>
                                  <p className="text-sm font-normal">{booking.guest_name || booking.guestName}</p>
                                  <p className="text-xs text-muted-foreground font-light">{booking.booking_ref || booking.id}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm font-light">
                                  <p>{format(new Date(booking.check_in || booking.checkIn), "MMM d")} - {format(new Date(booking.check_out || booking.checkOut), "MMM d, yyyy")}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {Math.ceil((new Date(booking.check_out || booking.checkOut).getTime() - new Date(booking.check_in || booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs font-light capitalize ${getStatusColor(booking.status)}`}
                                >
                                  {booking.status?.replace('_', ' ')}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  <a 
                                    href={`mailto:${booking.guest_email || booking.email}`} 
                                    className="text-xs text-muted-foreground hover:text-primary font-light flex items-center gap-1"
                                  >
                                    <Mail className="h-3 w-3" />
                                    {booking.guest_email || booking.email}
                                  </a>
                                  <a 
                                    href={`tel:${booking.guest_phone || booking.phone}`} 
                                    className="text-xs text-muted-foreground hover:text-primary font-light flex items-center gap-1"
                                  >
                                    <Phone className="h-3 w-3" />
                                    {booking.guest_phone || booking.phone}
                                  </a>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {(booking.status === 'PAID' || booking.status === 'confirmed') && (
                                    <>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => openModifyDialog(booking)}
                                        className="text-[10px] h-7 px-2 uppercase tracking-wider text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                      >
                                        <Edit3 className="h-3 w-3 mr-1" />
                                        Modify
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => handleCancelBooking(booking.id, booking.booking_ref || booking.id)}
                                        className="text-[10px] h-7 px-2 uppercase tracking-wider text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Cancel
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {!isLoading && filteredBookings.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-sm text-muted-foreground font-light">No bookings found</p>
                    </div>
                  )}
                </Card>
          </motion.div>
        </div>
      </main>
      {/* Modify Booking Dialog */}
      <Dialog open={!!modifyBookingId} onOpenChange={(open) => !open && setModifyBookingId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-light text-xl">Modify Booking Dates</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleModifyBooking} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modCheckIn" className="text-xs font-medium uppercase tracking-wider">New Check In</Label>
                <Input id="modCheckIn" type="date" value={modifyDates.checkIn} onChange={(e) => setModifyDates({...modifyDates, checkIn: e.target.value})} required className="font-light" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modCheckOut" className="text-xs font-medium uppercase tracking-wider">New Check Out</Label>
                <Input id="modCheckOut" type="date" value={modifyDates.checkOut} onChange={(e) => setModifyDates({...modifyDates, checkOut: e.target.value})} required className="font-light" />
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={isModifying} className="w-full text-[11px] uppercase tracking-wider font-normal">
                {isModifying ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Modifying...</>
                ) : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Admin;
