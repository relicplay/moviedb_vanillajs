const baseUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=639d3b6ab1d15163c1ac63fbf9db3a9e';

let data = [];


const dataRequest = async (myRequest) => {
    async function fetchData(myRequest) {
      const response = await fetch(`${baseUrl}${myRequest}`);
      
      const result = await response.json();
  
      return result;
    }
  
    data = await fetchData(myRequest);
    console.log(data);
    data.results.forEach(function(element) {
      console.log(element);
    });
    
    clearContent("#movielist");
    displayResult("#movielist", data.results);
  }


  const clearContent = (targetId) => {
    const targetElement = document.querySelector(targetId);
    targetElement.innerHTML='';
  }

  const displayResult = (targetId, results) => {
    const targetElement = document.querySelector(targetId);
    results.forEach(function(element, index) {
      addDomElement(
        {
          typeOfElement: "article", 
          elementClass: "item", 
          elementContent: `ITEM ${index+1}`,
          elementId: `itembox${index}`, 
          parentElement: "movielist"
        }
        );
        addDomElement(
          {
            typeOfElement: "div", 
            elementClass: "testclass", 
            elementContent: `Title, Image, date, rating`,
            parentElement: `itembox${index}`
          }
          );
    });
  }

  const addDomElement = (obj) => {
      const e = document.createElement(obj.typeOfElement);
      if (obj.elementClass) {e.setAttribute("class", obj.elementClass);}
      if (obj.elementId) {e.setAttribute("id", obj.elementId);}
      const textnode = obj.elementContent ? obj.elementContent : '';
      e.appendChild(document.createTextNode(textnode));
      document.getElementById(obj.parentElement).appendChild(e);
  }


  dataRequest('&sort_by=popularity.desc');


  /*

  const displayMovies = (targetId, data) => {
    clearContent(targetId);

    const addItem = (item) => {
      text += item;
    }

    let items = "";
    data.forEach(addItem);

    targetElement.innerHTML=items;

  }
  
*/

/*


const fetchData = async (myRequest) => {

    let myObject = await fetch(`${baseUrl}${myRequest}`);
    let myText = await myObject.text();

    //console.log(myText);

    const res = JSON.parse(myText);
    console.log(res.results[0]);
    

}

*/


