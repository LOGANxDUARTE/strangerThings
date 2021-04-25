const BASE_URL = "https://api.harvardartmuseums.org";
const KEY = "apikey=121c9dba-d718-4029-8850-92b9f083d3b8";

async function fetchObjects() {
  const url = `${BASE_URL}/object?${KEY}`;
  onFetchStart();

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  } finally {
    onFetchEnd();
  }
}

async function fetchAllCenturies() {
  const url = `${BASE_URL}/century?${KEY}&size=100&sort=temporalorder`;
  onFetchStart();

  if (localStorage.getItem("centuries")) {
    return JSON.parse(localStorage.getItem("centuries"));
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    const records = data.records;
    localStorage.setItem("centuries", JSON.stringify(records));
    return records;
  } catch (error) {
    console.error(error);
  } finally {
    onFetchEnd();
  }
}

async function fetchAllClassifications() {
  const url = `${BASE_URL}/classification?${KEY}&size=100&sort=name`;
  onFetchStart();

  if (localStorage.getItem("classifications")) {
    return JSON.parse(localStorage.getItem("classifications"));
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    const records = data.records;
    localStorage.setItem("classification", JSON.stringify(records));
    return records;
  } catch (error) {
    console.error(error);
  } finally {
    onFetchEnd();
  }
}

async function prefetchCategoryLists() {
  try {
    const [classifications, centuries] = await Promise.all([
      fetchAllClassifications(),
      fetchAllCenturies(),
    ]);

    // This provides a clue to the user, that there are items in the dropdown
    $(".classification-count").text(`(${classifications.length})`);

    classifications.forEach((classification) => {
      const classificationDropdown = $("#select-classification");
      const optionTag = $(
        `<option value="${classification.name}">${classification.name}</option>`
      );
      classificationDropdown.append(optionTag);
    });

    // This provides a clue to the user, that there are items in the dropdown
    $(".century-count").text(`(${centuries.length}))`);

    centuries.forEach((century) => {
      const centuryDropdown = $("#select-century");
      const optionTag = $(
        `<option value="${century.name}">${century.name}</option>`
      );
      centuryDropdown.append(optionTag);
    });
  } catch (error) {
    console.error(error);
  }
}

function onFetchStart() {
  $("#loading").addClass("active");
}

function onFetchEnd() {
  $("#loading").removeClass("active");
}

function buildSearchString() {
  let classification = $("#select-classification").val();
  let century = $("#select-century").val();
  let keywords = $("#keywords").val();

  let url =
    `${BASE_URL}/object?${KEY}` +
    `${classification ? `&classification=${classification}` : ""}` +
    `${century ? `&century=${century}` : ""}` +
    `${keywords ? `&keyword=${keywords}` : ""}`;

  return url;
}

$("#search").on("submit", async function (event) {
  event.preventDefault();
  onFetchStart();

  try {
    const response = await fetch(buildSearchString());
    const { records, info } = await response.json();

updatePreview(records, info)

    console.log(records);
    console.log(info);
  } catch (error) {
    console.log(error);
  } finally {
    onFetchEnd();
  }
});

// MODULE 2

function renderPreview(record) {
const {
  description,
  primaryimageurl,
  title,
} = record;

return $(`<div class="object-preview">
    <a href="#">
    ${
      primaryimageurl && title
      ? `<img src="${ primaryimageurl }" /><h3>${ title }<h3>` : title
      ? `<h3>${ title }<h3>` : description
      ? `<h3>${ description }<h3>` : `<img src="${ primaryimageurl }" />`
    }
    </a>
  </div>`).data('record', record);
}

function updatePreview(records, info) {
  const root = $('#preview');
console.log(info)

if (info.next) {
  root.find('.next')
    .data('url', info.next)
    .attr('disabled', false)
} else {
  root.find('.next')
    .data('url', null)
    .attr('disabled', true)
}

if (info.prev) {
  root.find('.previous')
  .data('url', info.prev)
  .attr('disabled', false)
} else {
  root.find('.previous')
  .data('url', null)
  .attr('diabled', true)
}

  const resultsElement = root.find('.results');
  resultsElement.empty();

  records.forEach(function (record) {
    resultsElement.append(renderPreview(record))
  })
}

$('#preview .next, #preview .previous').on('click', async function () {
  onFetchStart();
  
  try {
    const url = $(this).data('url');
    const response = await fetch(url);
    const { records, info } = await response.json();  
    
    updatePreview(records, info);
  } catch (error) {
    console.log(error);
  } finally {
    onFetchEnd();
  }
});

// Module 3

  $('#preview').on('click', '.object-preview', function (event) {
    event.preventDefault();
    const objectElement = $(this).closest('.object-preview')
    const record = objectElement.data('record')
    $('#feature').html(renderFeature(record))
    renderFeature(record);
  });

function renderFeature(record) {
  
  const {
    title,
    dated,
    description,
    culture,
    style,
    technique,
    medium,
    dimensions,
    people,
    department,
    division,
    contact,
    creditline,
    images,
    primaryimageurl,
  } = record;

  const featureElement = $(`<div class="object-feature">
  <header>
    <h3>${title}</h3>
    <h4>${dated}</h4>
  </header>
  <section class="facts">
  ${ factHTML ("Description", description, "culture") }
  ${ factHTML ("Culture", culture, "culture") }
  ${ factHTML ("Style", style, "style") }
  ${ factHTML ("Technique", technique, "technique") }
  ${ factHTML ("Medium", medium, "medium") }
  ${ factHTML ("Dimensions", dimensions, "dimensions") }
  ${
    people
      ? people
          .map(function (person) {
            return factHTML("Person", person.displayname, "person");
          })
          .join("")
      : ""
  }
  ${factHTML("Department", department, "department")}
  ${factHTML("Division", division, "division")}
  ${factHTML(
    "Contact",
    `<a target="_blank" href="mailto:${contact}">${contact}</a>`
  )}
  ${factHTML("Creditline", creditline, "creditline")}
</section>
<section class="photos">
  ${photosHTML(images, primaryimageurl)}
</section>
</div>`);

$('#feature').append(featureElement)
}

function searchURL(searchType, searchString) {
  return `${ BASE_URL }/object?${ KEY }&${ searchType}=${ searchString }`;
}

function factHTML(title, content, searchTerm = null) {
  if (!content) {
    return "";
  } else if (!searchTerm) {
    return `<span class="title">${title}</span>
    <span class="content">${content}</span>`;
  } else {
    return `<span class="title">${title}</span>
    <span class="content">
    <a href="${searchURL(searchTerm,content)}">${content}</a>
    </span>`;
  }
}

function photosHTML(images, primaryimageurl) {
  if (images && images.length > 0) {
    return images
      .map(function (image) {
        return `<img src="${image.baseimageurl}" />`;
      })
      .join("");
  } else if (primaryimageurl) {
    return `<img src="${primaryimageurl}" />`;
  } else {
    return "";
  }
}

$("#feature").on("click", "a", async function (event) {
  const href = $(this).attr("href");

  if (href.startsWith("mailto")) { return; }

  event.preventDefault();

  onFetchStart();

  try {
    let response = await fetch(href);
    let { records, info } = await response.json();
    updatePreview(records, info);

  } catch (error) {
    console.error(error);

  } finally {
    onFetchEnd();
  }
});

prefetchCategoryLists();


// Call for info

// fetchAllCenturies().then((x) => console.log(x));
// fetchAllClassifications().then((x) => console.log(x));
// fetchObjects().then((x) => console.log(x));
