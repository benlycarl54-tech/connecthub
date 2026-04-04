import { useState, useRef } from "react";
import { Play, ThumbsUp, MessageSquare, Share2, Volume2, VolumeX, ChevronLeft, Send, X, Heart, Laugh, Frown, Angry, Bookmark, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFBAuth } from "../context/AuthContext";

const REACTIONS = [
  { emoji: "👍", label: "Like", color: "text-[#1877F2]" },
  { emoji: "❤️", label: "Love", color: "text-red-500" },
  { emoji: "😂", label: "Haha", color: "text-yellow-400" },
  { emoji: "😮", label: "Wow", color: "text-yellow-400" },
  { emoji: "😢", label: "Sad", color: "text-yellow-400" },
  { emoji: "😡", label: "Angry", color: "text-orange-500" },
];

const VIDEOS = [
  { id: 1, title: "Afrobeats dance challenge 🕺🔥", author: "Chioma Okafor", country: "🇳🇬 Nigeria", location: "Lagos, Nigeria", authorBg: "bg-green-600", avatar: "https://randomuser.me/api/portraits/women/44.jpg", time: "45 minutes ago", likes: 18400, comments: 1203, shares: 876, views: "312K", thumb: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 2, title: "Samba no Rio de Janeiro 🎶", author: "Rafael Souza", country: "🇧🇷 Brazil", location: "Rio de Janeiro, Brazil", authorBg: "bg-yellow-500", avatar: "https://randomuser.me/api/portraits/men/32.jpg", time: "1 hour ago", likes: 9700, comments: 543, shares: 412, views: "145K", thumb: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 3, title: "Street food in Mumbai 🍛", author: "Priya Sharma", country: "🇮🇳 India", location: "Mumbai, India", authorBg: "bg-orange-500", avatar: "https://randomuser.me/api/portraits/women/68.jpg", time: "3 hours ago", likes: 22100, comments: 1456, shares: 989, views: "489K", thumb: "https://images.unsplash.com/photo-1542367592-8849eb950fd8?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 4, title: "Cherry blossom walk in Tokyo 🌸", author: "Yuki Tanaka", country: "🇯🇵 Japan", location: "Tokyo, Japan", authorBg: "bg-pink-400", avatar: "https://randomuser.me/api/portraits/women/21.jpg", time: "5 hours ago", likes: 31200, comments: 2100, shares: 1543, views: "712K", thumb: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 5, title: "Día de los Muertos parade 💀🌺", author: "Alejandro Reyes", country: "🇲🇽 Mexico", location: "Mexico City, Mexico", authorBg: "bg-orange-400", avatar: "https://randomuser.me/api/portraits/men/55.jpg", time: "6 hours ago", likes: 14300, comments: 876, shares: 654, views: "234K", thumb: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 6, title: "Safari morning in Kruger Park 🦁", author: "Sipho Dlamini", country: "🇿🇦 South Africa", location: "Kruger, South Africa", authorBg: "bg-amber-600", avatar: "https://randomuser.me/api/portraits/men/77.jpg", time: "8 hours ago", likes: 8900, comments: 567, shares: 412, views: "178K", thumb: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 7, title: "K-Pop street performance ✨", author: "Minjun Park", country: "🇰🇷 South Korea", location: "Seoul, South Korea", authorBg: "bg-purple-500", avatar: "https://randomuser.me/api/portraits/men/42.jpg", time: "10 hours ago", likes: 45600, comments: 3210, shares: 2876, views: "1.2M", thumb: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 8, title: "Morning at the Eiffel Tower 🗼", author: "Camille Dubois", country: "🇫🇷 France", location: "Paris, France", authorBg: "bg-blue-600", avatar: "https://randomuser.me/api/portraits/women/33.jpg", time: "12 hours ago", likes: 6700, comments: 398, shares: 287, views: "94K", thumb: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 9, title: "Camel ride near the Pyramids 🐪", author: "Ahmed Hassan", country: "🇪🇬 Egypt", location: "Giza, Egypt", authorBg: "bg-yellow-600", avatar: "https://randomuser.me/api/portraits/men/61.jpg", time: "1 day ago", likes: 11200, comments: 734, shares: 621, views: "198K", thumb: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 10, title: "Surfing Bondi Beach 🏄", author: "Liam Henderson", country: "🇦🇺 Australia", location: "Sydney, Australia", authorBg: "bg-teal-500", avatar: "https://randomuser.me/api/portraits/men/23.jpg", time: "1 day ago", likes: 7600, comments: 478, shares: 389, views: "118K", thumb: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 11, title: "Winter in Saint Petersburg ❄️", author: "Natasha Volkov", country: "🇷🇺 Russia", location: "Saint Petersburg, Russia", authorBg: "bg-red-600", avatar: "https://randomuser.me/api/portraits/women/11.jpg", time: "1 day ago", likes: 5400, comments: 321, shares: 245, views: "81K", thumb: "https://images.unsplash.com/photo-1548834925-e48f8a27b8f8?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 12, title: "Dragon boat festival 🐉", author: "Wei Chen", country: "🇨🇳 China", location: "Guangzhou, China", authorBg: "bg-red-500", avatar: "https://randomuser.me/api/portraits/men/87.jpg", time: "2 days ago", likes: 28700, comments: 1876, shares: 1345, views: "543K", thumb: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 13, title: "Maasai warriors dance 🏹", author: "Amina Wanjiku", country: "🇰🇪 Kenya", location: "Nairobi, Kenya", authorBg: "bg-green-700", avatar: "https://randomuser.me/api/portraits/women/55.jpg", time: "2 days ago", likes: 9800, comments: 634, shares: 512, views: "178K", thumb: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 14, title: "Pizza making in Naples 🍕", author: "Marco Rossi", country: "🇮🇹 Italy", location: "Naples, Italy", authorBg: "bg-green-500", avatar: "https://randomuser.me/api/portraits/men/14.jpg", time: "2 days ago", likes: 4200, comments: 256, shares: 198, views: "61K", thumb: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 15, title: "Lantern festival in Chiang Mai 🏮", author: "Suda Ratana", country: "🇹🇭 Thailand", location: "Chiang Mai, Thailand", authorBg: "bg-yellow-400", avatar: "https://randomuser.me/api/portraits/women/77.jpg", time: "3 days ago", likes: 16500, comments: 987, shares: 876, views: "287K", thumb: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 16, title: "Tango in Buenos Aires 💃", author: "Sofia Fernandez", country: "🇦🇷 Argentina", location: "Buenos Aires, Argentina", authorBg: "bg-blue-400", avatar: "https://randomuser.me/api/portraits/women/88.jpg", time: "3 days ago", likes: 8100, comments: 512, shares: 398, views: "132K", thumb: "https://images.unsplash.com/photo-1536859355448-76f92ebdc33d?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 17, title: "Medina of Marrakech 🕌", author: "Youssef Benali", country: "🇲🇦 Morocco", location: "Marrakech, Morocco", authorBg: "bg-orange-600", avatar: "https://randomuser.me/api/portraits/men/38.jpg", time: "3 days ago", likes: 7300, comments: 445, shares: 367, views: "112K", thumb: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 18, title: "Island hopping in Palawan 🏝️", author: "Maria Santos", country: "🇵🇭 Philippines", location: "Palawan, Philippines", authorBg: "bg-blue-500", avatar: "https://randomuser.me/api/portraits/women/43.jpg", time: "4 days ago", likes: 12300, comments: 789, shares: 654, views: "219K", thumb: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 19, title: "Hot air balloon in Cappadocia 🎈", author: "Elif Yilmaz", country: "🇹🇷 Turkey", location: "Cappadocia, Turkey", authorBg: "bg-red-500", avatar: "https://randomuser.me/api/portraits/women/29.jpg", time: "4 days ago", likes: 19800, comments: 1234, shares: 987, views: "378K", thumb: "https://images.unsplash.com/photo-1507399484485-6a84e3616bac?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 20, title: "Carnival de Barranquilla 🎭", author: "Diego Martinez", country: "🇨🇴 Colombia", location: "Barranquilla, Colombia", authorBg: "bg-yellow-500", avatar: "https://randomuser.me/api/portraits/men/66.jpg", time: "5 days ago", likes: 14100, comments: 876, shares: 743, views: "256K", thumb: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 21, title: "Bali rice terraces at sunrise 🌾", author: "Dewi Kusuma", country: "🇮🇩 Indonesia", location: "Ubud, Bali, Indonesia", authorBg: "bg-green-600", avatar: "https://randomuser.me/api/portraits/women/62.jpg", time: "5 days ago", likes: 23400, comments: 1567, shares: 1234, views: "467K", thumb: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 22, title: "Kente weaving tradition 🧵", author: "Kofi Asante", country: "🇬🇭 Ghana", location: "Kumasi, Ghana", authorBg: "bg-red-400", avatar: "https://randomuser.me/api/portraits/men/91.jpg", time: "5 days ago", likes: 5600, comments: 345, shares: 278, views: "82K", thumb: "https://images.unsplash.com/photo-1607457561901-e6ec3a6d16cf?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 23, title: "Wedding Bhangra dance 💒🎊", author: "Fatima Khan", country: "🇵🇰 Pakistan", location: "Lahore, Pakistan", authorBg: "bg-green-600", avatar: "https://randomuser.me/api/portraits/women/36.jpg", time: "6 days ago", likes: 31700, comments: 2100, shares: 1876, views: "712K", thumb: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 24, title: "Trekking to Everest Base Camp ⛰️", author: "Rajesh Tamang", country: "🇳🇵 Nepal", location: "Khumbu, Nepal", authorBg: "bg-red-600", avatar: "https://randomuser.me/api/portraits/men/72.jpg", time: "6 days ago", likes: 8900, comments: 567, shares: 478, views: "156K", thumb: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 25, title: "Ethiopian coffee ceremony ☕", author: "Hana Tesfaye", country: "🇪🇹 Ethiopia", location: "Addis Ababa, Ethiopia", authorBg: "bg-yellow-600", avatar: "https://randomuser.me/api/portraits/women/84.jpg", time: "1 week ago", likes: 7200, comments: 443, shares: 321, views: "118K", thumb: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 26, title: "Machu Picchu morning fog 🏔️", author: "Isabella Torres", country: "🇵🇪 Peru", location: "Cusco, Peru", authorBg: "bg-orange-500", avatar: "https://randomuser.me/api/portraits/women/53.jpg", time: "1 week ago", likes: 15600, comments: 1023, shares: 876, views: "312K", thumb: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 27, title: "Sabar drum & dance party 🥁", author: "Moussa Diallo", country: "🇸🇳 Senegal", location: "Dakar, Senegal", authorBg: "bg-green-500", avatar: "https://randomuser.me/api/portraits/men/48.jpg", time: "1 week ago", likes: 9800, comments: 634, shares: 543, views: "187K", thumb: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 28, title: "Santorini sunset views 🌅", author: "Nikos Papadopoulos", country: "🇬🇷 Greece", location: "Santorini, Greece", authorBg: "bg-blue-500", avatar: "https://randomuser.me/api/portraits/men/19.jpg", time: "1 week ago", likes: 21400, comments: 1345, shares: 1123, views: "432K", thumb: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 29, title: "Source of the Nile boat ride 🚤", author: "Grace Nakato", country: "🇺🇬 Uganda", location: "Jinja, Uganda", authorBg: "bg-yellow-500", avatar: "https://randomuser.me/api/portraits/women/17.jpg", time: "2 weeks ago", likes: 4300, comments: 267, shares: 198, views: "62K", thumb: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 30, title: "Al-Ula desert adventure 🏜️", author: "Omar Al-Rashid", country: "🇸🇦 Saudi Arabia", location: "Al-Ula, Saudi Arabia", authorBg: "bg-green-700", avatar: "https://randomuser.me/api/portraits/men/93.jpg", time: "2 weeks ago", likes: 12700, comments: 789, shares: 654, views: "219K", thumb: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 31, title: "Ha Long Bay boat trip ⛵", author: "Linh Nguyen", country: "🇻🇳 Vietnam", location: "Hạ Long Bay, Vietnam", authorBg: "bg-red-500", avatar: "https://randomuser.me/api/portraits/women/58.jpg", time: "2 weeks ago", likes: 18900, comments: 1234, shares: 987, views: "378K", thumb: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 32, title: "Football crazy in Yaoundé ⚽🔥", author: "Jean-Pierre Eto'o", country: "🇨🇲 Cameroon", location: "Yaoundé, Cameroon", authorBg: "bg-green-600", avatar: "https://randomuser.me/api/portraits/men/34.jpg", time: "3 weeks ago", likes: 24800, comments: 1678, shares: 1345, views: "543K", thumb: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 33, title: "Fado music night in Lisbon 🎸", author: "Ana Ferreira", country: "🇵🇹 Portugal", location: "Lisbon, Portugal", authorBg: "bg-red-500", avatar: "https://randomuser.me/api/portraits/women/26.jpg", time: "3 weeks ago", likes: 5400, comments: 321, shares: 245, views: "81K", thumb: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 34, title: "Victoria Falls — unbelievable! 💦", author: "Tendai Moyo", country: "🇿🇼 Zimbabwe", location: "Livingstone, Zimbabwe", authorBg: "bg-green-700", avatar: "https://randomuser.me/api/portraits/men/52.jpg", time: "3 weeks ago", likes: 11300, comments: 743, shares: 621, views: "198K", thumb: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 35, title: "Gardens by the Bay light show 🌃", author: "Mei Lin Tan", country: "🇸🇬 Singapore", location: "Singapore", authorBg: "bg-red-500", avatar: "https://randomuser.me/api/portraits/women/39.jpg", time: "3 weeks ago", likes: 9700, comments: 612, shares: 512, views: "167K", thumb: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 36, title: "Coupé-Décalé street party 🎉", author: "Kouamé Brou", country: "🇨🇮 Ivory Coast", location: "Abidjan, Ivory Coast", authorBg: "bg-orange-500", avatar: "https://randomuser.me/api/portraits/men/75.jpg", time: "1 month ago", likes: 8900, comments: 567, shares: 478, views: "156K", thumb: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 37, title: "Dubai skyline from Burj Khalifa 🏙️", author: "Layla Al-Maktoum", country: "🇦🇪 UAE", location: "Dubai, UAE", authorBg: "bg-yellow-500", avatar: "https://randomuser.me/api/portraits/women/81.jpg", time: "1 month ago", likes: 34200, comments: 2345, shares: 1987, views: "812K", thumb: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 38, title: "Glastonbury Festival vibes 🎪", author: "Oliver Thompson", country: "🇬🇧 UK", location: "Somerset, England", authorBg: "bg-blue-700", avatar: "https://randomuser.me/api/portraits/men/28.jpg", time: "1 month ago", likes: 7800, comments: 489, shares: 398, views: "124K", thumb: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 39, title: "Northern lights in Yukon 🌌", author: "Emma Tremblay", country: "🇨🇦 Canada", location: "Yukon, Canada", authorBg: "bg-red-600", avatar: "https://randomuser.me/api/portraits/women/49.jpg", time: "1 month ago", likes: 21400, comments: 1345, shares: 1123, views: "432K", thumb: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 40, title: "Kilimanjaro summit day 🏔️🙌", author: "Emmanuel Njoroge", country: "🇹🇿 Tanzania", location: "Mount Kilimanjaro, Tanzania", authorBg: "bg-blue-600", avatar: "https://randomuser.me/api/portraits/men/63.jpg", time: "2 months ago", likes: 15600, comments: 1023, shares: 876, views: "312K", thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 41, title: "Fjord kayaking adventure 🛶", author: "Lars Eriksen", country: "🇳🇴 Norway", location: "Bergen, Norway", authorBg: "bg-blue-500", avatar: "https://randomuser.me/api/portraits/men/17.jpg", time: "2 months ago", likes: 9800, comments: 634, shares: 543, views: "187K", thumb: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 42, title: "Petronas Towers night view 🌃✨", author: "Aisha Razak", country: "🇲🇾 Malaysia", location: "Kuala Lumpur, Malaysia", authorBg: "bg-red-600", avatar: "https://randomuser.me/api/portraits/women/73.jpg", time: "2 months ago", likes: 13200, comments: 876, shares: 654, views: "234K", thumb: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 43, title: "Ndombolo party in Kinshasa 🎵💃", author: "Patrice Kabila", country: "🇨🇩 DR Congo", location: "Kinshasa, DR Congo", authorBg: "bg-yellow-600", avatar: "https://randomuser.me/api/portraits/men/81.jpg", time: "2 months ago", likes: 18900, comments: 1234, shares: 987, views: "378K", thumb: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 44, title: "Eagle hunting on horseback 🦅🐴", author: "Arman Bekova", country: "🇰🇿 Kazakhstan", location: "Almaty, Kazakhstan", authorBg: "bg-blue-600", avatar: "https://randomuser.me/api/portraits/men/59.jpg", time: "2 months ago", likes: 7800, comments: 489, shares: 398, views: "124K", thumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 45, title: "Gorilla trekking in Volcanoes NP 🦍", author: "Claudine Umurerwa", country: "🇷🇼 Rwanda", location: "Musanze, Rwanda", authorBg: "bg-green-700", avatar: "https://randomuser.me/api/portraits/women/92.jpg", time: "3 months ago", likes: 11200, comments: 734, shares: 621, views: "198K", thumb: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 46, title: "New Orleans jazz street band 🎷", author: "Marcus Johnson", country: "🇺🇸 USA", location: "New Orleans, USA", authorBg: "bg-indigo-600", avatar: "https://randomuser.me/api/portraits/men/45.jpg", time: "3 months ago", likes: 23400, comments: 1567, shares: 1234, views: "467K", thumb: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 47, title: "Owambe party setup 🎊🍖", author: "Tunde Adeyemi", country: "🇳🇬 Nigeria", location: "Abuja, Nigeria", authorBg: "bg-green-500", avatar: "https://randomuser.me/api/portraits/men/83.jpg", time: "3 months ago", likes: 41200, comments: 2876, shares: 2345, views: "1.1M", thumb: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 48, title: "La Tomatina festival madness 🍅", author: "Carlos García", country: "🇪🇸 Spain", location: "Buñol, Spain", authorBg: "bg-red-500", avatar: "https://randomuser.me/api/portraits/men/37.jpg", time: "4 months ago", likes: 19800, comments: 1234, shares: 987, views: "378K", thumb: "https://images.unsplash.com/photo-1543285198-3af15c4592ce?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 49, title: "Kizomba dance night 🌙💃", author: "Ana Paula Neto", country: "🇦🇴 Angola", location: "Luanda, Angola", authorBg: "bg-red-600", avatar: "https://randomuser.me/api/portraits/women/16.jpg", time: "4 months ago", likes: 13700, comments: 876, shares: 743, views: "256K", thumb: "https://images.unsplash.com/photo-1536859355448-76f92ebdc33d?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 50, title: "Rickshaw painting art 🎨", author: "Sumaiya Islam", country: "🇧🇩 Bangladesh", location: "Dhaka, Bangladesh", authorBg: "bg-green-600", avatar: "https://randomuser.me/api/portraits/women/47.jpg", time: "5 months ago", likes: 6700, comments: 412, shares: 334, views: "97K", thumb: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 51, title: "Maputo beach vibes 🏖️🎶", author: "Celso Machava", country: "🇲🇿 Mozambique", location: "Maputo, Mozambique", authorBg: "bg-yellow-500", avatar: "https://randomuser.me/api/portraits/men/96.jpg", time: "5 months ago", likes: 5400, comments: 321, shares: 245, views: "81K", thumb: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 52, title: "Funny moment at the market 😂", author: "James Williams", country: "🇬🇭 Ghana", location: "Accra, Ghana", authorBg: "bg-blue-500", avatar: "https://randomuser.me/api/portraits/men/11.jpg", time: "6 months ago", likes: 1240, comments: 87, shares: 45, views: "12K", thumb: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
];

const SAMPLE_COMMENTS_POOL = [
  { name: "Chioma O.", text: "This is amazing! 🔥", bg: "bg-green-500" },
  { name: "Rafael S.", text: "Love this so much ❤️", bg: "bg-yellow-500" },
  { name: "Priya S.", text: "Wow, incredible!! 😮", bg: "bg-orange-500" },
  { name: "Yuki T.", text: "So beautiful 🌸", bg: "bg-pink-400" },
  { name: "Ahmed H.", text: "Mashallah! 🙏", bg: "bg-yellow-600" },
  { name: "Sipho D.", text: "This made my day 😂", bg: "bg-amber-600" },
];

function VideoPlayer({ video, onClose }) {
  const { currentUser } = useFBAuth();
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(SAMPLE_COMMENTS_POOL.slice(0, 3).map((c, i) => ({ ...c, id: i, time: `${i + 1}h` })));
  const [reaction, setReaction] = useState(null);
  const [likes, setLikes] = useState(video.likes);
  const [showComments, setShowComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [saved, setSaved] = useState(false);
  const reactionTimer = useRef(null);

  const handleReactionPick = (r) => {
    setShowReactions(false);
    if (reaction?.emoji === r.emoji) {
      setReaction(null);
      setLikes(l => l - 1);
    } else {
      if (!reaction) setLikes(l => l + 1);
      setReaction(r);
    }
  };

  const toggleReaction = () => {
    if (showReactions) { setShowReactions(false); return; }
    if (reaction) {
      setReaction(null);
      setLikes(l => l - 1);
    } else {
      setReaction(REACTIONS[0]);
      setLikes(l => l + 1);
    }
  };

  const submitComment = () => {
    if (!comment.trim()) return;
    setComments(prev => [...prev, {
      id: Date.now(),
      name: currentUser ? `${currentUser.firstName} ${currentUser.lastName || ""}`.trim() : "You",
      text: comment.trim(),
      time: "Just now",
      bg: "bg-[#1877F2]",
      avatar: currentUser?.profilePicture,
    }]);
    setComment("");
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col max-w-md mx-auto">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-black/80">
        <button onClick={onClose} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              {video.avatar
                ? <img src={video.avatar} className="w-full h-full object-cover" alt="" />
                : <div className={`w-full h-full ${video.authorBg} flex items-center justify-center`}><span className="text-white text-xs font-bold">{video.author[0]}</span></div>
              }
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">{video.author}</p>
              <p className="text-white/50 text-xs">{video.country} · {video.time}</p>
            </div>
          </div>
        </div>
        <button onClick={() => setSaved(s => !s)} className={`w-9 h-9 rounded-full flex items-center justify-center ${saved ? "bg-[#1877F2]" : "bg-white/20"}`}>
          <Bookmark className="w-4 h-4 text-white" />
        </button>
        <button onClick={() => setMuted(m => !m)} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
          {muted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
        </button>
      </div>

      {/* Title */}
      <div className="px-4 py-2 bg-black/60">
        <p className="text-white font-semibold text-sm">{video.title}</p>
        <p className="text-white/50 text-xs">{video.location}</p>
      </div>

      {/* Video */}
      <div className="flex-1 flex items-center bg-black overflow-hidden">
        <video ref={videoRef} src={video.src} autoPlay controls muted={muted} className="w-full" style={{ maxHeight: "55vh", objectFit: "contain" }} />
      </div>

      {/* Stats */}
      <div className="bg-black/90 px-4 py-2">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1">
            <span className="text-sm">{reaction ? reaction.emoji : "👍"} ❤️ 😂</span>
            <span className="text-white/60 text-xs ml-1">{likes.toLocaleString()}</span>
          </div>
          <button onClick={() => setShowComments(s => !s)} className="text-white/60 text-xs hover:text-white">
            {video.comments.toLocaleString()} comments · {video.shares.toLocaleString()} shares
          </button>
        </div>

        {/* Reaction picker */}
        {showReactions && (
          <div className="flex items-center gap-2 bg-white rounded-full shadow-xl px-3 py-2 mb-2 w-fit">
            {REACTIONS.map(r => (
              <button key={r.emoji} onClick={() => handleReactionPick(r)}
                className={`text-2xl hover:scale-125 transition-transform ${reaction?.emoji === r.emoji ? "scale-125" : ""}`}>
                {r.emoji}
              </button>
            ))}
          </div>
        )}

        <div className="flex border-t border-white/10 pt-1">
          <button
            onMouseDown={() => { reactionTimer.current = setTimeout(() => setShowReactions(true), 400); }}
            onMouseUp={() => clearTimeout(reactionTimer.current)}
            onTouchStart={() => { reactionTimer.current = setTimeout(() => setShowReactions(true), 400); }}
            onTouchEnd={() => clearTimeout(reactionTimer.current)}
            onClick={toggleReaction}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg ${reaction ? reaction.color : "text-white/70"}`}>
            <span className="text-base">{reaction ? reaction.emoji : "👍"}</span>
            <span className="text-sm font-semibold">{reaction ? reaction.label : "Like"}</span>
          </button>
          <button onClick={() => setShowComments(s => !s)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-white/70">
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm font-semibold">Comment</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-white/70">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-semibold">Share</span>
          </button>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="mt-2 border-t border-white/10 pt-2 max-h-40 overflow-y-auto space-y-2">
            {comments.map(c => (
              <div key={c.id} className="flex gap-2">
                <div className={`w-7 h-7 rounded-full ${c.bg} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                  {c.avatar ? <img src={c.avatar} className="w-full h-full object-cover" alt="" /> : <span className="text-white text-xs font-bold">{c.name[0]}</span>}
                </div>
                <div className="bg-white/10 rounded-2xl px-3 py-1.5 flex-1">
                  <p className="text-white text-xs font-semibold">{c.name}</p>
                  <p className="text-white/80 text-xs">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comment input */}
        <div className="flex items-center gap-2 mt-2 pb-1">
          <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center flex-shrink-0 overflow-hidden">
            {currentUser?.profilePicture
              ? <img src={currentUser.profilePicture} className="w-full h-full object-cover rounded-full" alt="" />
              : <span className="text-white text-xs font-bold">{currentUser?.firstName?.[0] || "Y"}</span>}
          </div>
          <div className="flex-1 flex items-center bg-white/10 rounded-full px-3 py-2 gap-2">
            <input type="text" value={comment} onChange={e => setComment(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submitComment()}
              placeholder="Write a comment..."
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/40" />
            <button onClick={submitComment}><Send className="w-4 h-4 text-white/60" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video, onPlay }) {
  const [reaction, setReaction] = useState(null);
  const [likes, setLikes] = useState(video.likes);
  const [showReactions, setShowReactions] = useState(false);
  const reactionTimer = useRef(null);

  const handleReactionPick = (r) => {
    setShowReactions(false);
    if (reaction?.emoji === r.emoji) {
      setReaction(null);
      setLikes(l => l - 1);
    } else {
      if (!reaction) setLikes(l => l + 1);
      setReaction(r);
    }
  };

  const toggleReaction = () => {
    if (showReactions) { setShowReactions(false); return; }
    if (reaction) {
      setReaction(null);
      setLikes(l => l - 1);
    } else {
      setReaction(REACTIONS[0]);
      setLikes(l => l + 1);
    }
  };

  return (
    <div className="bg-white mb-2 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            {video.avatar
              ? <img src={video.avatar} alt={video.author} className="w-full h-full object-cover" onError={e => { e.target.style.display="none"; e.target.parentNode.classList.add(video.authorBg); e.target.parentNode.innerHTML = `<span class="text-white font-bold text-sm">${video.author[0]}</span>`; }} />
              : <div className={`w-full h-full ${video.authorBg} flex items-center justify-center`}><span className="text-white font-bold text-sm">{video.author[0]}</span></div>
            }
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{video.author}</p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span>{video.country}</span>
              <span>·</span>
              <span>{video.time}</span>
              <span>·</span>
              <span>🌐</span>
            </div>
          </div>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Title + location */}
      <p className="px-4 pb-1 text-sm text-gray-900 font-medium">{video.title}</p>
      <p className="px-4 pb-2 text-xs text-gray-400">📍 {video.location}</p>

      {/* Thumbnail */}
      <div className="relative cursor-pointer" onClick={() => onPlay(video)}>
        <img src={video.thumb} alt={video.title} className="w-full object-cover" style={{ maxHeight: 220 }} onError={e => { e.target.style.display = "none"; }} />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-14 h-14 bg-black/60 rounded-full flex items-center justify-center">
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 rounded px-1.5 py-0.5">
          <span className="text-white text-xs font-semibold">{video.views} views</span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-sm">{reaction ? reaction.emoji : "👍"} ❤️ 😂</span>
          <span className="text-xs text-gray-500 ml-1">{likes.toLocaleString()}</span>
        </div>
        <button onClick={() => onPlay(video)} className="text-xs text-gray-500 hover:underline">
          {video.comments.toLocaleString()} comments · {video.shares.toLocaleString()} shares
        </button>
      </div>
      <div className="mx-4 border-t border-gray-100" />

      {/* Reaction picker */}
      <div className="relative">
        {showReactions && (
          <div className="absolute bottom-12 left-2 bg-white rounded-full shadow-xl border border-gray-200 flex items-center px-3 py-2 gap-3 z-50">
            {REACTIONS.map(r => (
              <button key={r.emoji} onClick={() => handleReactionPick(r)}
                className={`text-2xl hover:scale-125 transition-transform ${reaction?.emoji === r.emoji ? "scale-125" : ""}`}>
                {r.emoji}
              </button>
            ))}
          </div>
        )}

        <div className="flex px-1 py-1">
          <button
            onMouseDown={() => { reactionTimer.current = setTimeout(() => setShowReactions(true), 400); }}
            onMouseUp={() => clearTimeout(reactionTimer.current)}
            onTouchStart={() => { reactionTimer.current = setTimeout(() => setShowReactions(true), 400); }}
            onTouchEnd={() => clearTimeout(reactionTimer.current)}
            onClick={toggleReaction}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-gray-100 ${reaction ? reaction.color : "text-gray-500"}`}>
            <span className="text-base">{reaction ? reaction.emoji : "👍"}</span>
            <span className="text-sm font-semibold">{reaction ? reaction.label : "Like"}</span>
          </button>
          <button onClick={() => onPlay(video)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm font-semibold">Comment</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-semibold">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VideosPage() {
  const [playingVideo, setPlayingVideo] = useState(null);
  const [activeTab, setActiveTab] = useState("foryou");

  return (
    <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto pb-20">
      {playingVideo && <VideoPlayer video={playingVideo} onClose={() => setPlayingVideo(null)} />}

      {/* Header */}
      <div className="bg-white sticky top-0 z-30 shadow-sm">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">Videos</h1>
        </div>
        <div className="flex border-b border-gray-100">
          {["foryou", "following", "reels"].map((t, i) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${activeTab === t ? "text-[#1877F2] border-b-2 border-[#1877F2]" : "text-gray-400"}`}>
              {["For You", "Following", "Reels"][i]}
            </button>
          ))}
        </div>
      </div>

      {VIDEOS.map(v => (
        <VideoCard key={v.id} video={v} onPlay={setPlayingVideo} />
      ))}
    </div>
  );
}