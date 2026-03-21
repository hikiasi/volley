import Link from "next/link";
import { ChevronLeft, Info, MapPin } from "lucide-react";
import { ChatMessageInput } from "@/components/camps/ChatMessageInput";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


// Mock data based on chat.html
const messages = [
    { user: { name: "Алексей", level: "Shoshin", avatarUrl: "/avatars/1.png", color: "text-green-400" }, text: "Доброе утро всем!", time: "09:32" },
    { user: { name: "Инструктор Никита Н.", isInstructor: true }, text: null, time: "09:35", event: { title: "Олткет Power Jump", hot: true, location: "Склитищеро. 14 окт."} },
    { user: { name: "Илы А.", level: "Shugyosha", avatarUrl: "/avatars/2.png", color: "text-orange-400" }, text: "Во сколько завтра стартуем?", time: "13:57" },
    { user: { name: "Екатерина Т.", level: "Jukuren", avatarUrl: "/avatars/3.png", color: "text-green-400" }, text: "Мне уже не терпится!", time: "14:49", hasVideo: true },
];

const systemEvents = [
    { text: "Георгий К. вошел в чат", time: "14:23" },
    { text: "Виктор В. вышел из чата", time: "14:30" },
];

export default function CampChatPage({ params }: { params: { slug: string } }) {
  return (
    <div className="bg-v-dark text-white min-h-screen flex flex-col max-w-md mx-auto">
      <header className="px-4 py-2 flex items-center justify-between border-b border-zinc-800 sticky top-0 bg-black/80 backdrop-blur-md z-10">
        <Link href={`/camps/${params.slug}`} className="text-white p-2">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-bold">Чат участников</h1>
          <p className="text-xs text-gray-400">— Москва 12–14 окт</p>
        </div>
        <button className="text-white p-2">
          <Info className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 space-y-6 pt-4 pb-24">
        {messages.map((msg, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={msg.user.avatarUrl} />
              <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
              {msg.user.isInstructor && <div className="absolute inset-0 border-2 border-v-accent rounded-full flex items-center justify-center bg-zinc-900"><span className="text-xs font-bold text-v-accent">IN</span></div>}
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className={`font-medium text-sm ${msg.user.color}`}>{msg.user.name}</span>
                    {msg.user.level && <Badge variant="outline" className="text-[9px] px-1.5 h-5">{msg.user.level}</Badge>}
                </div>
                <span className="text-xs text-v-text-muted">{msg.time}</span>
              </div>
              
              {msg.text && <p className="text-base text-white/90">{msg.text}</p>}
              
              {msg.user.isInstructor && msg.event && (
                 <div className="bg-v-card border border-zinc-800 p-3 rounded-xl mt-1">
                    <div className="flex items-center gap-2 mb-2">
                       <MapPin className="w-4 h-4 text-v-accent" />
                       <span className="text-xs font-bold">{msg.event.title}</span>
                       {msg.event.hot && <Badge className="bg-v-accent text-[9px] h-4">HOT</Badge>}
                    </div>
                    <p className="text-sm">{msg.event.location}</p>
                 </div>
              )}

              {msg.hasVideo && (
                 <div className="mt-2 max-w-[200px] rounded-lg overflow-hidden border border-zinc-800">
                    <img src={`https://source.unsplash.com/random/400x225?volleyball,${index}`} alt="video-preview" />
                 </div>
              )}
            </div>
          </div>
        ))}
         <div className="text-v-text-muted text-xs space-y-1 py-1 text-center">
            {systemEvents.map(event => (
                <div key={event.text}><span>{event.text}</span> <span className="opacity-50">{event.time}</span></div>
            ))}
        </div>
      </main>
      
      <ChatMessageInput />
    </div>
  );
}
