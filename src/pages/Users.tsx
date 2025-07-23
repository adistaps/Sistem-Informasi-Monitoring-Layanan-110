
import { useState } from "react";
import { Search, UserPlus, Edit, Trash2, Shield, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useProfiles, useProfilesStats, useDeleteProfile } from "@/hooks/useProfiles";

const Users = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: users = [], isLoading } = useProfiles();
  const { data: profilesStats } = useProfilesStats();
  const deleteProfileMutation = useDeleteProfile();

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-500"><Shield className="h-3 w-3 mr-1" />Admin</Badge>;
      case "dispatcher":
        return <Badge className="bg-blue-500"><User className="h-3 w-3 mr-1" />Dispatcher</Badge>;
      case "petugas":
        return <Badge className="bg-yellow-500"><User className="h-3 w-3 mr-1" />Petugas</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    deleteProfileMutation.mutate(userId);
  };

  const filteredUsers = users.filter(user =>
    user.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <MobileNav />
        <div className="flex-1">
          <Header title="Pengguna" />
          <main className="p-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1">
        <Header title="Pengguna" />
        
        <main className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
                <p className="text-gray-600">Kelola pengguna sistem SIMOLA 110</p>
              </div>
              <Button onClick={() => navigate('/users/AddUser')} className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Tambah Pengguna
              </Button>
            </div>

            {/* Search Bar */}
            <div className="flex-1 relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari pengguna..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Statistik Pengguna */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Pengguna</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profilesStats?.total || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profilesStats?.byRole.admin || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Petugas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profilesStats?.byRole.petugas || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Dispatcher</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profilesStats?.byRole.dispatcher || 0}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabel Pengguna */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pengguna</CardTitle>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Belum ada pengguna yang terdaftar</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Unit Kerja</TableHead>
                      <TableHead>Bergabung</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.nama}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{user.unit_kerja || '-'}</TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString('id-ID')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/users/edit/${user.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus pengguna {user.nama}?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Tidak</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                                    Ya, Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Users;
