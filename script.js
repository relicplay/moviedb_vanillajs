const baseUrl = 'https://api.themoviedb.org/3/';
const apiKey = '?api_key=639d3b6ab1d15163c1ac63fbf9db3a9e';
const url_discover = 'discover/movie';
const url_search = 'search/movie';
const url_genres = 'genre/movie/list';
const url_languages = 'configuration/languages';
const imgBaseUrl = 'https://image.tmdb.org/t/p/w300/';

const modal = document.querySelector('#myModal');
const closeModalBtn = document.querySelector('.close-modal');
const searchBtn = document.querySelector('.search-container button');
const navBtnCollection = document.querySelectorAll(".mainmenu button");

const popularitySlider = document.querySelector("#popularityrange");
const voteaverageSlider = document.querySelector("#voterange");
const votecountSlider = document.querySelector("#votecountrange");

const statusMsg = document.querySelector(".statusmessage");
const movieList = document.querySelector("#movielist");

let genreBtnCollection;

let data_stored,
genres_list,
languages_list,
selectedGenres,
modalData = [];

let lastDataRequest = navBtnCollection[0].value;


  window.addEventListener("scroll", () => {
    const targetElement = document.querySelector("#navlogo").classList;
    document.documentElement.scrollTop > 25
    ? targetElement.add("navlogo-small")
    : targetElement.remove("navlogo-small");
    adjustPaddingTop(document.querySelector('header'), document.querySelector('main'));
  }
  );

  
  window.addEventListener("resize", () => {
    adjustPaddingTop(document.querySelector('header'), document.querySelector('main'));
  }
  );


  document.body.addEventListener("click", (event) => {
    switch(event.target) {
      case modal:
      case closeModalBtn:
        modal.style.display = "none";
    }
  }
  );

  
  searchBtn.addEventListener("click", () => {
    performAPISearch(document.querySelector('#search').value);
  }
  );


  document.body.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchBtn.click();
    }
  });

  
  navBtnCollection.forEach((element) => {
    element.addEventListener('click', () => {
      removeClassFromElements(navBtnCollection, "button-highlight");
      //prevents request to the API identical to the prior one:
      if (highlightSelectedButton(element)) {
        apiRequest(element.value, url_discover);
      }
    })
  });


  
  const initFilterControls = () => {
    document.querySelectorAll(".filterlist .slider, .filterlist #languageSelector, .filterlist #sortingSelector").forEach((element) => {
      const displaySliderValue = () => {
        if (element.className === "slider") {element.nextElementSibling.textContent = element.value;}
      }
      displaySliderValue();
      element.addEventListener('input', () => {
        displaySliderValue();
        checkIfTitlesExist();
      })
    });
  }

  
  //General function for API-requests:
  const apiRequest = async (myRequest, endpoint, callbackFunction=updateTitleCards) => {
    try {
      const res = await fetch(`${baseUrl+endpoint+apiKey+myRequest}`);
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        console.log(`status code: ${data.status_code} / ${data.status_message}`);
        statusCodes(res.status, data.status_message);
      }
      else {
        determineDataDestination(endpoint, data);
        callbackFunction(data);
      }
    } catch (err) {
      console.error(err);
    }
    
  }

  //Decides which variable should store fetched API-data:
  const determineDataDestination = (endpoint, data) => {
    switch(endpoint) {
      case url_genres:
        genres_list = data;
        break;
      case url_languages:
        break;
      default:
        data_stored = data;
    }
  }

  //Displays error messages in DOM:
  const statusCodes = (status, errDetails) => {
    let msg;
    switch(status) {
      case 401:
        msg = '401 Unauthorized';
        break;
      case 404:
        msg = 'HTTP 404 Not Found';
        break;
      case 500:
        msg = '500 Internal Server Error';
        break;
      default:
        msg = "Unknown error";
    }
    addTextContent(statusMsg, 'h2', msg);
    addTextContent(statusMsg, 'h3', errDetails);
  }


  //checks if titles exist, then updates title cards:
  const checkIfTitlesExist = (obj = data_stored) => {
    if (obj) {
      if (Object.keys(obj.results).length > 0) {updateTitleCards(obj);}
    }
  }

  //Replaces existing titleCards with updated ones:
  const updateTitleCards = (obj) => {
    /*
    obj.results.forEach(function(element) {
      console.log(element);
    });
    */
    clearElementContent("#movielist");
    displayTitleCards(getFilteredObject(sortResult(obj)));
  }

  //Sorts result based on selected option in drop-down:
  const sortResult = (obj) => {
    let sortingType;
    switch (document.querySelector("#sortingSelector").value) {
      case "popAsc":
        sortingType = (a, b) => a.popularity - b.popularity;
        break;
      case "titFall":
        sortingType = (a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        break;
      case "titAsc":
        sortingType = (a, b) => b.title.toLowerCase().localeCompare(a.title.toLowerCase());
        break;
      case "ratFall":
        sortingType = (a, b) => b.vote_average - a.vote_average;
        break;
      case "ratAsc":
        sortingType = (a, b) => a.vote_average - b.vote_average;
        break;
      case "relFall":
        sortingType = (a, b) => new Date(b.release_date) - new Date(a.release_date);
        break;
      case "relAsc":
        sortingType = (a, b) => new Date(a.release_date) - new Date(b.release_date);
        break;
      default:
        sortingType = (a, b) => b.popularity - a.popularity;
    }
    return obj.results.sort(sortingType);
  }

  //Adds all available languages into the drop-down list:
  const populateLanguageList = (languageList) => {
    //removes first option (no language), then sorts alphabetically:
    languageList.splice(0, 1);
    languageList.sort((a, b) =>
      a.english_name.localeCompare(b.english_name)
    );
    languageList.forEach((element) => {
      createDomElement(
        {
          typeOfElement: "option",
          parentElement: "languageSelector",
          elementContent: element.english_name,
            props: {
              value: {
                attributeValue: element.iso_639_1
              }
            }
        }
      );
    }
    );
  }

  //Creates & displays buttons for each individual genre:
  const displayGenreButtons = (genreList) => {
    genreList.genres.forEach((element, index) => {
      console.log(element, index);
        createDomElement(
          {
            typeOfElement: "input",
            parentElement: "genreboxes",
              props: {
                type: {
                  attributeValue: "checkbox"
                },
                id: {
                  attributeValue: `genrebox${element.id}`
                },
                value: {
                  attributeValue: element.id
                },
                checked: {
                  attributeValue: "checked"
                }
              }
          }
        );
        createDomElement(
          {
            typeOfElement: "label", 
            elementContent: element.name,
            parentElement: "genreboxes",
              props: {
                class: {
                  attributeValue: "checkbox-container"
                },
                for: {
                  attributeValue: `genrebox${element.id}`
                }
              }
          }
        );
    });
    clickGenreButtons();
  }

  //Checks if genre-button is clicked:
  const clickGenreButtons = () => {
    genreBtnCollection = document.querySelectorAll("#genreboxes input");
    countActiveButtons();
    genreBtnCollection.forEach((element) => {
      element.addEventListener('click', () => {
        console.log(element.value);
        countActiveButtons();
        checkIfTitlesExist();
      })
    });
  }


  //Creates & displays clickable cards for each individual title:
  const displayTitleCards = (titles) => {
    titles.forEach((element, index) => {
      createDomElement(
        {
          typeOfElement: "article",
          parentElement: "movielist",
            props: {
              class: {
                attributeValue: "card"
              },
              id: {
                attributeValue: `itemcard${index}`
              }
            }
        }
      );
      createDomElement(
        {
          typeOfElement: "img",
          parentElement: `itemcard${index}`,
            props: {
              class: {
                attributeValue: "thumbnail"
              },
              src: {
                attributeValue: element.poster_path !== null ? `${imgBaseUrl}${element.poster_path}` : `images/noimg.png`
              },
              alt: {
                attributeValue: "image"
              }
            }
        }
      );
      createDomElement(
        {
          typeOfElement: "div",
          parentElement: `itemcard${index}`,
            props: {
              class: {
                attributeValue: "textholder"
              },
              id: {
                attributeValue: `textholder${index}`
              }
            } 
        }
      );
      createDomElement(
        {
          typeOfElement: "div",
          parentElement: `textholder${index}`,
          elementContent: element.title.replace(/^(.{11}[^\s]*).*/, "$1"),
            props: {
              class: {
                attributeValue: "cardtext"
              }
            }
        }
      );
      createDomElement(
        {
          typeOfElement: "div",
          parentElement: `textholder${index}`,
          elementContent: getStringLength(element.release_date, 'N/A'),
            props: {
              class: {
                attributeValue: "cardtext"
              }
            }
        }
      );
      document.querySelector(`#itemcard${index}`).addEventListener("click", () => {updateModalContent(element);});
    });
    displayCardsOrError();
  }


  //Creates new DOM-element:
  const createDomElement = (obj) => {
      const newElement = document.createElement(obj.typeOfElement);
      Object.keys(obj.props).forEach((element, index) => {
        newElement.setAttribute(element, Object.values(obj.props)[index].attributeValue);
      });
      const textnode = obj.elementContent ? obj.elementContent : '';
      newElement.appendChild(document.createTextNode(textnode));
      document.getElementById(obj.parentElement).appendChild(newElement);
  }


  //Returns a filtered version of object based on the form parameters:
  const getFilteredObject = (objToFilter) => {
    return objToFilter.filter(title => {
        return title.popularity >= popularitySlider.value
        && title.vote_average <= voteaverageSlider.value
        && title.vote_count >= votecountSlider.value
        && checkTitleLanguageMatch(title)
        && matchGenres(title)
        ;
    });
  }

  //Checks if title's language matches drop-down option:
  const checkTitleLanguageMatch = (title) => {
    switch(document.querySelector(".filterlist #languageSelector").value) {
      case "all":
      case title.original_language:
        return true;
    }
    return false;
  }

  
  const matchGenres = (title) => {
    let matchesFound = 0;
    selectedGenres.forEach((element) => {
        if (title.genre_ids.find(e => e == element)) {
          matchesFound++;
        }
    });
    if (matchesFound > 0) {return true;}
    return false;
  }


  //Updates content of the modal:
  const updateModalContent = (movieTitleData) => {
    const header = document.querySelector('.modal-header');
    const movieDetailsList = document.querySelector('.modal-moviedetails');
    header.style.backgroundImage = `url(${imgBaseUrl}${movieTitleData.backdrop_path})`;
    addTextContent(header, 'h1', movieTitleData.title);
    addTextContent(movieDetailsList, '#movieOgTitle', movieTitleData.original_title);
    addTextContent(movieDetailsList, '#movieDate', movieTitleData.release_date);
    addTextContent(movieDetailsList, '#movieOgLang', movieTitleData.original_language);
    addTextContent(movieDetailsList, '#movieAdult', movieTitleData.adult ? 'Yes' : 'No');
    addTextContent(movieDetailsList, '#movieOverview', movieTitleData.overview);
    addTextContent(movieDetailsList, '#movieGenres', movieTitleData.genre_ids.map(g => getGenreNameById(g, genres_list.genres)).join(', '));
    modal.style.display = "block";
  }

  //Returns the name of genre id:
  const getGenreNameById = (id, obj) => {
    const gname = obj.find(x => x.id === id).name;
    return gname !== undefined ? gname : 'Unknown';
  }

  //Searches for title based on user input:
  const performAPISearch = (inputValue) => {
    if (inputValue.length > 0 && compareDataWithApi(inputValue)) {
      removeClassFromElements(navBtnCollection, "button-highlight");
      apiRequest(`&query=${inputValue.replace(/ /g,"+")}`, url_search, updateTitleCards);
      document.querySelector('#search').value = '';
    }
  }

  //Adds textcontent into any element of choice:
  const addTextContent = (parentElement, targetElement, txt) => {
    return parentElement.querySelector(targetElement).textContent = txt;
  }

  //Clears all content inside any element of choice:
  const clearElementContent = (targetId) => {
    //document.querySelector(targetId).innerHTML='';
    const element = document.querySelector(targetId);
    while (element.firstChild) element.removeChild(element.firstChild);
  }

  //Highlights selected button & stores its value:
  const highlightSelectedButton = (element) => {
    element.classList.add("button-highlight");
    return compareDataWithApi(element.value);
  }

  //compares stored data with API-request:
  const compareDataWithApi = (element) => {
    if (lastDataRequest != element) {
      lastDataRequest = element;
      return true;
    }
    return false;
  }

  //Removes css-class of all elements:
  const removeClassFromElements = (targetElements, styleToRemove) => {
    targetElements.forEach(element => {
      element.classList.remove(styleToRemove);
    });
  }

  //Checks & returns element if length > 0, else returns string of choice:
  const getStringLength = (element, stringToReturn) => {
    return element.length > 0 ? element : stringToReturn;
  }

  //Refreshes the list of user-selected genres:
  const countActiveButtons = () => {
    selectedGenres = [];
    genreBtnCollection.forEach((element) => {
      if (element.checked) {
        selectedGenres.push(element.value);
      }
    });
    console.log(selectedGenres);
  }

  //Adjusts padding top of element y based on height of x:
  const adjustPaddingTop = (x, y) => {
    y.style.paddingTop = (x.offsetHeight * .5) + 'px';
  }

  //Display the cards if there are any, otherwise error message:
  const displayCardsOrError = () => {
    addTextContent(statusMsg, 'h2', 'No titles found');
    data_stored.results.length > 0 ? movieList.style.display = "grid" : movieList.style.display = "none";
    movieList.style.display == "none" ? statusMsg.style.display = "flex" : statusMsg.style.display = "none";
  }
  
  //Init data request from 1st button in main menu & highlights it:
  const init = () => {
    apiRequest('', url_languages, populateLanguageList);
    apiRequest('', url_genres, displayGenreButtons);
    apiRequest(navBtnCollection[0].value, url_discover);
    highlightSelectedButton(navBtnCollection[0]);
    initFilterControls();
    adjustPaddingTop(document.querySelector('header'), document.querySelector('main'));
  }

  init();
