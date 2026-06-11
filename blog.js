document.addEventListener('DOMContentLoaded', () => {
    const blogGrid = document.getElementById('blog-grid');
    
    // Ensure blogData is loaded before running
    if (blogGrid && typeof blogData !== 'undefined') {
        blogData.forEach(post => {
            const card = `
                <article class="blog-card">
                    <div class="blog-img-wrapper">
                        <img src="${post.coverImage}" alt="${post.title}" class="blog-card-img" loading="lazy">
                    </div>
                    <div class="blog-card-content">
                        <div class="blog-card-meta">
                            <span class="blog-card-category">${post.category}</span>
                        </div>
                        <h2 class="blog-card-title">${post.title}</h2>
                        <p class="blog-card-excerpt">${post.excerpt}</p>
                        <a href="blog-post.html?post=${post.id}" class="blog-card-link">
                            Read Article <span class="arrow">➔</span>
                        </a>
                    </div>
                </article>
            `;
            blogGrid.insertAdjacentHTML('beforeend', card);
        });
    } else {
        console.error("blog-grid element or blogData not found.");
    }
});
