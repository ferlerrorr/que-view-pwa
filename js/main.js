

window.addEventListener('load',main)
function main(){

    vaildateCacheIfOnline()
    .then(_=>{
        
    })

}
function vaildateCacheIfOnline(){

    return new Promise((resolve,reject)=>{

        fetch(`config.json?cacheBust=${new Date().getTime()}`)
        .then(response => { return response.json() })
        .then(config => {

            let installedVersion = Settings.getVersion()
            if ( installedVersion== 0) {
                Settings.setVersion(config.version)
                document.querySelector('#version').innerHTML= `version ${config.version}`;
                return resolve();
            }
            else if (installedVersion != config.version) {
                console.log('Cache Version mismatch')
                fetch(`config.json?clean-cache=true&cacheBust=${new Date().getTime()}`).then(_ => {
                    //actually cleans the cache
                    Settings.setVersion(config.version);
                    window.location.reload();
                   
                    return resolve();  // unnecessary
                });

            }else{
                // already updated
                console.log('Cache Updated')
                document.querySelector('#version').innerHTML= `version ${installedVersion}`;
                return resolve();
            }
        }).catch(err=>{
            console.log(err);
            return resolve();
            //handle offline here 
        })
    })

}

/** ##Global Variables Document Window Selector */
let dropdown = document.getElementById("stores");
let defaultOption = document.createElement("option");
let done = false;
/** ##Global Variables Document Window Selector */





/** ##Initial Load Function Executables*/
$(document).ready(function () {
  rtrn();
  storeLoc();
  console.clear();
});
/** ##Initial Load Function Executables*/

/** ##Store Dopdown Script Handler*/
function storeLoc() {
  $("#stores").empty(); //Insures no hanging options elements will remain after executed
  dropdown.length = 0; //Remove all values that remains to the dropdown list = null
  defaultOption.text = localStorage.getItem("store"); //Assign the value of store index in the local storage to dropdown
  dropdown.add(defaultOption); //Add the option of store index within option element
  dropdown.selectedIndex = 0; //Refresh the selected index to 0
}
/** ##Store Dopdown Script Handler*/

/** ##Sleep function for stopping the program
 -- ! note it can introduce a  side effect of the longer the milisecond of sleep it can bypass the excution and can be fired twice 
--  ! use less
*/
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
/** ##Sleep function*/

/** ##App Datetime Script Handler
-- this script makes sures that the app is up to date and update every seconds 
 * */
var dateTime;
dateTime = setInterval(function () {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return (this.dateTime = date + " " + time);
}, 1000);
/** ##App Datetime Script Handler*/

/** ##Closure`s 
 -- this script makes sure to not double fires when double clicked
*/
var rtrn = (function () {
  return function () {
    if (!done) {
    serving(), queue();
    }
  };
})();
var refsh 
refsh = setInterval(function () {
 rtrn();
}, 10000);



/** ##App Queue Card list Script Handler*/
/** -- App Queue Card HTTP Request Script Handler*/
function queue() {
  let storeAt = localStorage.getItem("store");
  //Active Queue
  let qbody = document.getElementById("qbody");
  $(qbody).empty();
  let headersList = {
    "X-Requested-With": "XMLHttp",
    "Content-Type": "application/json",
  };
  fetch("http://127.0.0.1:8000/api/v1/queues/" + storeAt, {
    method: "GET",
    headers: headersList,
  })
    .then((res) => res.json())
    .then((json) => {
      json.map((json) => {
        qbody.append(td_fun1(json.transaction_number, json.id));
      });
    });

  /** -- App Queue Card Populate List Script Handler*/
  function td_fun1(transaction_number, id) {
    let td = document.createElement("li");
    td.innerHTML = `<div class="list-card" onclick="nowServing('${id}')">
<div class="card-txt">
<div class="qtitle-cont" >
<h5 class="qtitle">Transaction Number</h5></div>
<div class ="qnumb-cont">
<h5 class="qnumber">${transaction_number}</h5>
</div>
</div>
<span class="material-icons qmat-right noSelect ">
</span>
</div>`;
    return td;
  }
}
/** ##App Queue Card list Script Handler*/

/** ##App Serving Card list Script Handler*/
/** -- App Serving Card HTTP Request Script Handler*/
function serving() {
  let storeAt = localStorage.getItem("store");
  let ubody = document.getElementById("ubody");
  $(ubody).empty();
  let headersList = {
    "X-Requested-With": "XMLHttp",
    "Content-Type": "application/json",
  };
  fetch("http://127.0.0.1:8000/api/v1/serving/" + storeAt, {
    method: "GET",
    headers: headersList,
  })
    .then((res) => res.json())
    .then((json) => {
      json.map((json) => {
        ubody.append(td_fun(json.transaction_number, json.id));
      });
    });

  /** -- App Serving Card Populate List Script Handler*/
  function td_fun(transaction_number, id) {
    let td = document.createElement("li");
    td.innerHTML = `<li> 
<div class="slist-card">
<span class="material-icons smat-back" onclick="deleteServing('${id}')">

</span>        
<div class="card-txt">
<h4 class="stitle">Transaction Number</h4>
<h4 class="snumber">${transaction_number}</h4>
</div>
<span class="material-icons smat-forward" onclick="nowServed('${id}')">

</span>
</div>
</li>`;
    return td;
  }
}

/** ##App Choose Store Dropdown  Script Handler */
/** -- App Store Queue HTTP Request Script Handler */
function strdd() {
  const url = "http://localhost:8000/api/v1/stores";
  const request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.onload = function () {
    if (request.status === 200) {
      const data = JSON.parse(request.responseText);
      let option;
      for (let i = 0; i < data.length; i++) {
        option = document.createElement("option");
        option.text = data[i];
        option.value = data[i];
        dropdown.add(option);
      }
    } else {
      /** -- Reached the server, but it returned an error */
    }
  };
  request.onerror = function () {
    console.error("An error occurred fetching the JSON from " + url);
  };
  request.send();

  storeLoc();
}

/** -- On change selections */
$(document).ready(function () {
  $("#stores").change(function () {
    localStorage.setItem("store", $(this).val());
  });
});
/** ##App Choose Store Dropdown  Script Handler */

/**
## Script For handling Settings Button
 */
/** -- Document/Window Element Selectors */
const setbtn = document.getElementById("setbtn");
const modal = document.querySelector(".modal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalBg = document.getElementById("modalBg");
/** -- Element Event Handler for opening the Settings modal*/
const openModal = (e) => {
  modal.style.display = "block";
};
/** -- Element Event Handler for closing the Settings modal*/
const closeModal = (e) => {
  modal.style.display = "none";
  location.reload();
};
/** -- Element Event Listener Settings modal*/
setbtn.addEventListener("click", openModal);
modalCloseBtn.addEventListener("click", closeModal);
modalBg.addEventListener("click", closeModal);
/**
## Script For handling Settings Button
*/

