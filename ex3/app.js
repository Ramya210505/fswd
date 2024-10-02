document.getElementById('postButton').addEventListener('click', function() {
    const postInput = document.getElementById('postInput');
    const postContent = postInput.value.trim();

    if (postContent) {
        // Create a new post element
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.textContent = postContent;

        // Append the new post to the posts container
        document.getElementById('postsContainer').appendChild(postDiv);

        // Clear the input field
        postInput.value = '';
    } else {
        alert('Please write something before posting.');
    }
});
