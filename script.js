// ==========================================
// DOĞUM GÜNÜ SİTESİ - ETKİLEŞİM VE OYUN MANTIĞI
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------
    // State Variables
    // --------------------------------------------------
    let currentDialogueIndex = 0;
    let blownCandleCount = 0;
    let totalCandles = BIRTHDAY_CONFIG.cake.candleCount || 5;
    let soundEnabled = true;
    let countdownInterval = null;

    // --------------------------------------------------
    // DOM Element References
    // --------------------------------------------------
    const stageIntro = document.getElementById('stage-intro');
    const stageCake = document.getElementById('stage-cake');
    const stageCard = document.getElementById('stage-card');
    const stageCountdown = document.getElementById('stage-countdown');

    const characterAvatar = document.getElementById('character-avatar');
    const dialogueText = document.getElementById('dialogue-text');
    const btnNextDialogue = document.getElementById('btn-next-dialogue');

    const candlesHolder = document.getElementById('candles-holder');
    const cakeInstruction = document.getElementById('cake-instruction');
    const cakeActionBar = document.getElementById('cake-action-bar');
    const btnFinishCake = document.getElementById('btn-finish-cake');

    const friendAvatar = document.getElementById('friend-avatar');
    const friendName = document.getElementById('friend-name');
    const traitsList = document.getElementById('traits-list');
    const friendMessage = document.getElementById('friend-message');
    const btnToCountdown = document.getElementById('btn-to-countdown');

    const btnConfetti = document.getElementById('btn-confetti');
    const btnReplay = document.getElementById('btn-replay');
    const btnSoundToggle = document.getElementById('btn-sound-toggle');
    const soundIcon = document.getElementById('sound-icon');

    const speakerName = document.getElementById('speaker-name');
    const rpgArrow = document.getElementById('rpg-arrow');
    const rpgDialogueBox = document.getElementById('rpg-dialogue-box');
    const btnNextLabel = document.getElementById('btn-next-label');

    // Typewriter state
    let isTyping = false;
    let typewriterTimeout = null;

    // --------------------------------------------------
    // Web Audio Synthesizer (Zero External File Dependency)
    // --------------------------------------------------
    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playSound(type) {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            if (type === 'click') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.08);
            } else if (type === 'typewriter') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'square';
                const undertalePitch = 235 + (Math.random() * 40 - 20);
                osc.frequency.setValueAtTime(undertalePitch, now);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.038);
            } else if (type === 'blow') {
                const bufferSize = ctx.sampleRate * 0.3;
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const noise = ctx.createBufferSource();
                noise.buffer = buffer;
                const filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(1000, now);
                filter.frequency.linearRampToValueAtTime(200, now + 0.3);
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0.4, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                noise.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                noise.start(now);
            } else if (type === 'fanfare') {
                const notes = [523.25, 659.25, 783.99, 1046.50];
                notes.forEach((freq, index) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now + index * 0.12);
                    gain.gain.setValueAtTime(0.3, now + index * 0.12);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.12 + 0.3);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now + index * 0.12);
                    osc.stop(now + index * 0.12 + 0.3);
                });
            }
        } catch (e) {
            console.log('Sound play error:', e);
        }
    }

    const celebrationAudio = document.getElementById('celebration-audio');
    const btnSettingsToggle = document.getElementById('btn-settings-toggle');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const settingsModal = document.getElementById('settings-modal');
    const volumeSlider = document.getElementById('volume-slider');
    const volumePercentage = document.getElementById('volume-percentage');
    // Default 10% Volume Start
    if (celebrationAudio) {
        celebrationAudio.volume = 0.10;
    }
    if (volumeSlider) volumeSlider.value = 10;
    if (volumePercentage) volumePercentage.textContent = "10%";

    // --------------------------------------------------
    // Audio Controller
    // --------------------------------------------------
    function enableAudioOnInteraction() {
        getAudioContext();
    }

    ['pointerdown', 'mousemove', 'click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
        window.addEventListener(evt, enableAudioOnInteraction, { passive: true });
    });

    // Audio Toggle Listener
    btnSoundToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        soundEnabled = !soundEnabled;
        soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
        if (!soundEnabled && celebrationAudio) {
            celebrationAudio.pause();
        }
    });

    // --------------------------------------------------
    // Settings Modal & Master Volume Control
    // --------------------------------------------------
    if (btnSettingsToggle && settingsModal) {
        btnSettingsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsModal.classList.remove('hidden');
            settingsModal.classList.add('active');
        });
    }

    if (btnCloseSettings && settingsModal) {
        btnCloseSettings.addEventListener('click', () => {
            settingsModal.classList.remove('active');
            settingsModal.classList.add('hidden');
        });
    }

    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.remove('active');
                settingsModal.classList.add('hidden');
            }
        });
    }

    // Dynamic Volume Slider Control
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            if (celebrationAudio) celebrationAudio.volume = val / 100;
            if (volumePercentage) volumePercentage.textContent = `${val}%`;

            if (val == 0) {
                soundIcon.textContent = '🔇';
            } else {
                soundEnabled = true;
                soundIcon.textContent = '🔊';
            }
        });
    }

    // --------------------------------------------------
    // Ambient Floating Background Particles
    // --------------------------------------------------
    function createAmbientParticles() {
        const container = document.getElementById('particles-container');
        if (!container) return;
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'bg-particle';
            const size = Math.random() * 6 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 12 + 8}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            container.appendChild(particle);
        }
    }
    createAmbientParticles();

    // --------------------------------------------------
    // STAGE TRANSITION HELPER
    // --------------------------------------------------
    function goToStage(targetStage) {
        playSound('click');
        const stages = [stageIntro, stageCake, stageCard, stageEnding, stageCountdown];
        stages.forEach(stage => {
            if (stage === targetStage) {
                stage.classList.remove('hidden');
                stage.classList.add('active');
            } else {
                stage.classList.add('hidden');
                stage.classList.remove('active');
            }
        });
    }

    // --------------------------------------------------
    // STAGE 1: CHARACTER & 2D RPG DIALOGUE LOGIC
    // --------------------------------------------------
    function updateGuideDisplay(item) {
        if (!characterAvatar) return;
        
        // If dialogue has custom HTML embed (Tenor GIF embed)
        if (typeof item === 'object' && item.html) {
            characterAvatar.innerHTML = item.html;
            // Re-trigger Tenor embed script execution if needed
            if (window.Tenor && typeof window.Tenor.default === 'object' && typeof window.Tenor.default.clean === 'function') {
                window.Tenor.default.clean();
            } else {
                // Dynamically re-execute tenor embed script
                const oldScript = document.getElementById('tenor-script');
                if (oldScript) oldScript.remove();
                const script = document.createElement('script');
                script.id = 'tenor-script';
                script.src = 'https://tenor.com/embed.js';
                script.async = true;
                document.body.appendChild(script);
            }
        } else {
            // Fallback to config default character avatar
            const char = BIRTHDAY_CONFIG.character;
            if (char.avatarUrl) {
                characterAvatar.innerHTML = `<img src="${char.avatarUrl}" alt="${char.name || ''}">`;
            } else {
                characterAvatar.textContent = char.emoji || "🐸";
            }
        }
    }

    function initIntroStage() {
        const char = BIRTHDAY_CONFIG.character;
        if (speakerName) {
            speakerName.textContent = char.name || "Kutlama Rehberi";
        }

        currentDialogueIndex = 0;
        startTypewriterDialogue();
    }

    let partyInterval = null;

    function triggerBirthdayPartyEffects() {
        // 1. Activate Rainbow Light Effects (NO Screen Shake)
        document.body.classList.add('rainbow-party');

        // 2. Continuous Confetti Poppers while music plays
        triggerSideConfetti();
        if (partyInterval) clearInterval(partyInterval);
        partyInterval = setInterval(() => triggerSideConfetti(), 2500);

        // 3. Play Timeline 1 Audio
        if (soundEnabled && celebrationAudio) {
            celebrationAudio.currentTime = 0;
            if (volumeSlider) celebrationAudio.volume = volumeSlider.value / 100;
            celebrationAudio.play().catch(err => console.log('Audio error:', err));

            // Stop rainbow lights and confetti when timeline 1 audio ends!
            celebrationAudio.onended = () => {
                document.body.classList.remove('rainbow-party');
                if (partyInterval) clearInterval(partyInterval);
            };
        }
    }

    function startTypewriterDialogue() {
        const dialogues = BIRTHDAY_CONFIG.character.dialogues;
        if (typewriterTimeout) clearTimeout(typewriterTimeout);

        if (rpgArrow) rpgArrow.classList.remove('active');

        if (currentDialogueIndex < dialogues.length) {
            const dialogueItem = dialogues[currentDialogueIndex];
            const targetText = typeof dialogueItem === 'object' ? dialogueItem.text : dialogueItem;

            // Update guide view (Tenor GIF / Sticker for current dialogue)
            updateGuideDisplay(dialogueItem);

            // Trigger Danza Kuduro celebration on "iyi ki doğdun Ecemmmmmmmmm!!!" (12. bölüm, index 11)
            if (currentDialogueIndex === 11 || targetText.toLowerCase().includes("iyi ki doğdun")) {
                triggerBirthdayPartyEffects();
            }

            dialogueText.textContent = '';
            isTyping = true;
            if (characterAvatar) characterAvatar.classList.add('talking');
            let charIndex = 0;

            function typeNextChar() {
                if (charIndex < targetText.length) {
                    dialogueText.textContent += targetText[charIndex];
                    if (targetText[charIndex] !== ' ') {
                        playSound('typewriter');
                    }
                    charIndex++;
                    typewriterTimeout = setTimeout(typeNextChar, 40);
                } else {
                    isTyping = false;
                    if (characterAvatar) characterAvatar.classList.remove('talking');
                    if (rpgArrow) rpgArrow.classList.add('active');

                    if (btnNextLabel) {
                        if (currentDialogueIndex === dialogues.length - 1) {
                            btnNextLabel.textContent = "Pastaya Geç 🎂";
                        } else {
                            btnNextLabel.textContent = "Devam Et";
                        }
                    }
                }
            }

            typeNextChar();
        }
    }

    function advanceOrCompleteDialogue() {
        const dialogues = BIRTHDAY_CONFIG.character.dialogues;

        if (isTyping) {
            // Instant fast-forward typewriter on click
            if (typewriterTimeout) clearTimeout(typewriterTimeout);
            const dialogueItem = dialogues[currentDialogueIndex];
            const targetText = typeof dialogueItem === 'object' ? dialogueItem.text : dialogueItem;
            dialogueText.textContent = targetText;
            isTyping = false;
            if (characterAvatar) characterAvatar.classList.remove('talking');
            if (rpgArrow) rpgArrow.classList.add('active');
            if (btnNextLabel) {
                if (currentDialogueIndex === dialogues.length - 1) {
                    btnNextLabel.textContent = "Pastaya Geç 🎂";
                } else {
                    btnNextLabel.textContent = "Devam Et";
                }
            }
        } else {
            // Advance to next dialogue line
            currentDialogueIndex++;
            if (currentDialogueIndex < dialogues.length) {
                playSound('click');
                startTypewriterDialogue();
            } else {
                // Move to Stage 2: Cake
                if (characterAvatar) characterAvatar.classList.remove('talking');
                goToStage(stageCake);
                initCakeStage();
            }
        }
    }

    btnNextDialogue.addEventListener('click', advanceOrCompleteDialogue);

    if (rpgDialogueBox) {
        rpgDialogueBox.addEventListener('click', advanceOrCompleteDialogue);
    }

    // --------------------------------------------------
    // STAGE 2: INTERACTIVE CAKE & CANDLE BLOWING LOGIC
    // --------------------------------------------------
    // DOM References for Stage Ending
    const stageEnding = document.getElementById('stage-ending');
    const endingCharacterAvatar = document.getElementById('ending-character-avatar');
    const endingDialogueText = document.getElementById('ending-dialogue-text');
    const btnNextEndingDialogue = document.getElementById('btn-next-ending-dialogue');
    const endingRpgArrow = document.getElementById('ending-rpg-arrow');
    const endingRpgDialogueBox = document.getElementById('ending-rpg-dialogue-box');
    const btnEndingNextLabel = document.getElementById('btn-ending-next-label');

    let currentEndingDialogueIndex = 0;
    let isEndingTyping = false;
    let endingTypewriterTimeout = null;

    // --------------------------------------------------
    // Floating Balloons Helper
    // --------------------------------------------------
    function createRisingBalloons() {
        const colors = ['#ff4081', '#8a2be2', '#ffd700', '#00e5ff', '#ff5722', '#00ff66'];
        const container = document.getElementById('particles-container') || document.body;

        for (let i = 0; i < 25; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'floating-balloon';
            balloon.style.left = `${Math.random() * 90 + 5}%`;
            balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            balloon.style.animationDuration = `${Math.random() * 4 + 4}s`;
            balloon.style.animationDelay = `${Math.random() * 1.5}s`;
            container.appendChild(balloon);

            setTimeout(() => balloon.remove(), 8000);
        }
    }

    // --------------------------------------------------
    // STAGE 2: INTERACTIVE 5-TIER CAKE & CANDLE LOGIC
    // --------------------------------------------------
    function initCakeStage() {
        candlesHolder.innerHTML = '';
        blownCandleCount = 0;
        cakeActionBar.classList.add('hidden');
        cakeInstruction.textContent = 'Mumların üzerine tıklayarak üfle (veya dokun)!';

        // 5 Tiers seamlessly stacked:
        // Tier 5 (En üst) -> 3 candles
        // Tier 4, Tier 3, Tier 2, Tier 1 -> Pure cake layers
        const cakeElem = document.querySelector('.cake');
        cakeElem.innerHTML = `
            <div class="plate"></div>
            <div class="layer-wrapper" style="position:relative; z-index:5;">
                <div class="tier-candles" id="candles-tier-top"></div>
                <div class="layer layer-5"><div class="tier-drip"></div></div>
            </div>
            <div class="layer-wrapper" style="position:relative; z-index:4;">
                <div class="layer layer-4"><div class="tier-drip"></div></div>
            </div>
            <div class="layer-wrapper" style="position:relative; z-index:3;">
                <div class="layer layer-3"><div class="tier-drip"></div></div>
            </div>
            <div class="layer-wrapper" style="position:relative; z-index:2;">
                <div class="layer layer-2"><div class="tier-drip"></div></div>
            </div>
            <div class="layer-wrapper" style="position:relative; z-index:1;">
                <div class="layer layer-1"><div class="tier-drip"></div></div>
            </div>
        `;

        totalCandles = 3;
        const topHolder = document.getElementById('candles-tier-top');
        if (topHolder) {
            for (let i = 0; i < totalCandles; i++) {
                const candle = document.createElement('div');
                candle.className = 'candle';
                candle.dataset.index = i;

                const wick = document.createElement('div');
                wick.className = 'candle-wick';

                const flame = document.createElement('div');
                flame.className = 'flame';

                candle.appendChild(wick);
                candle.appendChild(flame);

                candle.addEventListener('click', () => blowCandle(candle));
                topHolder.appendChild(candle);
            }
        }
    }

    function blowCandle(candle) {
        if (candle.classList.contains('blown')) return;

        candle.classList.add('blown');
        blownCandleCount++;
        playSound('blow');

        // Add Smoke Animation
        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        candle.appendChild(smoke);
        setTimeout(() => smoke.remove(), 1200);

        // Check if all candles blown
        if (blownCandleCount >= totalCandles) {
            setTimeout(() => {
                cakeInstruction.textContent = BIRTHDAY_CONFIG.cake.blownMessage || "Harika üfledin! ✨";
                cakeActionBar.classList.remove('hidden');
                
                // Final candle effects: balloons rising from bottom + side confetti poppers
                createRisingBalloons();
                triggerSideConfetti();
                triggerConfetti();
                playSound('fanfare');
            }, 400);
        }
    }

    btnFinishCake.addEventListener('click', () => {
        goToStage(stageCard);
        initCardStage();
    });

    // --------------------------------------------------
    // STAGE 3: FRIEND PROFILE CARD LOGIC
    // --------------------------------------------------
    function initCardStage() {
        const friend = BIRTHDAY_CONFIG.friend;

        if (friend.avatarImageUrl) {
            friendAvatar.innerHTML = `<img src="${friend.avatarImageUrl}" alt="${friend.name}">`;
        } else {
            friendAvatar.textContent = friend.avatarEmoji || "🎂";
        }

        friendName.textContent = friend.name || "Ecem";
        
        const msgBox = document.getElementById('message-box');
        if (msgBox) {
            msgBox.classList.add('hidden');
        }

        // Traits Chips
        traitsList.innerHTML = '';
        if (friend.traits && Array.isArray(friend.traits)) {
            friend.traits.forEach(trait => {
                const chip = document.createElement('span');
                chip.className = 'chip';
                chip.textContent = trait;
                traitsList.appendChild(chip);
            });
        }
    }

    btnToCountdown.addEventListener('click', () => {
        goToStage(stageEnding);
        initEndingStage();
    });

    // --------------------------------------------------
    // STAGE 3.5: ENDING DIALOGUES LOGIC
    // --------------------------------------------------
    function updateEndingGuideDisplay(item) {
        if (!endingCharacterAvatar) return;
        
        if (typeof item === 'object' && item.html) {
            endingCharacterAvatar.innerHTML = item.html;
            if (window.Tenor && typeof window.Tenor.default === 'object' && typeof window.Tenor.default.clean === 'function') {
                window.Tenor.default.clean();
            } else {
                const oldScript = document.getElementById('tenor-script-ending');
                if (oldScript) oldScript.remove();
                const script = document.createElement('script');
                script.id = 'tenor-script-ending';
                script.src = 'https://tenor.com/embed.js';
                script.async = true;
                document.body.appendChild(script);
            }
        }
    }

    let endingAudio = null;

    function initEndingStage() {
        // Stop celebration audio if playing
        if (celebrationAudio) celebrationAudio.pause();

        // Play FIFTY FIFTY - Cupid on ending stage start
        if (soundEnabled) {
            if (!endingAudio) {
                endingAudio = new Audio('cupid.mp4');
            }
            endingAudio.volume = (volumeSlider ? volumeSlider.value / 100 : 0.10);
            endingAudio.currentTime = 0;
            endingAudio.play().catch(err => console.log('Ending audio play error:', err));
        }

        currentEndingDialogueIndex = 0;
        startEndingTypewriterDialogue();
    }

    function startEndingTypewriterDialogue() {
        const endingDialogues = BIRTHDAY_CONFIG.character.endingDialogues || [];
        if (endingTypewriterTimeout) clearTimeout(endingTypewriterTimeout);

        if (endingRpgArrow) endingRpgArrow.classList.remove('active');

        if (currentEndingDialogueIndex < endingDialogues.length) {
            const dialogueItem = endingDialogues[currentEndingDialogueIndex];
            const targetText = typeof dialogueItem === 'object' ? dialogueItem.text : dialogueItem;

            updateEndingGuideDisplay(dialogueItem);

            endingDialogueText.textContent = '';
            isEndingTyping = true;
            if (endingCharacterAvatar) endingCharacterAvatar.classList.add('talking');
            let charIndex = 0;

            function typeNextChar() {
                if (charIndex < targetText.length) {
                    endingDialogueText.textContent += targetText[charIndex];
                    if (targetText[charIndex] !== ' ') {
                        playSound('typewriter');
                    }
                    charIndex++;
                    endingTypewriterTimeout = setTimeout(typeNextChar, 40);
                } else {
                    isEndingTyping = false;
                    if (endingCharacterAvatar) endingCharacterAvatar.classList.remove('talking');
                    if (endingRpgArrow) endingRpgArrow.classList.add('active');

                    if (btnEndingNextLabel) {
                        if (currentEndingDialogueIndex === endingDialogues.length - 1) {
                            btnEndingNextLabel.textContent = "Geri Sayıma Geç ⏳";
                        } else {
                            btnEndingNextLabel.textContent = "Devam Et";
                        }
                    }
                }
            }

            typeNextChar();
        }
    }

    function advanceOrCompleteEndingDialogue() {
        const endingDialogues = BIRTHDAY_CONFIG.character.endingDialogues || [];

        if (isEndingTyping) {
            if (endingTypewriterTimeout) clearTimeout(endingTypewriterTimeout);
            const dialogueItem = endingDialogues[currentEndingDialogueIndex];
            const targetText = typeof dialogueItem === 'object' ? dialogueItem.text : dialogueItem;
            endingDialogueText.textContent = targetText;
            isEndingTyping = false;
            if (endingCharacterAvatar) endingCharacterAvatar.classList.remove('talking');
            if (endingRpgArrow) endingRpgArrow.classList.add('active');
            if (btnEndingNextLabel) {
                if (currentEndingDialogueIndex === endingDialogues.length - 1) {
                    btnEndingNextLabel.textContent = "Geri Sayıma Geç ⏳";
                } else {
                    btnEndingNextLabel.textContent = "Devam Et";
                }
            }
        } else {
            currentEndingDialogueIndex++;
            if (currentEndingDialogueIndex < endingDialogues.length) {
                playSound('click');
                startEndingTypewriterDialogue();
            } else {
                if (endingCharacterAvatar) endingCharacterAvatar.classList.remove('talking');
                goToStage(stageCountdown);
                initCountdownStage();
            }
        }
    }

    if (btnNextEndingDialogue) {
        btnNextEndingDialogue.addEventListener('click', advanceOrCompleteEndingDialogue);
    }
    if (endingRpgDialogueBox) {
        endingRpgDialogueBox.addEventListener('click', advanceOrCompleteEndingDialogue);
    }

    // --------------------------------------------------
    // STAGE 4: NEXT BIRTHDAY COUNTDOWN LOGIC
    // --------------------------------------------------
    function initCountdownStage() {
        triggerConfetti();
        playSound('fanfare');

        if (countdownInterval) clearInterval(countdownInterval);

        function updateTimer() {
            const now = new Date();
            const currentYear = now.getFullYear();
            const month = BIRTHDAY_CONFIG.friend.birthdayMonth - 1; // 0-indexed in JS
            const day = BIRTHDAY_CONFIG.friend.birthdayDay;

            let targetDate = new Date(currentYear, month, day, 0, 0, 0);

            // If birthday passed this year, calculate for next year
            if (now > targetDate) {
                targetDate = new Date(currentYear + 1, month, day, 0, 0, 0);
            }

            const diff = targetDate - now;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        }

        updateTimer();
        countdownInterval = setInterval(updateTimer, 1000);
    }

    // --------------------------------------------------
    // REKLAM VAKTI - SPOTIFY PLAYLIST PLAYER LOGIC
    // --------------------------------------------------
    const playlist = [
        { name: "FIFTY FIFTY - Cupid", file: "cupid.mp4" },
        { name: "Army Of Lovers - Crucified", file: "army_of_lovers.mp4" },
        { name: "Maroon 5 - Animals", file: "maroon5.mp4" },
        { name: "AURORA - Runaway", file: "aurora.mp4" },
        { name: "David Kushner - Daylight", file: "david_kushner.mp4" },
        { name: "Billie Eilish - lovely", file: "billie_eilish.mp4" }
    ];

    let currentTrackIndex = 0;
    let promoAudio = new Audio(playlist[0].file);
    promoAudio.volume = 0.10;

    const currentTrackNameElem = document.getElementById('current-track-name');
    const btnPlayPauseTrack = document.getElementById('btn-play-pause-track');
    const btnPrevTrack = document.getElementById('btn-prev-track');
    const btnNextTrack = document.getElementById('btn-next-track');
    const playerVolumeSlider = document.getElementById('player-volume-slider');
    const playerVolumeText = document.getElementById('player-volume-text');

    function updateTrackDisplay() {
        if (currentTrackNameElem) {
            currentTrackNameElem.textContent = playlist[currentTrackIndex].name;
        }
    }

    function loadAndPlayTrack(index) {
        currentTrackIndex = index;
        if (currentTrackIndex < 0) currentTrackIndex = playlist.length - 1;
        if (currentTrackIndex >= playlist.length) currentTrackIndex = 0;

        updateTrackDisplay();
        
        // Stop any background audio
        if (celebrationAudio) celebrationAudio.pause();
        if (endingAudio) endingAudio.pause();

        promoAudio.src = playlist[currentTrackIndex].file;
        promoAudio.currentTime = 0;
        promoAudio.volume = playerVolumeSlider ? playerVolumeSlider.value / 100 : 0.10;

        promoAudio.play().then(() => {
            if (btnPlayPauseTrack) btnPlayPauseTrack.textContent = "⏸️";
        }).catch(err => console.log("Promo track play error:", err));
    }

    if (btnPlayPauseTrack) {
        btnPlayPauseTrack.addEventListener('click', () => {
            if (promoAudio.paused) {
                if (celebrationAudio) celebrationAudio.pause();
                if (endingAudio) endingAudio.pause();
                promoAudio.play();
                btnPlayPauseTrack.textContent = "⏸️";
            } else {
                promoAudio.pause();
                btnPlayPauseTrack.textContent = "▶️";
            }
        });
    }

    if (btnPrevTrack) {
        btnPrevTrack.addEventListener('click', () => {
            loadAndPlayTrack(currentTrackIndex - 1);
        });
    }

    if (btnNextTrack) {
        btnNextTrack.addEventListener('click', () => {
            loadAndPlayTrack(currentTrackIndex + 1);
        });
    }

    if (playerVolumeSlider) {
        playerVolumeSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            promoAudio.volume = val / 100;
            if (playerVolumeText) playerVolumeText.textContent = `${val}%`;
        });
    }

    btnConfetti.addEventListener('click', () => {
        playSound('fanfare');
        triggerConfetti();
    });

    btnReplay.addEventListener('click', () => {
        if (countdownInterval) clearInterval(countdownInterval);
        if (promoAudio) promoAudio.pause();
        if (btnPlayPauseTrack) btnPlayPauseTrack.textContent = "▶️";
        goToStage(stageIntro);
        initIntroStage();
    });

    // --------------------------------------------------
    // PURE JS CONFETTI ENGINE (NO EXTERNAL LIBRARIES)
    // --------------------------------------------------
    const confettiCanvas = document.getElementById('confetti-canvas');
    const ctx = confettiCanvas.getContext('2d');
    let confettiParticles = [];
    let animationFrameId = null;

    function resizeCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function triggerConfetti() {
        confettiParticles = [];
        const colors = ['#ff4081', '#8a2be2', '#ffd700', '#00e5ff', '#ffffff', '#ff9800'];
        const count = 120;

        for (let i = 0; i < count; i++) {
            confettiParticles.push({
                x: confettiCanvas.width / 2 + (Math.random() * 200 - 100),
                y: confettiCanvas.height / 2 + (Math.random() * 100 - 50),
                r: Math.random() * 6 + 4,
                dx: (Math.random() - 0.5) * 12,
                dy: (Math.random() - 0.8) * 14,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.random() * 10,
                tiltAngleIncremental: Math.random() * 0.08 + 0.04,
                opacity: 1
            });
        }

        if (!animationFrameId) {
            renderConfetti();
        }
    }

    function triggerSideConfetti() {
        const colors = ['#ff4081', '#8a2be2', '#ffd700', '#00e5ff', '#ffffff', '#ff9800', '#00ff66'];
        const countPerSide = 70;

        // Left side cannons (popping rightwards)
        for (let i = 0; i < countPerSide; i++) {
            confettiParticles.push({
                x: Math.random() * 30,
                y: confettiCanvas.height * 0.4 + (Math.random() * 250 - 125),
                r: Math.random() * 7 + 4,
                dx: Math.random() * 14 + 6, // Blast right
                dy: (Math.random() - 0.8) * 15,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.random() * 10,
                tiltAngleIncremental: Math.random() * 0.08 + 0.04,
                opacity: 1
            });
        }

        // Right side cannons (popping leftwards)
        for (let i = 0; i < countPerSide; i++) {
            confettiParticles.push({
                x: confettiCanvas.width - Math.random() * 30,
                y: confettiCanvas.height * 0.4 + (Math.random() * 250 - 125),
                r: Math.random() * 7 + 4,
                dx: -(Math.random() * 14 + 6), // Blast left
                dy: (Math.random() - 0.8) * 15,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.random() * 10,
                tiltAngleIncremental: Math.random() * 0.08 + 0.04,
                opacity: 1
            });
        }

        if (!animationFrameId) {
            renderConfetti();
        }
    }

    function renderConfetti() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        confettiParticles.forEach((p, index) => {
            p.tiltAngleIncremental += 0.05;
            p.x += p.dx;
            p.y += p.dy;
            p.dy += 0.25; // gravity
            p.tilt = Math.sin(p.tiltAngleIncremental) * 15;
            p.opacity -= 0.008;

            if (p.opacity <= 0) {
                confettiParticles.splice(index, 1);
                return;
            }

            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        });

        if (confettiParticles.length > 0) {
            animationFrameId = requestAnimationFrame(renderConfetti);
        } else {
            animationFrameId = null;
        }
    }

    // --------------------------------------------------
    // App Launch
    // --------------------------------------------------
    initIntroStage();
});
