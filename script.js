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

//const statusMsg = document.querySelector(".statusmessage");

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
        dataRequest(element.value, url_discover);
      }
    })
  });


  
  const initFilterControls = () => {
    document.querySelectorAll(".filterlist .slider, .filterlist #languageSelector").forEach((element) => {
      const displaySliderValue = () => {
        if (element.className === "slider") {element.nextElementSibling.textContent = element.value;}
      }
      displaySliderValue();
      element.addEventListener('input', () => {
        displaySliderValue();
        if (Object.keys(data_stored.results).length > 0) {updateTitleCards(data_stored);}
      })
    });
  }
    


  
  const dataRequest = async (myRequest, endpoint, callbackFunction=updateTitleCards) => {
    try {
      const res = await fetch(`${baseUrl+endpoint+apiKey+myRequest}`);
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        console.log(`status code: ${data.status_code} / ${data.status_message}`);
        statusCodes(res.status);
      }
      else {
        //statusMsg.style.display = "none";
        //bryt ut i egen funktion senare:
        switch(endpoint) {
          case url_genres:
            genres_list = data;
            break;
          case url_languages:
            break;
          default:
            data_stored = data;
        }
        callbackFunction(data);
      }
    } catch (err) {
      console.error(err);
    }
    
  }

  const statusCodes = (status) => {
    let msg = '';
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
        msg = "unknown error";
    }
    console.log(msg);
    //throw new Error(`An error has occured: ${status}`);
  }


  //Replaces existing titleCards with updated ones:
  const updateTitleCards = (data) => {
    //Remove later:
    data.results.forEach(function(element) {
      console.log(element);
    });
    clearElementContent("#movielist");
    displayTitleCards(getFilteredObject(data.results));
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
        //Goto filter function with elementcheck = button?
      })
    });
  }

  /*UNDER CONSTRUCTION:
  const includeMoviesByGenre = (movies, genreId) => {
    console.log(movies.filter(movie => movie.genre_ids.includes(genreId)));
    //return movies.filter(movie => movie.genre_ids.includes(genreId));
  }
  */


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
    //alert(JSON.stringify(objToFilter));
    return objToFilter.filter(title => {
      return title.popularity >= popularitySlider.value
      && title.vote_average <= voteaverageSlider.value
      && title.vote_count >= votecountSlider.value
      && checkTitleLanguageMatch(title)
      //&& matchGenres(title)
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

  /* may not be used:
  const matchGenres = (title) => {
    console.clear();
    console.log('Genre check was called!');
    genreBtnCollection.forEach((element) => {
        if (element.checked) {
          console.log('Element is checked!');
        }
        //console.log(element.id);
        //IF checkbox is checked:
        //foreach for all genres in title.
        //++ on each match, IF checkbox is checked
        //return value
        //or 0 if no match
    });
    return true;
  }
  */

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
      dataRequest(`&query=${inputValue.replace(/ /g,"+")}`, url_search, updateTitleCards);
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

  
  //Init data request from 1st button in main menu & highlights it:
  const init = () => {
    dataRequest('', url_languages, populateLanguageList);
    dataRequest('', url_genres, displayGenreButtons);
    dataRequest(navBtnCollection[0].value, url_discover);
    highlightSelectedButton(navBtnCollection[0]);
    initFilterControls();
  }

  init();
