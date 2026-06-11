document.addEventListener('DOMContentLoaded', () => {
    // 1. Get query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post');

    // If no post parameter, redirect to blog page
    if (!postId) {
        window.location.href = 'blog.html';
        return;
    }

    // 2. Find matching post in blogData
    // (Ensure blog-data.js is loaded before this script)
    if (typeof blogData === 'undefined') {
        console.error("blogData is not defined. Make sure blog-data.js is loaded.");
        return;
    }

    const post = blogData.find(p => p.id === postId);

    // If post not found, redirect to blog page
    if (!post) {
        window.location.href = 'blog.html';
        return;
    }

    // 3. Populate DOM elements
    const postCategory = document.getElementById('post-category');
    const postTitle = document.getElementById('post-title');
    const postHero = document.getElementById('post-hero');
    const postBody = document.getElementById('post-body');

    if (postCategory) postCategory.textContent = post.category;
    if (postTitle) postTitle.textContent = post.title;
    if (postHero) {
        postHero.src = post.coverImage;
        postHero.alt = post.title;
    }
    if (postBody) postBody.innerHTML = post.content;

    // 4. Update SEO meta tags dynamically
    document.title = `${post.title} | 292 STUDIOS Blog`;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', post.excerpt);
    }
});
