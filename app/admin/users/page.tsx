"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserCog } from "lucide-react";
import { User } from "@prisma/client";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/admin/users${search ? `?search=${search}` : ''}`);
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Пользователи</h1>
        <p className="text-white/50 text-sm">Управление правами доступа и ролями</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            placeholder="Поиск по имени или @username..."
            className="pl-10 bg-white/5 border-white/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
          />
        </div>
        <Button onClick={fetchUsers} className="bg-white/5 border border-white/10 hover:bg-white/10 font-bold uppercase text-xs rounded-xl h-10 px-6">
          Найти
        </Button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-[10px] font-black uppercase text-white/40 tracking-widest">Пользователь</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-white/40 tracking-widest">Telegram ID</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-white/40 tracking-widest">Роль</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-white/40 tracking-widest">Дата рег.</TableHead>
              <TableHead className="text-right text-[10px] font-black uppercase text-white/40 tracking-widest">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-black">
                            {user.firstName[0]}
                        </div>
                        <div>
                            <div className="font-bold">{user.firstName} {user.lastName}</div>
                            {user.username && <div className="text-[10px] text-white/40">@{user.username}</div>}
                        </div>
                    </div>
                </TableCell>
                <TableCell className="text-white/60 font-mono text-[10px]">{user.telegramId}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[9px] font-black uppercase border-white/20 ${
                      user.role === 'admin' ? 'text-[#FF2D2D] border-[#FF2D2D]/30' :
                      user.role === 'trainer' ? 'text-blue-400 border-blue-400/30' : ''
                  }`}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-white/60 text-xs">
                  {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => changeRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                        className="text-[10px] font-black uppercase hover:bg-[#FF2D2D]/10 hover:text-[#FF2D2D]"
                      >
                        <UserCog className="w-3.5 h-3.5 mr-2" />
                        {user.role === 'admin' ? 'Снять Admin' : 'Сделать Admin'}
                      </Button>
                      {user.role !== 'trainer' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => changeRole(user.id, 'trainer')}
                            className="text-[10px] font-black uppercase hover:bg-blue-400/10 hover:text-blue-400"
                          >
                            Сделать Тренером
                          </Button>
                      )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && users.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-white/20 font-bold uppercase italic text-xs tracking-widest">
                        Пользователи не найдены
                    </TableCell>
                </TableRow>
            )}
            {loading && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-white/40 font-black animate-pulse">
                        ЗАГРУЗКА...
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
