// ==========================================
// DOĞUM GÜNÜ SİTESİ ÖZELLEŞTİRME AYARLARI
// Bu dosyayı değiştirerek arkadaşının bilgilerini kolayca güncelleyebilirsin!
// ==========================================

const BIRTHDAY_CONFIG = {
    // Arkadaşının Bilgileri
    friend: {
        name: "Ecem", // Arkadaşının adı
        birthdayMonth: 8, // Doğum günü ayı (Ağustos = 8)
        birthdayDay: 15,  // Doğum günü günü (1 - 31)
        avatarEmoji: "🌸", // Varsayılan emoji
        avatarImageUrl: "https://avatars.githubusercontent.com/u/214686151?v=4", // Arkadaşının resim linki

        // Özellikleri / Rozetleri
        traits: [
            "Hoşgörülü",
            "Saygılı",
            "Bilgili [Dünyadaki tüm ülkelerin yerini biliyor.(sanırım 😉)]",
            "Zeki",
            "Havalı"
        ],

        // Özel Doğum Günü Mesajı
        specialMessage: ""
    },

    // Karakter (Rehber Emoji Adam) Ayarları
    character: {
        name: "Kutlama Rehberi",
        emoji: "🐸", // Karakter emojisi
        avatarUrl: "https://media1.tenor.com/m/ZpFrNrE6WvcAAAAC/pepe.gif", // Karakter Pepe GIF URL'si

        // Karakterin Konuşma Diyalogları (1. Kısım)
        dialogues: [
            {
                text: "Merhaba Ecem! Hoşgeldin! Nasılsın?",
                html: '<div class="tenor-gif-embed" data-postid="17526862" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/pepe-pepe-the-frog-hi-hello-wave-gif-17526862">Pepe Pepe The Frog Sticker</a>from <a href="https://tenor.com/search/pepe-stickers">Pepe Stickers</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
            },
            {
                text: "Umarım iyisindir.",
                html: '<div class="tenor-gif-embed" data-postid="24439653" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/peepo-smile-peepo-smile-smiling-peepo-happy-gif-24439653">Peepo Smile Sticker</a>from <a href="https://tenor.com/search/peepo-stickers">Peepo Stickers</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
            },
            {
                text: "Çünkü bugün senin için küçük bir şey hazırladım.",
                html: '<div class="tenor-gif-embed" data-postid="877068603089866172" data-share-method="host" data-aspect-ratio="1.51724" data-width="100%"><a href="https://tenor.com/view/pepe-peepo-gif-877068603089866172">Pepe Peepo Sticker</a>from <a href="https://tenor.com/search/pepe-stickers">Pepe Stickers</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
            },
            {
                text: "Ama hemen söylemeyeceğim.",
                html: '<div class="tenor-gif-embed" data-postid="8365926316571616935" data-share-method="host" data-aspect-ratio="1.1828" data-width="100%"><a href="https://tenor.com/view/peepo-gif-8365926316571616935">Peepo Sticker</a>from <a href="https://tenor.com/search/peepo-stickers">Peepo Stickers</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
            },
            {
                text: "Önce bir şey soracağım...",
                html: '<div class="tenor-gif-embed" data-postid="24439653" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/peepo-smile-peepo-smile-smiling-peepo-happy-gif-24439653">Peepo Smile Sticker</a>from <a href="https://tenor.com/search/peepo-stickers">Peepo Stickers</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
            },
            {
                text: "Sence bugün neden buradasın? 👀",
                html: '<div class="tenor-gif-embed" data-postid="11419901161593509716" data-share-method="host" data-aspect-ratio="2.49" data-width="100%"><a href="https://tenor.com/view/hmm-thinking-council-peepo-pepe-gif-11419901161593509716">Hmm Thinking GIF</a>from <a href="https://tenor.com/search/hmm-gifs">Hmm GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
            },
            {
                text: "Hmm... Hiç mi tahminin yok?",
                html: '<div class="tenor-gif-embed" data-postid="16186824" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/pepe-the-frog-thinking-absorbed-contemplative-deliberating-gif-16186824">Pepe The Frog Thinking Sticker</a>from <a href="https://tenor.com/search/pepe+the+frog-stickers">Pepe The Frog Stickers</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
            },
            {
                text: "O zaman sana küçük bir ipucu vereyim.",
                html: '<div class="tenor-gif-embed" data-postid="7390806346137492215" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/pepe-gif-7390806346137492215">Pepe GIF</a>from <a href="https://tenor.com/search/pepe-gifs">Pepe GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
            },
            {
                text: "Bugün sıradan bir gün değil.",
                html: '<div class="tenor-gif-embed" data-postid="20417301" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/blankies-peepo-gif-20417301">Blankies Peepo Sticker</a>from <a href="https://tenor.com/search/blankies-stickers">Blankies Stickers</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
            },
            {
                text: "Çünkü bugün...",
                html: '<div class="tenor-gif-embed" data-postid="4209197159388134598" data-share-method="host" data-aspect-ratio="0.751004" data-width="100%"><a href="https://tenor.com/view/cat-drinda-gif-4209197159388134598">Cat Drinda GIF</a>from <a href="https://tenor.com/search/cat+drinda-gifs">Cat Drinda GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
            },
            {
                text: "Senin günün.",
                html: '<div class="tenor-gif-embed" data-postid="4209197159388134598" data-share-method="host" data-aspect-ratio="0.751004" data-width="100%"><a href="https://tenor.com/view/cat-drinda-gif-4209197159388134598">Cat Drinda GIF</a>from <a href="https://tenor.com/search/cat+drinda-gifs">Cat Drinda GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
            },
            {
                text: "iyi ki doğdun Ecemmmmmmmmm!!!",
                html: '<div class="tenor-gif-embed" data-postid="3490178252291205302" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/dj-party-peppo-pepe-gif-3490178252291205302">Dj Party Sticker</a>from <a href="https://tenor.com/search/dj-stickers">Dj Stickers</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
            },
            {
                text: "Senin için bir pasta hazırladım!",
                html: '<div class="tenor-gif-embed" data-postid="11989674946412186826" data-share-method="host" data-aspect-ratio="1.33155" data-width="100%"><a href="https://tenor.com/view/kitten-cat-birthdaycat-birthday-cute-gif-11989674946412186826">Kitten Cat GIF</a>from <a href="https://tenor.com/search/kitten-gifs">Kitten GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
            },
            {
                text: "Dilek tut ve mumları üfle!",
                html: '<div class="tenor-gif-embed" data-postid="20417301" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/blankies-peepo-gif-20417301">Blankies Peepo Sticker</a>from <a href="https://tenor.com/search/blankies-stickers">Blankies Stickers</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
            }
        ],

        // Son Konuşma Bölümü (Kişi Kartından Sonra)
        endingDialogues: [
            {
                text: "Sanırım artık neden burada olduğunu anlamışsındır.",
                html: '<div class="tenor-gif-embed" data-postid="16880601942232757801" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/cute-cat-cute-kitty-silly-cat-silly-kitty-snug-kitty-gif-16880601942232757801">Cute Cat Cute Kitty GIF</a>from <a href="https://tenor.com/search/cute+cat-gifs">Cute Cat GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
            },
            {
                text: "Bugün senin için biraz daha özel bir gün olsun istedim.",
                html: '<div class="tenor-gif-embed" data-postid="6353129062187150970" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/cute-stare-kitty-cat-silly-cat-gif-6353129062187150970">Cute Stare GIF</a>from <a href="https://tenor.com/search/cute-gifs">Cute GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
            },
            {
                text: "Umarım yeni yaşında bol bol güzel anın olur.",
                html: '<div class="tenor-gif-embed" data-postid="1070383474023140244" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/cute-cat-cute-cat-kitty-i-love-you-gif-1070383474023140244">Cute Cat Meme</a>from <a href="https://tenor.com/search/cute-memes">Cute Memes</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
            },
            {
                text: "Bol kahkaha, güzel anılar ve unutamayacağın güzel günler...",
                html: '<div class="tenor-gif-embed" data-postid="8393027935639589957" data-share-method="host" data-aspect-ratio="0.7751" data-width="100%"><a href="https://tenor.com/view/cat-cute-cat-bow-cat-pink-cat-smile-cat-hello-gif-8393027935639589957">Cat Cute Cat Bow GIF</a>from <a href="https://tenor.com/search/cat+cute-gifs">Cat Cute GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
            },
            {
                text: "Ve tabii ki bugün yüzünde kocaman bir gülümseme.",
                html: '<div class="tenor-gif-embed" data-postid="24439653" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/peepo-smile-peepo-smile-smiling-peepo-happy-gif-24439653">Peepo Smile Sticker</a>from <a href="https://tenor.com/search/peepo-stickers">Peepo Stickers</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
            },
            {
                text: "İyi ki doğmuşsun!",
                html: '<div class="tenor-gif-embed" data-postid="15543389676503703462" data-share-method="host" data-aspect-ratio="1.875" data-width="100%"><a href="https://tenor.com/view/lovegers-peepo-peepolove-love-pepe-gif-15543389676503703462">Lovegers Peepo Sticker</a>from <a href="https://tenor.com/search/lovegers-stickers">Lovegers Stickers</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
            }
        ]
    },

    // Pasta ve Mum Ayarları
    cake: {
        candleCount: 3, // Pastanın sadece en üstünde 3 mum
        blownMessage: "Harika üfledin! Tüm dileklerin kabul olsun! ✨"
    }
};

// Modül veya Global değişken erişimi
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BIRTHDAY_CONFIG;
}
