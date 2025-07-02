
document.addEventListener("DOMContentLoaded", () => {
  /* ------------------------------------------------------------------ */
  /*  Grab blog index from query string                                 */
  /* ------------------------------------------------------------------ */
  const params = new URLSearchParams(location.search);
  const blogIndex = params.get("id");      // e.g. 0, 1, 2 …

  /* ------------------------------------------------------------------ */
  /*  DOM handles (set once)                                            */
  /* ------------------------------------------------------------------ */
  const titleEl = document.getElementById("title");
  const authorEl = document.getElementById("author");
  const imageEl = document.getElementById("image");
  const bodyEl = document.getElementById("bcontent");
  const commentUL = document.querySelector(".comment-list");   // <–– ID not needed
  const commentBox = document.querySelector(".comment-box");
  const txtArea = commentBox.querySelector("textarea");
  const postBtn = commentBox.querySelector(".post-comment");

  /* ------------------------------------------------------------------ */
  /*  1.  Pull the blog content                                         */





  fetch("data.json")
    .then(r => r.json())
    .then(blogs => {
      const blog = blogs[blogIndex];
      if (!blog) {
        document.body.innerHTML = "<h2>Blog not found</h2>";
        return;
      }

      titleEl.textContent = blog.title;
      authorEl.textContent = "Written by " + blog.author;
      imageEl.src = blog.image;
      imageEl.alt = blog.title;
      bodyEl.innerHTML = blog.fullread;
      bodyEl.style = "text-align:justify; @media (max-width: 400px) {font-size:2rem;}"
      imageEl.style.cssText = `
        width:100%;max-width:600px;height:auto;
        border-radius:10px;margin:20px auto;display:block;
      `;

      /* initial comment pull */
      loadComments(blog.id ?? blogIndex);
    });

  /* ------------------------------------------------------------------ */
  /*  2.  Button behaviour (like / share / toggle comment box)          */
  /* ------------------------------------------------------------------ */
  document.addEventListener("click", (e) => {

    /* like ----------------------------------------------------------- */
    if (e.target.closest(".like-btn")) {
      const btn = e.target.closest(".like-btn");
      const icon = btn.querySelector("ion-icon");
      const span = btn.querySelector("span");
      const liked = icon.name === "heart";

      icon.name = liked ? "heart-outline" : "heart";
      icon.style.color = liked ? "" : "red";
      span.textContent = liked ? " Like" : " Liked";
    }

    /* share ---------------------------------------------------------- */
    if (e.target.closest(".share-btn")) {
      const url = `${location.origin}/blog-detail.html?id=${blogIndex}`;
      navigator.clipboard.writeText(url).then(() =>
        alert("Copied link: " + url)
      );
    }

    /* show / hide comment box --------------------------------------- */
    if (e.target.closest(".comment-btn")) {
      commentBox.classList.toggle("hidden");
      if (!commentBox.classList.contains("hidden")) {
        txtArea.focus();
      }
    }
  });

  /* ------------------------------------------------------------------ */
  /*  3.  Posting a comment                                            */
  /* ------------------------------------------------------------------ */
  postBtn.addEventListener("click", () => {
    const commentText = txtArea.value.trim();
    if (!commentText) return;

    /* example POST – adjust endpoint if different */
    fetch(`https://backendweather-g9j8.onrender.com/api/comments/post?id=${blogIndex}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: blogIndex, content: commentText })
    })
      .then(r => r.json())      // optional: handle response
      .then(() => {
        txtArea.value = "";
        loadComments(blogIndex);   // refresh list
      })
      .catch(err => console.error("Post failed:", err));
  });

  /* ------------------------------------------------------------------ */
  /*  4.  Fetch & render comments                                      */
  /* ------------------------------------------------------------------ */
  function loadComments(id) {
    fetch(`https://backendweather-g9j8.onrender.com/api/comments/all?id=${blogIndex}`)
      .then(r => r.json())
      .then(arr => {
        commentUL.innerHTML = "";               // clear old
        if (!arr.length) {
          commentUL.innerHTML =
            "<div class='comment empty'>No comments yet.</div>";
          return;
        }
        arr.forEach(c => {
          const div = document.createElement("div");
          div.className = "comment";
          div.innerHTML = `
  <div class="comment-meta">
    <span class="comment-time">${new Date(c.createdAt).toLocaleString()}</span>
  </div>
  <div class="comment-content">
    ${c.content}
  </div>
`;

          commentUL.appendChild(div);
        });
      })
      .catch(err => console.error("Fetch comments failed:", err));
  }
});








