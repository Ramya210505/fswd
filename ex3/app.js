let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let posts = JSON.parse(localStorage.getItem('posts')) || [];

// Register or login a user
function registerOrLogin() {
    const username = document.getElementById('username').value.trim();
    if (!username) {
        alert("Please enter a username.");
        return;
    }

    let user = users.find(user => user.username === username);
    if (!user) {
        user = { username, following: [], followers: [] };
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    }

    currentUser = user;
    localStorage.setItem('currentUser', currentUser.username); // Store current user
    document.getElementById('current-user').textContent = currentUser.username;
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('user-section').style.display = 'block';

    loadUserList();
    loadFeed();
}

// Log out the current user
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser'); // Remove current user from localStorage
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('user-section').style.display = 'none';
}

// Create a new post
function createPost() {
    const content = document.getElementById('post-content').value.trim();
    const imageInput = document.getElementById('post-image');
    const imageFile = imageInput.files[0];
    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : '';

    if (!content && !imageUrl) {
        alert("Post content or image cannot be empty.");
        return;
    }

    const post = {
        content,
        author: currentUser.username,
        likes: 0,
        dislikes: 0,
        comments: [],
        timestamp: new Date().toLocaleString(),
        image: imageUrl // Save image URL
    };
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));
    document.getElementById('post-content').value = ''; // Clear input after posting
    imageInput.value = ''; // Clear image input
    loadFeed();
}

// Load the feed of posts from followed users
function loadFeed() {
    const feed = document.getElementById('feed');
    feed.innerHTML = '';

    let followedPosts = posts.filter(post => currentUser.following.includes(post.author) || post.author === currentUser.username);

    followedPosts.forEach((post) => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post', 'feed-item');

        postDiv.innerHTML = `
            <div class="feed-content">
                <strong>${post.author}</strong><br>
                <span class="timestamp">${post.timestamp}</span><br>
                <span>${post.content}</span><br>
            </div>
            <span>Likes: <span class="red-heart">${post.likes} ❤️</span></span><br>
            <span>Dislikes: <span class="brown-thumb">${post.dislikes} 👎</span></span><br>
            <span>Comments: ${post.comments.length}</span><br>
        `;

        if (post.image) {
            const img = document.createElement('img');
            img.src = post.image;
            img.style.width = '100%';
            img.style.borderRadius = '5px';
            postDiv.appendChild(img);
        }

        // Click to like
        const likeSpan = postDiv.querySelector('.red-heart');
        likeSpan.onclick = function () {
            post.likes++;
            localStorage.setItem('posts', JSON.stringify(posts));
            loadFeed();
        };

        // Click to dislike
        const dislikeSpan = postDiv.querySelector('.brown-thumb');
        dislikeSpan.onclick = function () {
            post.dislikes++;
            localStorage.setItem('posts', JSON.stringify(posts));
            loadFeed();
        };

        // Comment section
        const commentBtn = document.createElement('button');
        commentBtn.innerHTML = `<i class="fa fa-comments"></i> Comment`;
        commentBtn.classList.add('comment-btn');
        commentBtn.onclick = function () {
            const commentText = prompt("Add your comment:");
            if (commentText) {
                const comment = {
                    author: currentUser.username,
                    comment: commentText,
                    likes: 0,
                    dislikes: 0,
                    timestamp: new Date().toLocaleString(),
                };
                post.comments.push(comment);
                localStorage.setItem('posts', JSON.stringify(posts));
                loadFeed();
            }
        };

        postDiv.appendChild(commentBtn);

        // Display comments
        post.comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');
            commentDiv.innerHTML = `
                <strong>${comment.author}</strong>: ${comment.comment} 
                <span class="timestamp">${comment.timestamp}</span><br>
                Likes: <span class="red-heart">${comment.likes} ❤️</span><br>
                Dislikes: <span class="brown-thumb">${comment.dislikes} 👎</span>
                <button class="reaction-btn">React 😊</button>
                <div class="reactions" style="display:none;"></div>
            `;

            // Click to like comment
            const likeCommentSpan = commentDiv.querySelector('.red-heart');
            likeCommentSpan.onclick = function () {
                comment.likes++;
                localStorage.setItem('posts', JSON.stringify(posts));
                loadFeed();
            };

            // Click to dislike comment
            const dislikeCommentSpan = commentDiv.querySelector('.brown-thumb');
            dislikeCommentSpan.onclick = function () {
                comment.dislikes++;
                localStorage.setItem('posts', JSON.stringify(posts));
                loadFeed();
            };

            // Reaction button logic
            const reactionBtn = commentDiv.querySelector('.reaction-btn');
            const reactionsDiv = commentDiv.querySelector('.reactions');

            reactionBtn.onclick = function () {
                reactionsDiv.style.display = reactionsDiv.style.display === 'none' ? 'block' : 'none';
            };

            const emojiList = ['😊', '😂', '😢', '❤️', '😮'];
            emojiList.forEach(emoji => {
                const emojiButton = document.createElement('span');
                emojiButton.textContent = emoji;
                emojiButton.style.cursor = 'pointer';
                emojiButton.style.margin = '0 5px';
                emojiButton.onclick = function () {
                    const reaction = {
                        emoji: emoji,
                        author: currentUser.username,
                        timestamp: new Date().toLocaleString(),
                    };
                    comment.reactions = comment.reactions || [];
                    comment.reactions.push(reaction);
                    localStorage.setItem('posts', JSON.stringify(posts));
                    loadFeed();
                };
                reactionsDiv.appendChild(emojiButton);
            });

            // Display existing reactions
            if (comment.reactions) {
                comment.reactions.forEach(reaction => {
                    const reactionDiv = document.createElement('div');
                    reactionDiv.innerHTML = `<strong>${reaction.author}</strong> reacted with ${reaction.emoji} <span class="timestamp">${reaction.timestamp}</span>`;
                    reactionsDiv.appendChild(reactionDiv);
                });
            }

            postDiv.appendChild(commentDiv);
        });

        feed.appendChild(postDiv);
    });
}

// Load users for following/unfollowing
function loadUserList() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    users.forEach(user => {
        if (user.username !== currentUser.username) {
            const userDiv = document.createElement('div');
            const isFollowing = currentUser.following.includes(user.username);
            userDiv.innerHTML = `<strong>${user.username}</strong>`;

            const followBtn = document.createElement('button');
            followBtn.innerHTML = isFollowing ? `<i class="fa fa-user-times"></i> Unfollow` : `<i class="fa fa-user-plus"></i> Follow`;
            followBtn.classList.add('follow-btn');
            followBtn.onclick = function () {
                if (isFollowing) {
                    currentUser.following = currentUser.following.filter(f => f !== user.username);
                    user.followers = user.followers.filter(f => f !== currentUser.username);
                } else {
                    currentUser.following.push(user.username);
                    user.followers.push(currentUser.username);
                }
                localStorage.setItem('users', JSON.stringify(users));
                loadUserList();
                loadFeed();
            };

            userDiv.appendChild(followBtn);
            userList.appendChild(userDiv);
        }
    });
}

// Load existing data on page load
window.onload = function() {
    if (users.length > 0) {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = users.find(user => user.username === savedUser);
            document.getElementById('current-user').textContent = currentUser.username;
            document.getElementById('auth-section').style.display = 'none';
            document.getElementById('user-section').style.display = 'block';
            loadUserList();
            loadFeed();
        } else {
            document.getElementById('auth-section').style.display = 'block';
            document.getElementById('user-section').style.display = 'none';
        }
    }
};
