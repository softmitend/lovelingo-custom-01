export const experience = {
  brand: "lovelingo",
  recipient: "sayang",
  sender: "someone who loves you",
  section: "SECTION 1",
  unit: "UNIT 1",
  unitTitle: "A little journey about us",
  guidebookTitle: "Tentang perjalanan ini",
  guidebookText: "Selesaikan tiga pelajaran kecil secara berurutan. Setelah itu ada satu course tambahan dan chest terakhir untukmu.",
  topThreeCards: [
    { title: "Top 3 hal favorit tentang kamu", subtitle: "Kalau harus dipilih, ini tiga yang paling sering muncul di kepalaku.", items: ["Cara kamu membuat hal sederhana terasa lebih hangat.", "Perhatian kecilmu yang sering kamu anggap biasa saja.", "Fakta bahwa kehadiranmu selalu terasa menenangkan."] },
    { title: "Top 3 memori kecil kita", subtitle: "Bukan yang paling mewah, tapi yang paling tinggal.", items: ["Obrolan random yang malah bikin betah berlama-lama.", "Momen ketika aku senyum sendiri cuma karena kabarmu.", "Saat bersama kamu dan waktu terasa lewat terlalu cepat."] }
  ],
  finalCard: {
    eyebrow: "YOU UNLOCKED A GIFT",
    title: "Untuk kamu,",
    paragraphs: [
      "Aku mungkin tidak selalu pandai merangkai semuanya dalam satu napas, jadi aku menyembunyikannya di perjalanan kecil ini.",
      "Ada satu hadiah yang tidak bisa benar-benar dimasukkan ke dalam chest, jadi aku titipkan jalannya di sini.",
      "Buka satu per satu, ya. Ada sesuatu yang ditulis khusus untukmu, dan ada satu sertifikat kecil yang menyimpan cerita yang lebih besar."
    ],
    closing: "with all my heart,",
    signature: "your favorite person"
  },
  lessons: [
    { id: "lesson-1", label: "Kenali perasaannya", shortLabel: "Start here", icon: "heart", accent: "green", exercises: [
      { type: "choice", prompt: "Pilih jawaban yang paling tepat", question: "Hal sederhana yang paling sering membuat hariku lebih baik adalah...", choices: ["tidur siang", "mendengar kabarmu", "scroll tanpa tujuan"], answer: "mendengar kabarmu", success: "Yep. Sesederhana itu." },
      { type: "arrange", prompt: "Susun kalimat ini", hint: "A little truth", sentence: "aku selalu senang ketika ada pesan darimu", distractors: ["mungkin", "nanti"] },
      { type: "match", prompt: "Pasangkan yang cocok", pairs: [["senyummu", "mood booster"], ["pesanmu", "notification favorit"], ["namamu", "yang kucari di layar"]] },
      { type: "fill", prompt: "Lengkapi kalimat", sentence: "Dari banyak orang, aku paling suka menghabiskan waktu dengan ____.", choices: ["kamu", "deadline", "alarm"], answer: "kamu" }
    ]},
    { id: "lesson-2", label: "Hal kecil tentang kita", shortLabel: "Keep going", icon: "heart", accent: "green", exercises: [
      { type: "listen", prompt: "Dengarkan dan pilih kalimatnya", speech: "Aku suka bagaimana kamu bisa membuat hal biasa terasa spesial.", choices: ["Aku suka bagaimana kamu bisa membuat hal biasa terasa spesial.", "Aku sedang mencari charger yang hilang.", "Hari ini sepertinya akan hujan."], answer: "Aku suka bagaimana kamu bisa membuat hal biasa terasa spesial." },
      { type: "choice", prompt: "Pilih yang paling masuk akal", question: "Kalau aku tiba-tiba tersenyum melihat layar, kemungkinan besar karena...", choices: ["kamu", "update aplikasi", "baterai 100%"], answer: "kamu" },
      { type: "arrange", prompt: "Susun potongan pesannya", hint: "No translation needed", sentence: "bersamamu momen kecil terasa layak diingat", distractors: ["sangat", "kadang"] },
      { type: "match", prompt: "Cocokkan memori dan rasanya", pairs: [["obrolan random", "betah"], ["ketawa bareng", "hangat"], ["waktu bersamamu", "terlalu cepat"]] }
    ]},
    { id: "lesson-3", label: "Satu pesan terakhir", shortLabel: "Almost there", icon: "crown", accent: "green", exercises: [
      { type: "fill", prompt: "Isi kata yang hilang", sentence: "Aku mungkin tidak selalu bilang, tapi aku benar-benar ____ kamu.", choices: ["menghargai", "mengabaikan", "melupakan"], answer: "menghargai" },
      { type: "listen", prompt: "Dengarkan pesan pendek ini", speech: "Terima kasih sudah menjadi bagian favorit dari banyak hariku.", choices: ["Terima kasih sudah menjadi bagian favorit dari banyak hariku.", "Terima kasih sudah mengingatkan jadwal besok.", "Terima kasih sudah membaca sampai sini."], answer: "Terima kasih sudah menjadi bagian favorit dari banyak hariku." },
      { type: "choice", prompt: "Satu pertanyaan terakhir", question: "Siapa tokoh utama dari perjalanan mini ini?", choices: ["kamu", "aku", "burung hijau yang tidak ada di sini"], answer: "kamu" },
      { type: "arrange", prompt: "Susun kalimat penutup", hint: "Final answer", sentence: "dari semua pilihan aku tetap memilih kamu", distractors: ["mungkin", "besok"] }
    ]}
  ]
};
