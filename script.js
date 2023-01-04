const baseUrl = 'https://api.themoviedb.org/3/';
const apiKey = '?api_key=639d3b6ab1d15163c1ac63fbf9db3a9e';
const url_discover = 'discover/movie';
const url_search = 'search/movie';
const url_genres = 'genre/movie/list'
const imgBaseUrl = 'https://image.tmdb.org/t/p/w300/';

const modal = document.querySelector('#myModal');
const closeModalBtn = document.querySelector('.close-modal');
const searchBtn = document.querySelector('.search-container button');
const navBtnCollection = document.querySelectorAll(".mainmenu button");

const popularitySlider = document.querySelector("#popularityrange");
const voteaverageSlider = document.querySelector("#voterange");
const votecountSlider = document.querySelector("#votecountrange");

let genreBtnCollection = document.querySelectorAll("#genreboxes input");

//const statusMsg = document.querySelector(".statusmessage");


let data_stored = [];
let modalData = [];
let lastDataRequest = navBtnCollection[0].value;
let genres_list = [];

/*
document.querySelector(".filterlist select").addEventListener("change", (el) => {
  alert(document.querySelector(".filterlist select").value);
}
);
*/

genreBtnCollection.forEach((element) => {
  element.addEventListener('click', () => {
    console.log(element.id);
  })
});

document.querySelectorAll(".filterlist .slider").forEach((element) => {
  element.nextElementSibling.textContent = element.value;
  element.addEventListener('input', () => {
    element.nextElementSibling.textContent = element.value;
    if (Object.keys(data_stored.results).length > 0) {getMovies(data_stored);}
  })
});

  window.addEventListener("scroll", () => {
    const targetElement = document.querySelector("#navlogo").classList;
    document.documentElement.scrollTop > 25
    ? targetElement.add("navlogo-small")
    : targetElement.remove("navlogo-small");
  }
  );

  document.body.addEventListener("click", (event) => {
    if (event.target == modal || event.target == closeModalBtn) {modal.style.display = "none";}
  }
  );

  
  searchBtn.addEventListener("click", () => {
    searchTitle(document.querySelector('#search').value);
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
      removeStyleClasses(navBtnCollection, "button-highlight");
      //prevents request to the API identical to the prior one:
      if (highlightNavOption(element)) {
        dataRequest(element.value, url_discover);
      }
    })
  });



  const dataRequest = async (myRequest, endpoint, callbackFunction=getMovies) => {
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
        endpoint === url_genres ? genres_list = data : data_stored = data;
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


  const getMovies = (data) => {
    data.results.forEach(function(element) {
      console.log(element);
    });
    const filteredData = filterData(data.results);
    clearContent("#movielist");
    displayResult("#movielist", filteredData);
  }

  const getGenres = (data) => {
    data.genres.forEach((element, index) => {
      console.log(element, index);
        addDomElement(
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
                checked: {
                  attributeValue: "checked"
                }
              }
          }
        );
        addDomElement(
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
    genreBtnCollection = document.querySelectorAll("#genreboxes input");
  }


  const displayResult = (targetId, results) => {
    const targetElement = document.querySelector(targetId);
    results.forEach((element, index) => {
      addDomElement(
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
      addDomElement(
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
      addDomElement(
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
      addDomElement(
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
      addDomElement(
        {
          typeOfElement: "div",
          parentElement: `textholder${index}`,
          elementContent: checkStringLength(element.release_date, 'N/A'),
            props: {
              class: {
                attributeValue: "cardtext"
              }
            }
        }
      );
      document.querySelector(`#itemcard${index}`).addEventListener("click", () => {updateModalData(element);});
    });
  }


  const addDomElement = (obj) => {
      const e = document.createElement(obj.typeOfElement);
      Object.keys(obj.props).forEach((element, index) => {
        e.setAttribute(element, Object.values(obj.props)[index].attributeValue);
      });
      const textnode = obj.elementContent ? obj.elementContent : '';
      e.appendChild(document.createTextNode(textnode));
      document.getElementById(obj.parentElement).appendChild(e);
  }


  const filterData = (objToFilter) => {
    //alert(JSON.stringify(objToFilter));
    return objToFilter.filter(e => {
      return e.popularity >= popularitySlider.value
      && e.vote_average <= voteaverageSlider.value
      && e.vote_count >= votecountSlider.value;
    });
  }

  const updateModalData = (movieTitleData) => {
    const header = document.querySelector('.modal-header');
    const movieDetailsList = document.querySelector('.modal-moviedetails');
    header.style.backgroundImage = `url(${imgBaseUrl}${movieTitleData.backdrop_path})`;
    addTextContent(header, 'h1', movieTitleData.title);

    addTextContent(movieDetailsList, '#movieOgTitle', movieTitleData.original_title);
    addTextContent(movieDetailsList, '#movieDate', movieTitleData.release_date);
    addTextContent(movieDetailsList, '#movieOgLang', movieTitleData.original_language);
    addTextContent(movieDetailsList, '#movieAdult', movieTitleData.adult ? 'Yes' : 'No');
    addTextContent(movieDetailsList, '#movieOverview', movieTitleData.overview);
    addTextContent(movieDetailsList, '#movieGenres', movieTitleData.genre_ids.map(g => returnGenreName(g, genres_list.genres)).join(', '));

    modal.style.display = "block";
  }

  //Returns the name of genre id:
  const returnGenreName = (id, obj) => {
    const gname = obj.find(x => x.id === id).name;
    return gname !== undefined ? gname : 'Unknown';
  }

  const searchTitle = (inputValue) => {
    if (inputValue.length > 0 && compareDataRequests(inputValue)) {
      removeStyleClasses(navBtnCollection, "button-highlight");
      dataRequest(`&query=${inputValue.replace(/ /g,"+")}`, url_search, getMovies);
      document.querySelector('#search').value = '';
    }
  }

  //Adds textcontent into any element of choice:
  const addTextContent = (parentElement, targetElement, txt) => {
    return parentElement.querySelector(targetElement).textContent = txt;
  }

  //Clears all content inside any element of choice:
  const clearContent = (targetId) => {
    //document.querySelector(targetId).innerHTML='';
    const element = document.querySelector(targetId);
    while (element.firstChild) element.removeChild(element.firstChild);
  }

  //Highlists selected button & stores its value:
  const highlightNavOption = (element) => {
    element.classList.add("button-highlight");
    return compareDataRequests(element.value);
  }

  //compares lastDataRequest with current API-request:
  const compareDataRequests = (element) => {
    if (lastDataRequest != element) {
      lastDataRequest = element;
      return true;
    }
    return false;
  }

  //Removes css-class of all elements:
  const removeStyleClasses = (targetElements, styleToRemove) => {
    targetElements.forEach(element => {
      element.classList.remove(styleToRemove);
    });
  }

  //Checks & returns element if length > 0, else returns string of choice:
  const checkStringLength = (element, stringToReturn) => {
    return element.length > 0 ? element : stringToReturn;
  }

  
  //Init data request from 1st button in main menu & highlights it:
  const init = () => {
    dataRequest('', url_genres, getGenres);
    dataRequest(navBtnCollection[0].value, url_discover);
    highlightNavOption(navBtnCollection[0]);
  }

  init();
