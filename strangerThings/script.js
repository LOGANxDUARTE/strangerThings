const BASE_URL =
  "https://strangers-things.herokuapp.com/api/2102-CPU-RM-WEB-PT";

// FUNCTION TO GRAB TOKEN FROM LOCAL STORAGE
const fetchToken = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  return token
}

// FUNCTION THAT FETCH ALL POSTS AVAILABLE
async function fetchPosts() {
  try {
    const response = await fetch(`${BASE_URL}/posts`);
    const data = await response.json();
    // return data
    console.log(data);
    return data.data.posts;
  } catch (error) {
    console.log(error);
  }
}

// FUNCTION THAT RENDERS POSTINGS
function renderPosts(posts, me) {
  $("#posts").empty();
  posts.forEach(function (post) {
    const postElement = createPostHTML(post, me);
    $('#posts').prepend(postElement);
  });
}

// CREATE THE HTML FOR POST
function createPostHTML(post, me) {
  return `
  <div class="card border-dark mb-3" style="min-width: 20rem; max-width: 20rem;">
  <div class="card-header">
    <span>@${post.author.username}</span>
  </div>
  <div class="card-body">
    <h5 class="card-title">${post.title}<span id="thePrice">${post.price}</span></h5>
    <p class="card-text">${post.description}</p>
    <p class="card-text"><em>Do they Deliver?</em><br>${post.willDeliver}</p>
    <a href="#" id="postButton"class="btn btn-dark">Go somewhere</a>
    ${ me._id === post.author._id ?
      `<svg class="svg-icon" viewBox="0 0 20 20">
      <path d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"></path>
      </svg>`: ''}
  </div>
</div>
  `
}

// FUNCTION THAT RENDERS POSTING TEMPLATE
function renderPostTemplate() {
  const newPostListing = createPostTemplate();

  $("#postTemplate").append(newPostListing)
}

// FUNCTION TO TOGGLE FORM VISIBILITY
function toggleForm() {
  let formStatus = document.getElementById("postForm");
  if (formStatus.style.display === "block") {
    formStatus.style.display = "none";
  } else {
    formStatus.style.display = "block";
  }
}

// CLICK HANDLER FOR DISPLAYING POST TEMPLATE
$("#sellItem").on("click", (event) => {
  console.log('sell item was clicked', event)
  event.preventDefault();
  toggleForm();

});

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
    toggleForm();
    refreshPosts();
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

// HIDE SIGN IN AND NEW USER OPTIONS
const updateHeader = () => {
  const token = fetchToken();
  if(token) {
    $('.hideMe').empty();
    $('.signOut').css("display: content;")
  }
}

// CLICK HANDLER FOR SIGN OUT CONFIRMATION 
$(".signOut").on("click", (event) => {
  console.log('sign out was clicked', event)
  localStorage.removeItem('token');
  $('.signOut').remove();
  refreshPosts();
});


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
    refreshPosts();
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
    refreshPosts();
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
  updateHeader();
  renderPosts(posts, me);
}

// CALL EVERYTHING
(async () => {
  await refreshPosts()
})();