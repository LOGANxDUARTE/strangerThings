const BASE_URL = "https://strangers-things.herokuapp.com/api/2102-CPU-RM-WEB-PT"

function fetchPosts() {
    return fetch(`${ BASE_URL }/posts`)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            // return data
            console.log(data)
            return data.data.posts
        })
        .catch(function(error) {
            console.log(error)
        })
}
function renderPosts(posts) {
    // console.log(posts) // Posts that have been saved to the database
    posts.forEach(function(post) {
        console.log(post)
        const postElement = createPostHTML(post)
        $('#posts').append(postElement)
    })
}
function createPostHTML(post) {
    return `

    <div class="accordion-item">
    <h2 class="accordion-header" id="headingTwo">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        ${post.title}
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        ${post.description}
      </div>
    </div>
  </div>
  `
}
fetchPosts()
    .then(function(posts) {
        renderPosts(posts) //Renders the posts to the page
    })

