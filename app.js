// Main application JavaScript for the train commute productivity app

class CommuteProdApp {
    constructor() {
        this.currentFatigueLevel = null;
        this.habitProgress = 0;
        this.totalHabits = 5;
        
        this.init();
    }

    init() {
        this.setupFatigueChecker();
        this.setupTabNavigation();
        this.setupHabitTracker();
        this.setupFAQ();
        this.setupScrollEffects();
    }

    // Fatigue checker functionality
    setupFatigueChecker() {
        const fatigueButtons = document.querySelectorAll('.fatigue-btn');
        const fatigueResult = document.getElementById('fatigue-result');

        fatigueButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                fatigueButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Get fatigue level
                const level = button.dataset.level;
                this.currentFatigueLevel = level;
                
                // Show result
                this.showFatigueResult(level, fatigueResult);
                
                // Highlight corresponding fatigue level card
                this.highlightFatigueCard(level);
            });
        });
    }

    showFatigueResult(level, resultElement) {
        const results = {
            very_tired: {
                title: '🥱 超疲れている状態ですね',
                message: '無理は禁物です。まずはリラックスすることから始めましょう。深呼吸や軽いストレッチがおすすめです。',
                suggestions: ['好きな音楽を聴く', '軽いストレッチ', '景色を眺める', '瞑想・深呼吸']
            },
            tired: {
                title: '😮‍💨 普通に疲れている状態ですね',
                message: '軽めの活動から始めてみましょう。音声コンテンツなど、目を酷使しない方法がおすすめです。',
                suggestions: ['ポッドキャストを聴く', 'AIとの軽い対話', '簡単な読書', '一日の振り返り']
            },
            energetic: {
                title: '😊 まあまあ元気な状態ですね！',
                message: 'しっかりと学習に取り組める状態です。この機会を活かして有意義な時間にしましょう。',
                suggestions: ['動画学習', '資格勉強', 'AI活用で深い学習', '明日の計画立案']
            }
        };

        const result = results[level];
        
        resultElement.className = `fatigue-result fade-in ${level}`;
        resultElement.innerHTML = `
            <h3>${result.title}</h3>
            <p>${result.message}</p>
            <h4>おすすめの活動：</h4>
            <ul class="activity-list">
                ${result.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
            </ul>
        `;
        
        resultElement.classList.remove('hidden');
        
        // Smooth scroll to result
        setTimeout(() => {
            resultElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
    }

    highlightFatigueCard(level) {
        // Remove highlight from all cards
        document.querySelectorAll('.fatigue-level-card').forEach(card => {
            card.style.transform = '';
            card.style.boxShadow = '';
            card.style.borderWidth = '1px';
        });

        // Highlight the corresponding card
        const targetCard = document.querySelector(`.fatigue-level-card[data-level="${level}"]`);
        if (targetCard) {
            targetCard.style.transform = 'translateY(-4px) scale(1.02)';
            targetCard.style.boxShadow = 'var(--shadow-lg)';
            targetCard.style.borderWidth = '2px';
            
            // Scroll to solutions section
            setTimeout(() => {
                document.querySelector('.solutions').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 500);
        }
    }

    // Tab navigation functionality
    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Add active class to clicked button
                button.classList.add('active');

                // Show corresponding content
                const tabId = button.dataset.tab + '-tab';
                const targetContent = document.getElementById(tabId);
                if (targetContent) {
                    targetContent.classList.add('active');
                    targetContent.classList.add('fade-in');
                }
            });
        });
    }

    // Habit tracker functionality
    setupHabitTracker() {
        const checkboxes = document.querySelectorAll('.habit-checkbox');
        const progressText = document.getElementById('progress-text');
        const progressFill = document.getElementById('progress-fill');

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateHabitProgress(checkboxes, progressText, progressFill);
            });
        });

        // Initialize progress
        this.updateHabitProgress(checkboxes, progressText, progressFill);
    }

    updateHabitProgress(checkboxes, progressText, progressFill) {
        const completedHabits = Array.from(checkboxes).filter(cb => cb.checked).length;
        const percentage = (completedHabits / this.totalHabits) * 100;

        progressText.textContent = `${completedHabits}/${this.totalHabits}`;
        progressFill.style.width = `${percentage}%`;

        // Add celebration effect for full completion
        if (completedHabits === this.totalHabits) {
            this.showCelebration();
        }
    }

    showCelebration() {
        const progressContainer = document.querySelector('.habit-progress');
        const celebrationMessage = document.createElement('div');
        celebrationMessage.className = 'celebration-message';
        celebrationMessage.innerHTML = '🎉 素晴らしい！今日は完璧です！';
        celebrationMessage.style.cssText = `
            text-align: center;
            color: var(--color-success);
            font-weight: var(--font-weight-semibold);
            margin-top: var(--space-8);
            animation: fadeIn 0.5s ease-in;
        `;

        // Remove existing celebration message
        const existing = progressContainer.querySelector('.celebration-message');
        if (existing) {
            existing.remove();
        }

        progressContainer.appendChild(celebrationMessage);

        // Remove message after 3 seconds
        setTimeout(() => {
            if (celebrationMessage.parentNode) {
                celebrationMessage.remove();
            }
        }, 3000);
    }

    // FAQ accordion functionality
    setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('active');
                });

                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // Scroll effects and smooth scrolling
    setupScrollEffects() {
        // Add smooth scrolling to internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add intersection observer for fade-in animations
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe cards and sections
        document.querySelectorAll('.card, .method-card, .resource-category, .time-block').forEach(el => {
            observer.observe(el);
        });
    }

    // Utility method to get recommendation based on current state
    getRecommendation() {
        if (!this.currentFatigueLevel) {
            return {
                title: 'まずは疲労度をチェックしてください',
                message: '上の疲労度チェッカーで今の状態を確認してから、最適な活動を選びましょう。'
            };
        }

        const recommendations = {
            very_tired: {
                title: '今日はゆっくり休みましょう',
                message: '疲れている時は無理をせず、リラックスできる活動を選んでください。'
            },
            tired: {
                title: '軽めの活動がおすすめです',
                message: '音声コンテンツや軽い読書など、目に負担をかけない活動を試してみましょう。'
            },
            energetic: {
                title: '学習のチャンスです！',
                message: '元気な今のうちに、集中を要する学習活動に取り組みましょう。'
            }
        };

        return recommendations[this.currentFatigueLevel];
    }

    // Method to reset the app state (useful for development/testing)
    reset() {
        this.currentFatigueLevel = null;
        this.habitProgress = 0;
        
        // Reset UI elements
        document.querySelectorAll('.fatigue-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('#fatigue-result').classList.add('hidden');
        document.querySelectorAll('.habit-checkbox').forEach(cb => cb.checked = false);
        document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
        
        this.updateHabitProgress(
            document.querySelectorAll('.habit-checkbox'),
            document.getElementById('progress-text'),
            document.getElementById('progress-fill')
        );
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.commuteApp = new CommuteProdApp();
    
    // Add some helpful console messages for development
    console.log('🚆 通勤時間活用アプリが正常に読み込まれました！');
    console.log('💡 window.commuteApp でアプリインスタンスにアクセスできます');
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Enable keyboard navigation for tab switching
    if (e.target.classList.contains('tab-btn')) {
        const tabs = Array.from(document.querySelectorAll('.tab-btn'));
        const currentIndex = tabs.indexOf(e.target);
        
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            e.preventDefault();
            tabs[currentIndex - 1].focus();
        } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
            e.preventDefault();
            tabs[currentIndex + 1].focus();
        }
    }
    
    // Enable keyboard navigation for fatigue buttons
    if (e.target.classList.contains('fatigue-btn')) {
        const buttons = Array.from(document.querySelectorAll('.fatigue-btn'));
        const currentIndex = buttons.indexOf(e.target);
        
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            e.preventDefault();
            buttons[currentIndex - 1].focus();
        } else if (e.key === 'ArrowRight' && currentIndex < buttons.length - 1) {
            e.preventDefault();
            buttons[currentIndex + 1].focus();
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.target.click();
        }
    }
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
    // Debounced resize handler
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
        // Any resize-specific logic can go here
        console.log('画面サイズが変更されました');
    }, 250);
});

// Add error handling for any uncaught errors
window.addEventListener('error', (e) => {
    console.error('アプリケーションエラー:', e.error);
    // In a production app, you might want to send this to a logging service
});

// Export for potential testing or external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommuteProdApp;
}