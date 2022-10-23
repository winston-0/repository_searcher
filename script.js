const searchBar = document.querySelector('.search-container__bar');
const autoComplete = document.querySelector('.search-container__autocompete-list');
const reposList = document.querySelector('.pinned-repos__list');
const searchContainer = document.querySelector('.search-container')



searchBar.oninput = async () => {
  if(searchBar.value.trim() === "") {
    autoComplete.innerHTML = "";
  } else {
  let repos = await getRepos(searchBar.value);
  let items = repos.items;
  autoComplete.innerHTML = "";
    items.forEach(i => {
      renderAutoComplete(i);
    })
  }
} 


async function sendRequest(value) {
  let response = await fetch(`https://api.github.com/search/repositories?q=${value}&per_page=5&page=1`);
  return await response.json();
}

function debounceRequest() {
  let timerId = null;
  return function(searchValue) {
    if(searchValue.trim() === "") {
      clearTimeout(timerId);
    } else {
      return new Promise((resolve) => {
         clearTimeout(timerId);
          timerId = setTimeout( () => {
            resolve(sendRequest(searchValue));
          }, 1200);
      })
  }
}
}

let getRepos = debounceRequest();

autoComplete.onclick = (e) => {
  pinRepo(e.target);
}

reposList.onclick = (e) => {
  if(e.target.classList.contains('pinnned-repos__list-button')) {
    reposList.removeChild(e.target.closest('.pinned-repos__list > li'))
  }
}


function renderAutoComplete(repo) {
  let autoCompleteItem =  `
 <li> 
  <button class="search-container__autocompete-list-item"
  data-stars = "${repo.stargazers_count}"
  data-name = "${repo.name}"
  data-owner = "${repo.owner.login}">
  ${repo.name}</button>
 </li>
  `;
  autoComplete.insertAdjacentHTML('afterbegin', autoCompleteItem)
}

function pinRepo(repo) {
  let reposListItem = `
  <li class = "pinned-repos__list-item">
    <ul class = "pinned-repos__list-item-data list">
      <li>Name: ${repo.dataset.name}</li>
      <li>Owner: ${repo.dataset.owner}</li>
      <li>Stars: ${repo.dataset.stars}</li>
    </ul>
    <button class = "pinnned-repos__list-button"></button>
  </li>
  `;
  reposList.insertAdjacentHTML('afterbegin', reposListItem)
}
