export const experience = {
  brand: "lovelingo",
  recipient: "Ryues Ako",
  sender: "the love of your life",
  section: "BIRTHDAY PROJECT",
  unit: "UNIT 1",
  unitTitle: "Ryues Ako's birthday project",
  guidebookTitle: "Your birthday mission",
  guidebookText:
    "Selesaikan tiga pelajaran kecil tentang kita. Setelah itu, buka course tambahan dan final chest yang sudah aku siapin khusus buat kamu.",
  topThreeCards: [
    {
      title: "Top 3 things I love about you",
      subtitle: "There are a million things to love, but these three always get me.",
      items: [
        "Your voice - suara favorit yang nggak pernah bikin aku bosen.",
        "Your way with words - somehow kamu selalu tahu apa yang harus dikatakan.",
        "Your love language - every little thing you do always makes me feel loved."
      ]
    },
    {
      title: "Top 3 favorite memories of us",
      subtitle: "The moments that still live rent-free in my head.",
      items: [
        "First time we met - siapa sangka dari teman di group chat kita bisa pacaran dan awet sampai sekarang?",
        "When I realized you were trying to get closer to me - tiba-tiba affectionate banget, and I surprisingly liked it hehe.",
        "All the gifts and effort you've given me - knowing you were thinking of me while making them makes everything feel even more special."
      ]
    }
  ],
  finalCard: {
    eyebrow: "YOU UNLOCKED A BIRTHDAY LETTER",
    title: "For my birthday boy,",
    paragraphs: [
      "Happiest birthday to my favorite person in the world. You're the best person I could ever ask for, and I genuinely don't know where I'd be without you.",
      "You're the funniest, sweetest, and most loving person ever. You always make me smile whenever I'm upset, and I'm so lucky that I met you. Thank you for always loving me and being there for me.",
      "I want you to know how loved you are, not just because it's your birthday, but because every single day you deserve the world. I never want to lose you. I hope you have an amazing birthday. I love you more than anything, and you will always be my person in every universe.",
      "I'm really glad that every day I get to call you mine. It's a blessing, and I'm forever grateful that God put you in my life. I promise to always stay by your side and love you with all my heart. You've done nothing but make me the happiest person alive, and I can't thank you enough for that. Happy, happy birthday, cintaku. 🤍"
    ],
    closing: "from the deepest part of my heart, from your prettiest lover,",
    signature: "Athariel"
  },
  lessons: [
    {
      id: "lesson-1",
      label: "All about you",
      shortLabel: "Start here, sayang",
      icon: "heart",
      accent: "green",
      exercises: [
        {
          type: "choice",
          prompt: "Pilih jawaban yang paling tepat",
          question: "Dari semua hal random, mana yang langsung bikin aku keinget kamu?",
          choices: ["warna putih", "warna ungu", "warna oranye"],
          answer: "warna putih",
          success: "White will always remind me of you."
        },
        {
          type: "arrange",
          prompt: "Susun birthday message ini",
          hint: "A little birthday wish",
          sentence: "selamat ulang tahun sayang",
          distractors: ["besok", "mungkin"]
        },
        {
          type: "match",
          prompt: "Pasangkan hal favoritku tentang kamu",
          pairs: [
            ["your voice", "my favorite sound"],
            ["your words", "always get me"],
            ["your love language", "makes me feel loved"]
          ]
        },
        {
          type: "fill",
          prompt: "Lengkapi kalimat",
          sentence: "Aku paling suka kalau kamu manggil aku ____.",
          choices: ["cantik", "boskyuh", "ragebaiter"],
          answer: "cantik"
        }
      ]
    },
    {
      id: "lesson-2",
      label: "Our little story",
      shortLabel: "Keep going, cintaku",
      icon: "heart",
      accent: "green",
      exercises: [
        {
          type: "listen",
          prompt: "Dengarkan birthday wish ini",
          speech: "Semoga di hari ulang tahun kamu ini, kamu dikelilingi sama orang dan hal yang kamu cintai.",
          choices: [
            "Semoga di hari ulang tahun kamu ini, kamu dikelilingi sama orang dan hal yang kamu cintai.",
            "Semoga hari ini kamu menang terus waktu mabar.",
            "Semoga hari ini kamu bisa tidur tiga kali."
          ],
          answer: "Semoga di hari ulang tahun kamu ini, kamu dikelilingi sama orang dan hal yang kamu cintai."
        },
        {
          type: "choice",
          prompt: "Flashback sebentar",
          question: "Kita pertama kali kenal lewat mana?",
          choices: ["Gods group chat", "Roblox", "Mobile Legends"],
          answer: "Gods group chat",
          success: "Berawal dari becanda dan ragebait, ended up being us."
        },
        {
          type: "arrange",
          prompt: "Susun potongan cerita kita",
          hint: "Unexpected plot twist",
          sentence: "dari teman bercanda kita jadi saling sayang",
          distractors: ["sekadar", "katanya"]
        },
        {
          type: "match",
          prompt: "Cocokkan hal-hal tentang kita",
          pairs: [
            ["sleep calling", "nemenin sampai tidur"],
            ["mabar", "Roblox dan ML"],
            ["inside joke", "gayut parkir"]
          ]
        }
      ]
    },
    {
      id: "lesson-3",
      label: "How well do I know you?",
      shortLabel: "Almost there, love",
      icon: "crown",
      accent: "green",
      exercises: [
        {
          type: "match",
          prompt: "Pasangkan fakta tentang kamu",
          pairs: [
            ["game favorit", "Violence District"],
            ["tidur", "bisa 3 kali sehari"],
            ["sarapan", "nasi lemak"],
            ["hewan favorit", "kucing"]
          ]
        },
        {
          type: "listen",
          prompt: "One more wish for you",
          speech: "Dan semoga kamu didatangi banyak hal baik di tahun ini dan seterusnya.",
          choices: [
            "Dan semoga kamu didatangi banyak hal baik di tahun ini dan seterusnya.",
            "Dan semoga kamu tidak gampang kena ragebait lagi.",
            "Dan semoga nasi lemaknya selalu tersedia."
          ],
          answer: "Dan semoga kamu didatangi banyak hal baik di tahun ini dan seterusnya."
        },
        {
          type: "choice",
          prompt: "Pilih jawaban paling Ryues",
          question: "Kalau lagi kangen, biasanya kamu jadi...",
          choices: ["rewel", "cuek", "menghilang"],
          answer: "rewel",
          success: "Rewel, manja, dan clingy abis - but I love it."
        },
        {
          type: "arrange",
          prompt: "Susun final promise ini",
          hint: "In every universe",
          sentence: "i will be there for you always",
          distractors: ["maybe", "sometimes"]
        }
      ]
    }
  ]
};
