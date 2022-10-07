const baseUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=639d3b6ab1d15163c1ac63fbf9db3a9e';
const imgBaseUrl = 'https://image.tmdb.org/t/p/w300/';

const modal = document.querySelector('#myModal');
const closeModalBtn = document.querySelector('.close-modal');

const navBtnCollection = document.querySelectorAll(".mainmenu button");


let data = [];
let modalData = [];
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

  
  navBtnCollection.forEach((element) => {
    element.addEventListener('click', () => {
      removeStyleClasses(navBtnCollection, "button-highlight");
      highlightNavOption(element);
      dataRequest(element.value, getMovies);
    })
  });





  const dataRequest = async (myRequest, callbackFunction) => {
    try {
      const res = await fetch(`${baseUrl}${myRequest}`);
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
    const filteredData = filterData(data.results);
    clearContent("#movielist");
    displayResult("#movielist", filteredData);
  }

  const getActors = () => {
    console.log('Get actors:');
  }

  const displayResult = (targetId, results) => {
    const targetElement = document.querySelector(targetId);
    results.forEach(function(element, index) {
      console.log(element.poster_path);
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
            elementClass: "testclass", 
            elementContent: element.title.replace(/^(.{11}[^\s]*).*/, "$1"),
            parentElement: `itemcard${index}`
          }
        );
        addDomElement(
          {
            typeOfElement: "div", 
            elementClass: "testclass", 
            elementContent: element.release_date,
            parentElement: `itemcard${index}`
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

  //Adds textcontent into any element of choice:
  const addTextContent = (parentElement, targetElement, txt) => {
    return parentElement.querySelector(targetElement).textContent = txt;
  }

  //Clears all content inside any element of choice:
  const clearContent = (targetId) => {
    document.querySelector(targetId).innerHTML='';
  }

  //Highlists selected button & stores its value:
  const highlightNavOption = (element) => {
    element.classList.add("button-highlight");
    if (lastDataRequest != element.value) {
      lastDataRequest=element.value;
    }
  }

  //Removes css-class of all elements:
  const removeStyleClasses = (targetElements, styleToRemove) => {
    targetElements.forEach(element => {
      element.classList.remove(styleToRemove);
    });
  }

  
  //Init data request from 1st button in main menu & highlights it:
  dataRequest(navBtnCollection[0].value, getMovies);
  highlightNavOption(navBtnCollection[0]);


