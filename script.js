const searchBar = document.querySelector('.search-container__bar');
const autoComplete = document.querySelector('.search-container__autocompete-list');
const reposList = document.querySelector('.pinned-repos__list');
const searchContainer = document.querySelector('.search-container')

searchBar.oninput = async function(e) {
  let valueForSearch = searchBar.value;
  if(valueForSearch.trim() === '') {
    autoComplete.innerHTML = '';
  } 
    let items = await getRepos(valueForSearch);
    if(items === "") {
      return
    }
     autoComplete.innerHTML = '';
     for(let i of items) {
        renderAutoComplete(i);
     } 
}

autoComplete.onclick = (e) => {
  pinRepo(e.target);
}

reposList.onclick = (e) => {
  if(e.target.classList.contains('pinnned-repos__list-button')) {
    reposList.removeChild(e.target.closest('.pinned-repos__list > li'))
  }
}

 function getData() {
  let timerId = null;
  return function(value) {
    return new Promise((resolve, reject) => {
      if(value.trim() === "") {
        clearTimeout(timerId);
        return resolve('')
      } 
      clearTimeout(timerId);
      timerId = setTimeout( async function() {
        let response = await fetch(`https://api.github.com/search/repositories?q=${value}&per_page=5&page=1`);
        let data = await response.json();
         resolve(data.items)
      }, 1200)
  }) 
  }
}
let getRepos = getData();

function renderAutoComplete(repo) {
   let autoCompleteItem = document.createElement('li')
   autoCompleteItem.classList.add('search-container__autocompete-list-item');
   autoCompleteItem.innerHTML = repo.name;
   autoCompleteItem.setAttribute('data-name', repo.name)
   autoCompleteItem.setAttribute('data-owner', repo.owner.login);
   autoCompleteItem.setAttribute('data-stars', repo.stargazers_count);
   autoComplete.append(autoCompleteItem)
}

function pinRepo(repo) {
  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
  let reposListItem = document.createElement('li');
  reposListItem.classList.add('pinned-repos__list-item');
  let listOfRepoData = document.createElement('ul');
  listOfRepoData.classList.add('pinned-repos__list-item-data', 'list')
  let dataAttr = repo.dataset;
  for(let i in dataAttr) {
    let data = document.createElement('li');
    data.innerHTML = `${capitalize(i)}: ${dataAttr[i]}`;
    listOfRepoData.append(data);
  }
  let closeButton = document.createElement('button');
  closeButton.classList.add('pinnned-repos__list-button');
  reposListItem.append(listOfRepoData);
  reposListItem.append(closeButton);
  reposList.append(reposListItem)
}