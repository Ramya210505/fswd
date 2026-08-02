const postInput = document.getElementById('postInput');
const submitPost = document.getElementById('submitPost');
const charCount = document.getElementById('charCount');
const feedStream = document.getElementById('feedStream');
const liveIndicator = document.getElementById('liveIndicator');
const typingIndicator = document.getElementById('typingIndicator');
const MAX_CHARS = 280;
// Input handling
postInput.addEventListener('input', function() {
    const length = this.value.length;
    charCount.textContent = `${length}/${MAX_CHARS}`;
    
    // Auto-resize textarea
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    
    if (length > 0 && length <= MAX_CHARS) {
        submitPost.disabled = false;
        charCount.className = 'char-count';
    } else if (length > MAX_CHARS) {
        submitPost.disabled = true;
        charCount.className = 'char-count danger';
    } else {
        submitPost.disabled = true;
        charCount.className = 'char-count';
    }
    
    if (length >= MAX_CHARS - 20 && length <= MAX_CHARS) {
        charCount.className = 'char-count warning';
    }
});
// Post creation
submitPost.addEventListener('click', () => {
    const text = postInput.value.trim();
    if (!text) return;
    
    const newPost = createPostHTML({
        name: 'Ramya S',
        handle: '@ramya_s',
        time: 'Just now',
        text: escapeHTML(text),
        likes: 0,
        reposts: 0,
        replies: 0,
        avatar: 'https://ui-avatars.com/api/?name=Ramya+S&background=6366f1&color=fff'
    });
    
    feedStream.insertAdjacentHTML('afterbegin', newPost);
    
    // Reset
    postInput.value = '';
    postInput.dispatchEvent(new Event('input'));
});
// Interactions (Event Delegation)
feedStream.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.interaction.like');
    if (likeBtn) {
        likeBtn.classList.toggle('liked');
        const icon = likeBtn.querySelector('.int-icon i');
        const countSpan = likeBtn.querySelector('span');
        let count = parseInt(countSpan.textContent.replace(/,/g, ''));
        
        if (likeBtn.classList.contains('liked')) {
            icon.classList.remove('far');
            icon.classList.add('fas', 'heart-burst');
            count++;
        } else {
            icon.classList.remove('fas', 'heart-burst');
            icon.classList.add('far');
            count--;
        }
        countSpan.textContent = count;
        
        // Remove animation class after it plays so it can play again
        setTimeout(() => icon.classList.remove('heart-burst'), 300);
    }
});
// Simulated Real-Time Behavior
const simulatedPosts = [
    { name: 'Tech Bot', handle: '@tech_bot', time: '1m', text: 'Just discovered an amazing new CSS trick for glassmorphism! 🎨✨', likes: 120, reposts: 15, replies: 5, avatar: 'https://ui-avatars.com/api/?name=Tech+Bot&background=10b981&color=fff' },
    { name: 'Design Daily', handle: '@design_d', time: '2m', text: 'UI design is 90% spacing and typography. The rest is just decoration. Agree? 🤔', likes: 450, reposts: 89, replies: 120, avatar: 'https://ui-avatars.com/api/?name=Design&background=f59e0b&color=fff' }
];
// Initial load
feedStream.insertAdjacentHTML('afterbegin', createPostHTML(simulatedPosts[1]));
// Simulate new incoming post
setTimeout(() => {
    typingIndicator.style.display = 'flex';
    
    setTimeout(() => {
        typingIndicator.style.display = 'none';
        liveIndicator.innerHTML = '<span>Show 1 new post</span>';
        liveIndicator.style.cursor = 'pointer';
        liveIndicator.style.color = 'var(--primary)';
        
        liveIndicator.addEventListener('click', function showNew() {
            feedStream.insertAdjacentHTML('afterbegin', createPostHTML(simulatedPosts[0]));
            liveIndicator.innerHTML = '<div class="spinner-small"></div><span>Checking for new posts...</span>';
            liveIndicator.style.cursor = 'default';
            liveIndicator.style.color = 'var(--text-muted)';
            liveIndicator.removeEventListener('click', showNew);
        });
    }, 3000);
}, 5000);
// Helpers
function createPostHTML(data) {
    return `
        <div class="post">
            <img src="${data.avatar}" class="avatar" alt="Avatar">
            <div class="post-content">
                <div class="post-meta">
                    <span class="post-author">${data.name}</span>
                    <span class="post-handle">${data.handle}</span>
                    <span class="post-time">· ${data.time}</span>
                </div>
                <div class="post-text">${data.text}</div>
                <div class="post-interactions">
                    <div class="interaction reply">
                        <div class="int-icon"><i class="far fa-comment"></i></div>
                        <span>${data.replies}</span>
                    </div>
                    <div class="interaction repost">
                        <div class="int-icon"><i class="fas fa-retweet"></i></div>
                        <span>${data.reposts}</span>
                    </div>
                    <div class="interaction like">
                        <div class="int-icon"><i class="far fa-heart"></i></div>
                        <span>${data.likes}</span>
                    </div>
                    <div class="interaction">
                        <div class="int-icon"><i class="far fa-share-square"></i></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
