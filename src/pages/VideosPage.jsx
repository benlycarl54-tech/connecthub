import { useState } from "react";
import { Play, ThumbsUp, MessageSquare, Share2, Volume2, VolumeX, ChevronLeft, Send, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomTabBar from "../components/home/BottomTabBar";
import { useFBAuth } from "../context/AuthContext";

const VIDEOS = [
  // --- New diverse international user posts ---
  { id: 1, title: "Watch me cook jollof rice the right way 🍛🔥 #Nigeria", author: "Chidi Okonkwo", country: "🇳🇬 Nigeria", authorAvatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=80&h=80&fit=crop&crop=face", authorBg: "bg-green-600", time: "2m", likes: 4821, comments: 312, shares: 178, views: "62K", thumb: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 2, title: "First time visiting the Eiffel Tower 🗼✨ felt unreal", author: "Yasmine Benali", country: "🇩🇿 Algeria", authorAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face", authorBg: "bg-emerald-500", time: "8m", likes: 9340, comments: 567, shares: 423, views: "134K", thumb: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 3, title: "My son took his first steps today 😭❤️ I'm crying", author: "Ravi Sharma", country: "🇮🇳 India", authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face", authorBg: "bg-orange-500", time: "15m", likes: 23400, comments: 1820, shares: 1340, views: "512K", thumb: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 4, title: "Brazilian carnival vibes 🎭🥁 Rio de Janeiro", author: "Isabela Souza", country: "🇧🇷 Brazil", authorAvatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=80&h=80&fit=crop&crop=face", authorBg: "bg-yellow-500", time: "22m", likes: 18700, comments: 1230, shares: 987, views: "378K", thumb: "https://images.unsplash.com/photo-1518659526054-190340b32735?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 5, title: "Morning gym session at 5AM 💪 No excuses!", author: "Marcus Thompson", country: "🇺🇸 USA", authorAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&h=80&fit=crop&crop=face", authorBg: "bg-blue-600", time: "35m", likes: 7650, comments: 445, shares: 312, views: "98K", thumb: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 6, title: "Traditional Korean BBQ with my family 🥩🇰🇷 best night", author: "Ji-Yeon Park", country: "🇰🇷 South Korea", authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face", authorBg: "bg-red-500", time: "1h", likes: 12300, comments: 834, shares: 612, views: "223K", thumb: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 7, title: "Street dancing in Accra 🕺🔥 who's next?", author: "Kofi Agyemang", country: "🇬🇭 Ghana", authorAvatar: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=80&h=80&fit=crop&crop=face", authorBg: "bg-red-600", time: "1h", likes: 31200, comments: 2100, shares: 1780, views: "867K", thumb: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 8, title: "Tokyo night walk — this city never sleeps 🌃🇯🇵", author: "Hiroshi Tanaka", country: "🇯🇵 Japan", authorAvatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=80&h=80&fit=crop&crop=face", authorBg: "bg-pink-500", time: "2h", likes: 8900, comments: 623, shares: 445, views: "156K", thumb: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 9, title: "Graduation day! 4 years of hard work 🎓🥹 Thank you all", author: "Amara Diallo", country: "🇸🇳 Senegal", authorAvatar: "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=80&h=80&fit=crop&crop=face", authorBg: "bg-teal-500", time: "2h", likes: 45600, comments: 3410, shares: 2890, views: "1.2M", thumb: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 10, title: "Surfing in Bali 🏄‍♂️🌊 living my best life", author: "Liam O'Brien", country: "🇮🇪 Ireland", authorAvatar: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=80&h=80&fit=crop&crop=face", authorBg: "bg-green-500", time: "3h", likes: 14200, comments: 876, shares: 723, views: "287K", thumb: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 11, title: "Making Egyptian koshari from scratch 🍝🇪🇬", author: "Nour El-Din", country: "🇪🇬 Egypt", authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face", authorBg: "bg-yellow-600", time: "3h", likes: 5670, comments: 398, shares: 267, views: "87K", thumb: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 12, title: "My daughter's sweet 16 🎂🎉 I'm so proud of her", author: "Sofia Rodriguez", country: "🇲🇽 Mexico", authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face", authorBg: "bg-purple-500", time: "4h", likes: 28900, comments: 2140, shares: 1560, views: "623K", thumb: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 13, title: "Football training with my boys ⚽🔥 Champions League energy", author: "Moussa Koné", country: "🇨🇮 Côte d'Ivoire", authorAvatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&crop=face", authorBg: "bg-orange-600", time: "4h", likes: 19800, comments: 1340, shares: 1120, views: "445K", thumb: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 14, title: "Hiking in the Swiss Alps 🏔️❄️ worth every step", author: "Anna Müller", country: "🇨🇭 Switzerland", authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face", authorBg: "bg-red-400", time: "5h", likes: 11300, comments: 754, shares: 589, views: "198K", thumb: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 15, title: "Afrobeats challenge 🎵💃 tag a friend who can do this", author: "Temi Adeyemi", country: "🇳🇬 Nigeria", authorAvatar: "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=80&h=80&fit=crop&crop=face", authorBg: "bg-green-700", time: "5h", likes: 67300, comments: 4230, shares: 3870, views: "2.1M", thumb: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 16, title: "Street food in Bangkok is on another level 🍜🇹🇭 wow", author: "Priya Krishnan", country: "🇹🇭 Thailand", authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face", authorBg: "bg-blue-400", time: "6h", likes: 8900, comments: 612, shares: 445, views: "167K", thumb: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 17, title: "Catching the Northern Lights in Iceland 🌌🇮🇸 a dream!", author: "Björn Sigurdsson", country: "🇮🇸 Iceland", authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face", authorBg: "bg-cyan-600", time: "7h", likes: 34500, comments: 2780, shares: 2340, views: "789K", thumb: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 18, title: "Playing guitar at sunset on Santorini beach 🎸🌅", author: "Nikos Papadopoulos", country: "🇬🇷 Greece", authorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face", authorBg: "bg-blue-700", time: "8h", likes: 21400, comments: 1560, shares: 1230, views: "534K", thumb: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 19, title: "My cat knocked everything off the table again 😂🐱 typical", author: "Fatou Ndiaye", country: "🇸🇳 Senegal", authorAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&h=80&fit=crop&crop=face", authorBg: "bg-pink-600", time: "9h", likes: 52100, comments: 3890, shares: 3210, views: "1.8M", thumb: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 20, title: "Renovated my whole bedroom for under $200 😍 watch this", author: "Chloe Martin", country: "🇫🇷 France", authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face", authorBg: "bg-indigo-500", time: "10h", likes: 16700, comments: 1120, shares: 987, views: "312K", thumb: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 21, title: "Wedding surprise dance for my husband 💍💃🥹 he cried", author: "Blessing Obi", country: "🇳🇬 Nigeria", authorAvatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&h=80&fit=crop&crop=face", authorBg: "bg-rose-500", time: "11h", likes: 89400, comments: 6780, shares: 5600, views: "3.4M", thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 22, title: "Paragliding over the Himalayas 🪂🏔️ most insane thing I've done", author: "Deepak Rai", country: "🇳🇵 Nepal", authorAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&crop=face", authorBg: "bg-red-700", time: "12h", likes: 27800, comments: 2100, shares: 1870, views: "623K", thumb: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 23, title: "Teaching my grandma how to use TikTok 😭😂 she's a natural", author: "Carlos Mendez", country: "🇦🇷 Argentina", authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face", authorBg: "bg-cyan-500", time: "13h", likes: 112000, comments: 9870, shares: 8400, views: "5.2M", thumb: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 24, title: "Cape Town sunrise from Signal Hill 🌅🇿🇦 God's creation", author: "Thabo Dlamini", country: "🇿🇦 South Africa", authorAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&h=80&fit=crop&crop=face", authorBg: "bg-yellow-700", time: "14h", likes: 18900, comments: 1340, shares: 1120, views: "423K", thumb: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 25, title: "Homemade sushi tutorial 🍣🇯🇵 step by step for beginners", author: "Yuki Nakamura", country: "🇯🇵 Japan", authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face", authorBg: "bg-pink-400", time: "16h", likes: 9800, comments: 734, shares: 589, views: "187K", thumb: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 26, title: "My son won the national chess championship ♟️🏆 I'm so proud", author: "Elena Popescu", country: "🇷🇴 Romania", authorAvatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=80&h=80&fit=crop&crop=face", authorBg: "bg-blue-500", time: "18h", likes: 34200, comments: 2670, shares: 2230, views: "712K", thumb: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 27, title: "Driving through the Sahara at night ⭐🌙🇲🇦 magical experience", author: "Hassan Benabbou", country: "🇲🇦 Morocco", authorAvatar: "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=80&h=80&fit=crop&crop=face", authorBg: "bg-red-600", time: "20h", likes: 22100, comments: 1780, shares: 1450, views: "498K", thumb: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 28, title: "Crazy lightning storm caught on camera ⚡😱 stay safe everyone", author: "Jake Williams", country: "🇦🇺 Australia", authorAvatar: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=80&h=80&fit=crop&crop=face", authorBg: "bg-green-400", time: "22h", likes: 41500, comments: 3120, shares: 2780, views: "934K", thumb: "https://images.unsplash.com/photo-1461511669078-d46bf351cd6e?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 29, title: "Traditional Ghanaian kente weaving — an art form 🧵🇬🇭", author: "Akua Asante", country: "🇬🇭 Ghana", authorAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face", authorBg: "bg-yellow-600", time: "1d", likes: 13400, comments: 987, shares: 834, views: "278K", thumb: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 30, title: "New York subway talent — this guy is incredible 🎶🗽", author: "Destiny Brown", country: "🇺🇸 USA", authorAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face", authorBg: "bg-purple-600", time: "1d", likes: 78900, comments: 5670, shares: 4890, views: "2.7M", thumb: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 31, title: "My mom seeing snow for the first time ❄️😭💕 priceless reaction", author: "Aminata Coulibaly", country: "🇬🇳 Guinea", authorAvatar: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=80&h=80&fit=crop&crop=face", authorBg: "bg-red-500", time: "1d", likes: 156000, comments: 12400, shares: 10800, views: "8.9M", thumb: "https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 32, title: "Scuba diving in the Great Barrier Reef 🐠🌊🇦🇺 breathtaking", author: "Emma Wilson", country: "🇦🇺 Australia", authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face", authorBg: "bg-teal-600", time: "1d", likes: 24300, comments: 1780, shares: 1560, views: "567K", thumb: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 33, title: "Turkish ice cream vendor prank 🍦😂 did you see that ending?!", author: "Mehmet Yilmaz", country: "🇹🇷 Turkey", authorAvatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop&crop=face", authorBg: "bg-red-600", time: "2d", likes: 93400, comments: 7120, shares: 6450, views: "4.1M", thumb: "https://images.unsplash.com/photo-1557142046-c704a3adf364?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 34, title: "Sunrise yoga on Bali rice terraces 🧘‍♀️🌄 pure bliss", author: "Wayan Sari", country: "🇮🇩 Indonesia", authorAvatar: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=80&h=80&fit=crop&crop=face", authorBg: "bg-emerald-600", time: "2d", likes: 17800, comments: 1230, shares: 1010, views: "389K", thumb: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 35, title: "My village in Cameroon — this is home 🏡🇨🇲 miss this place", author: "Pierre Mbarga", country: "🇨🇲 Cameroon", authorAvatar: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=80&h=80&fit=crop&crop=face", authorBg: "bg-green-700", time: "2d", likes: 44200, comments: 3450, shares: 2980, views: "1.1M", thumb: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 36, title: "Bollywood dance at my cousin's wedding 🎊💃🇮🇳 epic night", author: "Anjali Patel", country: "🇮🇳 India", authorAvatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=80&h=80&fit=crop&crop=face", authorBg: "bg-orange-500", time: "3d", likes: 38700, comments: 2980, shares: 2560, views: "987K", thumb: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 37, title: "Snowboarding in the Swiss Alps 🏂❄️ powder day!!", author: "Lukas Brunner", country: "🇦🇹 Austria", authorAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&h=80&fit=crop&crop=face", authorBg: "bg-blue-600", time: "3d", likes: 15600, comments: 1120, shares: 934, views: "334K", thumb: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 38, title: "Lioness and her cubs in the wild 🦁🌿 Masai Mara Safari", author: "Zawadi Kamau", country: "🇰🇪 Kenya", authorAvatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=80&h=80&fit=crop&crop=face", authorBg: "bg-amber-600", time: "3d", likes: 67800, comments: 4560, shares: 3980, views: "2.3M", thumb: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 39, title: "Old man singing Fado in Lisbon made everyone cry 🎵🇵🇹😭", author: "Maria Santos", country: "🇵🇹 Portugal", authorAvatar: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=80&h=80&fit=crop&crop=face", authorBg: "bg-red-400", time: "4d", likes: 29400, comments: 2340, shares: 2010, views: "756K", thumb: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 40, title: "Chinese New Year dragon parade 🐉🎆🇨🇳 incredible energy", author: "Wei Zhang", country: "🇨🇳 China", authorAvatar: "https://images.unsplash.com/photo-1490750967868-88df5691cc88?w=80&h=80&fit=crop&crop=face", authorBg: "bg-red-700", time: "4d", likes: 51200, comments: 3780, shares: 3340, views: "1.6M", thumb: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 41, title: "Skate park session in Johannesburg 🛹🔥 South Africa got talent", author: "Sipho Nkosi", country: "🇿🇦 South Africa", authorAvatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&crop=face", authorBg: "bg-green-600", time: "5d", likes: 22800, comments: 1790, shares: 1560, views: "512K", thumb: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 42, title: "Traditional Maasai warrior ceremony 🪃🇰🇪 something special", author: "Lekishon Ole Nkoko", country: "🇰🇪 Kenya", authorAvatar: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=80&h=80&fit=crop&crop=face", authorBg: "bg-red-600", time: "5d", likes: 34500, comments: 2670, shares: 2310, views: "834K", thumb: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 43, title: "First time cooking jerk chicken in Jamaica 🇯🇲🍗🔥", author: "Shanique Campbell", country: "🇯🇲 Jamaica", authorAvatar: "https://images.unsplash.com/photo-1578380163861-e3a48e26a38b?w=80&h=80&fit=crop&crop=face", authorBg: "bg-yellow-600", time: "6d", likes: 18400, comments: 1450, shares: 1230, views: "423K", thumb: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 44, title: "Amsterdam canals at golden hour 🌇🚲🇳🇱 living the dream", author: "Lars van den Berg", country: "🇳🇱 Netherlands", authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face", authorBg: "bg-orange-500", time: "6d", likes: 12700, comments: 934, shares: 789, views: "256K", thumb: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 45, title: "Street barbershop in Lagos 💈✂️🇳🇬 the barbershop culture hits different", author: "Emeka Nwosu", country: "🇳🇬 Nigeria", authorAvatar: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=80&h=80&fit=crop&crop=face", authorBg: "bg-green-700", time: "1w", likes: 31400, comments: 2450, shares: 2120, views: "756K", thumb: "https://images.unsplash.com/photo-1560869713-da86a9ec0744?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 46, title: "Accidental slip on ice went viral 😭😂🇨🇦 why did this happen to me", author: "Kevin Tremblay", country: "🇨🇦 Canada", authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face", authorBg: "bg-red-500", time: "1w", likes: 189000, comments: 14500, shares: 13200, views: "12M", thumb: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 47, title: "Hand-painted murals in Dakar — African art is elite 🎨🇸🇳", author: "Omar Seck", country: "🇸🇳 Senegal", authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face", authorBg: "bg-teal-700", time: "1w", likes: 15200, comments: 1120, shares: 934, views: "312K", thumb: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 48, title: "Roman ruins at sunset in Rome 🏛️🌅🇮🇹 history is everywhere here", author: "Giulia Rossi", country: "🇮🇹 Italy", authorAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face", authorBg: "bg-green-500", time: "1w", likes: 28900, comments: 2120, shares: 1890, views: "623K", thumb: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 49, title: "My little brother's reaction to getting a PS5 🎮😭🎉 priceless", author: "Jordan Hayes", country: "🇬🇧 UK", authorAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&h=80&fit=crop&crop=face", authorBg: "bg-blue-700", time: "2w", likes: 74300, comments: 5670, shares: 4980, views: "3.1M", thumb: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 50, title: "Crossing the finish line at my first marathon 🏃‍♀️🏅 I did it!!!", author: "Aïcha Traoré", country: "🇲🇱 Mali", authorAvatar: "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=80&h=80&fit=crop&crop=face", authorBg: "bg-yellow-500", time: "2w", likes: 56700, comments: 4230, shares: 3670, views: "1.4M", thumb: "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 51, title: "Building a mud house the traditional African way 🏗️🇨🇮 ancestors knew", author: "Awa Coulibaly", country: "🇨🇮 Côte d'Ivoire", authorAvatar: "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=80&h=80&fit=crop&crop=face", authorBg: "bg-amber-700", time: "2w", likes: 19800, comments: 1560, shares: 1340, views: "445K", thumb: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 52, title: "Whale jumping out of the water in Cape Verde 🐋🇨🇻 NO WAY", author: "Nélson Tavares", country: "🇨🇻 Cape Verde", authorAvatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=80&h=80&fit=crop&crop=face", authorBg: "bg-blue-500", time: "3w", likes: 112000, comments: 8780, shares: 7650, views: "6.8M", thumb: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 53, title: "Last day of school 🎒😢 my babies are growing up too fast", author: "Ngozi Eze", country: "🇳🇬 Nigeria", authorAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&h=80&fit=crop&crop=face", authorBg: "bg-purple-600", time: "3w", likes: 88400, comments: 7120, shares: 6230, views: "4.2M", thumb: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
];

function VideoPlayer({ video, onClose }) {
  const { currentUser } = useFBAuth();
  const [muted, setMuted] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { id: 1, name: "James W.", text: "This is amazing! 🔥", time: "2h", bg: "bg-blue-500" },
    { id: 2, name: "Patricia M.", text: "Love this so much ❤️", time: "3h", bg: "bg-pink-400" },
  ]);
  const [liked, setLiked] = useState(false);
  const [loved, setLoved] = useState(false);
  const [likes, setLikes] = useState(video.likes);
  const [showComments, setShowComments] = useState(false);

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
        <div className={`w-9 h-9 rounded-full ${video.authorBg} flex-shrink-0 overflow-hidden`}>
          {video.authorAvatar ? (
            <img src={video.authorAvatar} alt={video.author} className="w-full h-full object-cover" onError={e => { e.target.style.display="none"; }} />
          ) : (
            <span className="text-white font-bold text-sm flex items-center justify-center w-full h-full">{video.author[0]}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{video.author}</p>
          <p className="text-white/60 text-xs">{video.country || "🌐"} · {video.time}</p>
        </div>
        <button onClick={() => setMuted(m => !m)} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
          {muted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
        </button>
      </div>

      {/* Video */}
      <div className="flex-1 flex items-center bg-black">
        <video src={video.src} autoPlay controls muted={muted} className="w-full" style={{ maxHeight: "60vh", objectFit: "contain" }} />
      </div>

      {/* Actions */}
      <div className="bg-black/90 px-4 py-2">
        <div className="flex items-center gap-1 mb-2">
          <span className="text-white/60 text-xs">{likes.toLocaleString()} reactions · {video.comments} comments</span>
        </div>
        <div className="flex border-t border-white/10 pt-2">
          <button onClick={() => { setLiked(p => { setLikes(l => l + (p ? -1 : 1)); return !p; }); setLoved(false); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg ${liked ? "text-[#1877F2]" : "text-white/70"}`}>
            <ThumbsUp className="w-5 h-5" />
            <span className="text-sm font-semibold">Like</span>
          </button>
          <button onClick={() => { setLoved(p => { setLikes(l => l + (p ? -1 : 1)); return !p; }); setLiked(false); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg ${loved ? "text-red-400" : "text-white/70"}`}>
            <span className="text-lg">❤️</span>
            <span className="text-sm font-semibold">Love</span>
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

        {/* Comments section */}
        {showComments && (
          <div className="mt-2 border-t border-white/10 pt-2 max-h-48 overflow-y-auto space-y-2">
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
          <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center flex-shrink-0">
            {currentUser?.profilePicture
              ? <img src={currentUser.profilePicture} className="w-full h-full object-cover rounded-full" alt="" />
              : <span className="text-white text-xs font-bold">{currentUser?.firstName?.[0] || "Y"}</span>}
          </div>
          <div className="flex-1 flex items-center bg-white/10 rounded-full px-3 py-2 gap-2">
            <input
              type="text"
              value={comment}
              onChange={e => setComment(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submitComment()}
              placeholder="Write a comment..."
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/40"
            />
            <button onClick={submitComment}><Send className="w-4 h-4 text-white/60" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video, onPlay }) {
  const [liked, setLiked] = useState(false);
  const [loved, setLoved] = useState(false);
  const [likes, setLikes] = useState(video.likes);

  return (
    <div className="bg-white mb-2 shadow-sm">
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <div className={`w-10 h-10 rounded-full ${video.authorBg} flex-shrink-0 overflow-hidden`}>
          {video.authorAvatar ? (
            <img src={video.authorAvatar} alt={video.author} className="w-full h-full object-cover" onError={e => { e.target.style.display = "none"; }} />
          ) : (
            <div className={`w-full h-full ${video.authorBg} flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">{video.author[0]}</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{video.author}</p>
          <p className="text-xs text-gray-400">{video.time} · {video.country || "🌐"}</p>
        </div>
      </div>
      <p className="px-4 pb-2 text-sm text-gray-900 font-medium">{video.title}</p>

      <div className="relative cursor-pointer" onClick={() => onPlay(video)}>
        <img src={video.thumb} alt={video.title} className="w-full object-cover" style={{ maxHeight: 200 }} onError={e => { e.target.style.display = "none"; }} />
        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
          <div className="w-14 h-14 bg-black/60 rounded-full flex items-center justify-center">
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 rounded px-1.5 py-0.5">
          <span className="text-white text-xs font-semibold">{video.views} views</span>
        </div>
      </div>

      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-sm">👍 ❤️</span>
          <span className="text-xs text-gray-500 ml-1">{likes.toLocaleString()}</span>
        </div>
        <span className="text-xs text-gray-500">{video.comments} comments · {video.shares} shares</span>
      </div>
      <div className="mx-4 border-t border-gray-100" />
      <div className="flex px-1 py-1">
        <button onClick={() => { setLiked(p => { setLikes(l => l + (p ? -1 : 1)); return !p; }); setLoved(false); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-gray-100 ${liked ? "text-[#1877F2]" : "text-gray-500"}`}>
          <ThumbsUp className="w-5 h-5" />
          <span className="text-sm font-semibold">Like</span>
        </button>
        <button onClick={() => { setLoved(p => { setLikes(l => l + (p ? -1 : 1)); return !p; }); setLiked(false); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-gray-100 ${loved ? "text-red-500" : "text-gray-500"}`}>
          <span className="text-lg">❤️</span>
          <span className="text-sm font-semibold">Love</span>
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

      <BottomTabBar />
    </div>
  );
}