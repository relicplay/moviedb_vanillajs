const checkHamburger = () => {
  const hamburgerMenu = document.querySelector("#myLinks");
  hamburgerMenu.style.display === "block"
  ? hamburgerMenu.style.display = "none"
  : hamburgerMenu.style.display = "block";
}


const baseUrl = 'https://api.themoviedb.org/3/';
const apiKey = '?api_key=639d3b6ab1d15163c1ac63fbf9db3a9e';
const url_discover = 'discover/movie';
const url_search = 'search/movie';
const imgBaseUrl = 'https://image.tmdb.org/t/p/w300/';


const modal = document.querySelector('#myModal');
const closeModalBtn = document.querySelector('.close-modal');
const searchBtn = document.querySelector('.search-container button');
const filterBtn = document.querySelector('#filter-button');

const navBtnCollection = document.querySelectorAll(".mainmenu button");


let data = [];
let modalData = [];
let unfilteredMovieData;
let lastDataRequest = navBtnCollection[0].value;


  window.addEventListener("scroll", () => {
    const targetElement = document.querySelector("#navlogo").classList;
    document.documentElement.scrollTop > 25
    ? targetElement.add("navlogo-small")
    : targetElement.remove("navlogo-small");
  }
  );

  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
    }
  );

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
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

  filterBtn.addEventListener("click", () => {
    filterData(unfilteredMovieData);
  }
  );

  
  navBtnCollection.forEach((element) => {
    element.addEventListener('click', () => {
      removeStyleClasses(navBtnCollection, "button-highlight");
      //prevents request to the API identical to the prior one:
      if (highlightNavOption(element)) {
        dataRequest(element.value, url_discover, getMovies);
      }
    })
  });



  const dataRequest = async (myRequest, endpoint, callbackFunction) => {
    try {
      const res = await fetch(`${baseUrl+endpoint+apiKey+myRequest}`);
      const data = await res.json();
      console.log(data);
      if (res.ok && typeof(callbackFunction) != 'undefined') {
        callbackFunction(data);
      }
    } catch (err) {
      console.error(err);
    }
    
  }


  const getMovies = (data) => {
    data.results.forEach(function(element) {
      console.log(element);
    });
    unfilteredMovieData = data;
    const filteredData = filterData(data.results);
    clearContent("#movielist");
    displayResult("#movielist", filteredData);
  }


  const displayResult = (targetId, results) => {
    const targetElement = document.querySelector(targetId);
    results.forEach(function(element, index) {
      //console.log(element.poster_path);
      addDomElement(
        {
          typeOfElement: "article", 
          elementClass: "card",
          elementId: `itemcard${index}`, 
          parentElement: "movielist"
        }
        );
        addDomElement(
          {
            typeOfElement: "img", 
            elementClass: "thumbnail",
            imgSrc: element.poster_path !== null ? `${imgBaseUrl}${element.poster_path}` : `images/noimg.png`,
            imgAlt: "Image",
            parentElement: `itemcard${index}`
          }
        );
        addDomElement(
          {
            typeOfElement: "div", 
            elementClass: "textholder",
            elementId: `textholder${index}`, 
            parentElement: `itemcard${index}`
          }
          );
        addDomElement(
          {
            typeOfElement: "div", 
            elementClass: "cardtext", 
            elementContent: element.title.replace(/^(.{11}[^\s]*).*/, "$1"),
            parentElement: `textholder${index}`
          }
        );
        addDomElement(
          {
            typeOfElement: "div", 
            elementClass: "cardtext", 
            elementContent: checkStringLength(element.release_date, 'N/A'),
            parentElement: `textholder${index}`
          }
        );
        document.querySelector(`#itemcard${index}`).addEventListener("click", () => {updateModalData(element);});

    });
  }


  const addDomElement = (obj) => {
      const e = document.createElement(obj.typeOfElement);
        if (obj.elementClass) {e.setAttribute("class", obj.elementClass);}
        if (obj.elementId) {e.setAttribute("id", obj.elementId);}
        if (obj.imgSrc) {e.setAttribute("src", obj.imgSrc);}
        if (obj.imgAlt) {e.setAttribute("alt", obj.imgAlt);}
      const textnode = obj.elementContent ? obj.elementContent : '';
      e.appendChild(document.createTextNode(textnode));
      document.getElementById(obj.parentElement).appendChild(e);
  }


  const filterData = (objToFilter) => {
    //alert(JSON.stringify(objToFilter));
    objToFilter = filterByVotes(objToFilter);
    return objToFilter;
  }

  const filterByVotes = (objToFilter) => {
    //alert(JSON.stringify(objToFilter[0]));
    //console.log(document.querySelector("#voterange").value);
    return objToFilter;
  }

  const updateModalData = (singleMovieData) => {
    modalData = singleMovieData;
    const header = document.querySelector('.modal-header');
    const movieDetailsList = document.querySelector('.modal-moviedetails');
    header.style.backgroundImage = `url(${imgBaseUrl}${modalData.backdrop_path})`;
    addTextContent(header, 'h1', modalData.title);

    addTextContent(movieDetailsList, '#movieOgTitle', modalData.original_title);
    addTextContent(movieDetailsList, '#movieDate', modalData.release_date);
    addTextContent(movieDetailsList, '#movieOgLang', modalData.original_language);
    addTextContent(movieDetailsList, '#movieAdult', modalData.adult ? 'Yes' : 'No');
    addTextContent(movieDetailsList, '#movieOverview', modalData.overview);

    modal.style.display = "block";
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
      lastDataRequest=element;
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
  dataRequest(navBtnCollection[0].value, url_discover, getMovies);
  highlightNavOption(navBtnCollection[0]);


