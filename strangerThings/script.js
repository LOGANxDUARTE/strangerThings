const BASE_URL =
  "https://strangers-things.herokuapp.com/api/2102-CPU-RM-WEB-PT";

// FUNCTION TO GRAB TOKEN FROM LOCAL STORAGE
const fetchToken = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  return token
}

// FUNCTION THAT FETCH ALL POSTS AVAILABLE
function fetchPosts() {
  return fetch(`${BASE_URL}/posts`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // return data
      console.log(data);
      return data.data.posts;
    })
    .catch(function (error) {
      console.log(error);
    });
}

// FUNCTION THAT RENDERS POSTINGS
function renderPosts(posts, me) {
  $("#posts").empty()
  posts.forEach(function (post) {
    const postElement = createPostHTML(post, me);
    $('#posts').append(postElement);
  });
}

// CREATE THE HTML FOR POST
function createPostHTML(post, me) {
  return `<div class="container">
    <div class="card border-dark mb-3" style="max-width: 18rem;">
    <div class="card-header"><strong>${post.title}</strong></div>
  <div class="card-body">
    <p class="card-text">${post.description}</p>
    <p class="card-text">${post.price}</p>
    <p class="card-text"><strong>Will I deliver?</strong> ${post.willDeliver}</p>
    <a href="#" class="btn btn-dark">More info</a>
    ${ me._id === post.author._id ?
      `<svg class="svg-icon" viewBox="0 0 20 20">
          <path d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"></path>
      </svg>`: ''}
  </div>
</div>
</div>
  `;
}

// FUNCTION THAT RENDERS POSTING TEMPLATE
function renderPostTemplate() {
  const newPostListing = createPostTemplate();
  $("#postTemplate").append(newPostListing)
}

// CREATE THE HTML FOR POSTING TEMPLATE
function createPostTemplate() {
  return `<div id="postForm" class="submit">
  <h3>Sell something!</h3>
  <form id="blog-post">
    <div class="form-group">
      <label class="mb-2" for="blog-title">Title</label>
      <input class="form-control" id="blog-title" type="text" placeholder="What are you selling?" required />
    </div>

    <div class="form-group">
      <label for="blog-description" class="mb-2">Item Description</label>
      <textarea class="form-control" name="blog-description" id="blog-description" cols="30" rows="10"
        placeholder="Tell us about it..." required></textarea>
    </div>

    <div class="form-group">
      <label for="blog-price" class="mb-2">Price</label>
      <input type="text" class="form-control" id="blog-price" placeholder="How much do you want for it?" required />
    </div>

    <button id="newPostButton" type="button" class="btn btn-primary mt-3">Submit</button>
  </form>
</div>`
}

// CLICK HANDLER FOR DISPLAYING POST TEMPLATE
$("#sellItem").on("click", (event) => {
  console.log(event)
  event.preventDefault();

  renderPostTemplate();

  // ON SUBMIT TO POST NEW POSTING TO PAGE
  $("#newPostButton").on("click", async (e) => {
    console.log('New post submit', e)
    e.preventDefault();

    const blogTitle = $("#blog-title").val();
    const blogDescription = $("#blog-description").val();
    const blogPrice = $("#blog-price").val();

    const requestBody = {
      post: {
        title: blogTitle,
        description: blogDescription,
        price: blogPrice,
      },
    };

    await postBlogEntry(requestBody);
    $("#postForm").empty();
    refreshPosts();
  });

});

// FUNCTION TO REGISTER NEW USERS
const registerUser = async (usernameValue, passwordValue) => {
  const url = `${BASE_URL}/users/register`;
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        user: {
          username: usernameValue,
          password: passwordValue,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const {
      data: { token },
    } = await response.json();
    localStorage.setItem("token", JSON.stringify(token));
    hideRegistrationModal();
  } catch (error) {
    console.error(error);
  }
};

// ON SUBMIT TO REGISTER USER
$(".modal-body form").on("submit", (event) => {
  event.preventDefault();
  const username = $("#registerInputUsername").val();
  const password = $("#registerInputPassword").val();

  registerUser(username, password);
});

// HIDE REGISTRATION MODAL
const hideRegistrationModal = () => {
  const token = localStorage.getItem("token");
  if (token) {
    $("#registerModal").modal("hide");
  } else {
    console.log("nothing to hide");
  }
};

// FUNCTION TO LOGIN ALREADY REGISTERED USER
const loginUser = async (usernameValue, passwordValue) => {
  const url = `${BASE_URL}/users/login`;
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        user: {
          username: usernameValue,
          password: passwordValue,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const {
      data: { token },
    } = await response.json();
    localStorage.setItem("token", JSON.stringify(token));
    hideLoginModal();
  } catch (error) {
    console.error(error);
  }
};

// ON SUBMIT FOR LOGIN USER
$(".modal-body form").on("submit", (event) => {
  console.log(event)
  event.preventDefault();
  const username = $("#loginInputUsername").val();
  const password = $("#loginInputPassword").val();

  loginUser(username, password);
});

// HIDE LOGIN MODAL
const hideLoginModal = () => {
  const token = localStorage.getItem("token");
  if (token) {
    $("#loginModal").modal("hide");
  } else {
    console.log("nothing to hide");
  }
};

// FUNCTION TO REQUEST TO POST A NEW POSTING
const postBlogEntry = async (requestBody) => {
  const token = fetchToken();
  console.log(token);
  try {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ token }`
      },
      body: JSON.stringify(requestBody),
    });
    const newPost = await response.json()
    console.log(newPost)
    return newPost
  } catch (e) {
    console.error(e);
  }
};

// GET THE LOGGED-IN USER DETAILS
const fetchMe = async () => {
  const token = fetchToken()
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        "Authorization":`Bearer ${token}`
      }
    })
    const data = await response.json()
    return data.data
  } catch(error) {
    console.error(error)
  }
}

// EDIT A POST MADE BY USER
const editBlogEntry = async (requestBody, postId) => {
  const token = fetchToken();
	try {
		const request = await fetch(`${BASE_URL}/posts/${postId}`, {
			method: "PATCH", 
			headers: {
				"Content-Type": "application/json",
        "Authorization":`Bearer ${token}`
			},
			body: JSON.stringify(requestBody),
		})
	} catch(e) {
		console.error(e)
	}
}

// DELETE A POST ENTRY MADE BY USER
const deleteBlogEntry = async (postId) => {
	try {
		const request = await fetch(`${BASE_URL}/posts/${postId}`, {
			method: "DELETE", 
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + JSON.parse(localStorage.getItem("token"))
			}
		})
	} catch(e) {
		console.error(e)
	}
}

async function refreshPosts() {
  const posts = await fetchPosts();
  const me = await fetchMe();
  renderPosts(posts, me);
}

// CALL EVERYTHING
(async () => {
  await refreshPosts()
})();

