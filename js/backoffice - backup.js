//************** Session storage test ****************//
let userInfo = sessionStorage.getItem('UPFinder_UserInfo');

if(!userInfo) {
  //First to all remove all the page content
  document.body.innerHTML = '';
  // https://unsplash.com/photos/0W4XLGITrHg 
  document.body.style.backgroundImage = "url('images/background_glitch.jpg')";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundSize = "cover";

  //Show the error message
  document.body.innerHTML = '\
  <div class="vertical-center">\
    <div id="oopsBack" class="container">\
      <div id="notLogged1" class="display-2">Opps</div>\
      <br>\
      <div id="notLogged2" class="display-4">Seem that you are not logged in...</div>\
      <br>\
      <div id="toLoginDiv" class="text-center">\
        <button id="goToLogin" type="button" class="btn btn-primary">Click here to login</button>\
      <div>\
    </div>\
  </div>';

  let BGoToLogin = document.getElementById("goToLogin");
  BGoToLogin.onclick = function() {
    window.location.replace("login.html");
  };
}
else 
{
  userInfo = JSON.parse(userInfo);

  //Change the default name for the user's name
  let navUsername = document.getElementById("navUsername");
  navUsername.innerText = userInfo.username;
}

/*************** LOGOUT LOGIC ***************/
let Blogout = document.getElementById("logoutButton");
Blogout.onclick = function() {
  /****************************************/
  /****************************************/
  /*         LOGOUT SERVER HERE           */
  /****************************************/
  /****************************************/
  //Inform the server that the user logout from the app

  sessionStorage.removeItem('UPFinder_UserInfo')
  window.location.replace("login.html");
};

//We save the token, the username and the role 
//sessionStorage.setItem('token', response.token);

//*************** HTML REQUEST ***************//

let baseURL = "http://dtic-recepcionist.upf.edu:3000";
let xmlHttp = new XMLHttpRequest();

function getHTMLRequest(extraURL, keys, body, callback) {
  
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }

  xmlHttp.open("GET", baseURL+"/"+extraURL, true);
  xmlHttp.send((body || null));
}

function postHTMLRequest(extraURL, keys, body, callback) {
  
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }

  xmlHttp.open("POST", baseURL+"/"+extraURL, true);
  xmlHttp.send((body || null));
}
//********************************************//

//Getting the buttons
let BPeople    = document.getElementById("bpeople");
let BGroups    = document.getElementById("bgroups");
let BOffices   = document.getElementById("boffices");
let BBuildings = document.getElementById("bbuildings");
let BAudios    = document.getElementById("baudios");
let BPhrases   = document.getElementById("bphrases");

//Set the active button
let Bactive = BPeople;

//Get the title and subtitle of the page
let title = document.getElementById("page-title");
let subtitle = document.getElementById("page-subtitle");

//Get the addition button and his text
let addButton = document.getElementById("addButton");
let addButtonText = document.getElementById("addButtonText");

//Get the table and his elements
let resultTable = document.getElementById("search-listing");
let columnNames = document.getElementById("search-columns");
let tableContent = document.getElementById("search-content");

//Set the data for the people page
let peopleTitle    = 'Welcome to the people searcher';
let peopleSubTitle = 'Add, search, edit and remove UPF workers';
let peopleColumns  = '<th>Name</th> <th>Office</th> <th></th> <th></th>';
let peopleHint     = 'Use the name of the worker for start searching';
let peopleAddText = 'Add a new person';

//Set the data for the groups page
let groupsTitle    = 'Welcome to the group searcher';
let groupsSubTitle = 'Add, search, edit and remove UPF groups';
let groupsColumns  = '<th>Group name</th> <th>Office</th> <th>Leader name</th> <th></th> <th></th>';
let groupsHint     = 'Use the name of the group, or tags, for start searching';
let groupsAddText = 'Add a new group';

//Set the data for the office page
let officeTitle    = 'Welcome to the office searcher';
let officeSubTitle = 'Add, search, edit and remove offices';
let officeColumns  = '<th>Office Number</th> <th></th> <th></th>';
let officeHint     = 'Use the number of the office for start searching';
let officeAddText  = 'Add a new office';

//Set the data for the building page
let buildingsTitle    = 'Welcome to the building searcher';
let buildingsSubTitle = 'Add, search, edit and remove buildings';
let buildingsColumns  = '<th>Name</th> <th>Number</th> <th></th> <th></th>';
let buildingsHint     = 'Use the name of the building for start searching';
let buildingsAddText  = 'Add a new building';

//Set the data for the audio page
let audiosTitle    = 'Welcome to the audio searcher';
let audiosSubTitle = 'Add, search, change, remove and play audios';
let audiosColumns  = '<th>Audio transcript</th> <th></th> <th></th>';
let audiosHint     = 'Use the transcript of the audio for start searching';
let audiosAddText  = 'Add a new audio';

//Set the data for the phrases page
let phrasesTitle    = 'Welcome to the phrases searcher';
let phrasesSubTitle = 'Add, search, change and remove phrases';
let phrasesColumns  = '<th>Phrase</th> <th>Placeholders</th> <th></th> <th></th>';
let phrasesHint     = 'Use the transcript of the audio for start searching';
let phrasesAddText  = 'Add a new phrase';

//Get the modals
let deletemodal = $('#deleteModal');

let editmodal = $('#editModal');
let editTitle = document.getElementById("editModalTitle");
let editContent = document.getElementById("editContent");
let saveButton = document.getElementById("saveChanges"); 

let addModal = $('#addModal');
let addContent = document.getElementById("addContent");
let saveAdd = document.getElementById("addElement");

//Get the searchBar placeholder
let searchBar = document.getElementById("search-bar");

//*********************************************//
searchBar.onkeypress = function(e){
  if (!e) e = window.event;
  var keyCode = e.code || e.key;
  if (keyCode == 'Enter'){
    alert("Searching for results");
    this.innerText = "";
    // Enter pressed
    return false;
  }
}

//*************** All data Getters ***************//
//How many elements will be displayed per page
const elementsPerPage = 15;
let dataList, data, audioBin, blob, blobURL, elem, placeholdersList, placeholders, placeLength, lastPlace;

function generatePeopleList(page) {
  let inicialElement = elementsPerPage * (page-1);
  let finalElement = inicialElement + (elementsPerPage - 1);
  data = "";

  for (let i = inicialElement; i < finalElement; ++i) {
    elem = dataList[i];

    data += '\
      <tr id="'+ elem.id +'">\
        <td>'+ elem.name +'</td>\
        <td>' + elem.office + '</td>\
        <td>\
          <audio controls>\
              <source src="'+ (elem.blobURL || "") +'" type="audio/wav">\
          </audio>\
        </td>\
        <td class="column-auto">\
          <button type="button" class="btn btn-table" onclick="editField(this)">\
            <i class="mdi mdi-pencil menu-icon table-icon"></i> Edit\
          </button>\
          <button type="button" class="btn btn-table onclick="removeElement(this)"">\
            <i class="mdi mdi-delete menu-icon table-icon"></i> Delete\
          </button>\
        </td>\
      </tr>'
  }

  tableContent.innerHTML = data;
}

function getPeopleData(keys = undefined) {

  getHTMLRequest("people", (keys || ""), "", function(people) {
    dataList = JSON.parse(people);
    data = "";

    if(dataList.length == 0)
      return;

    for (let i = 0; i < dataList.length; ++i) {
      elem = dataList[i];

      //Get the url of the blob 
      /*audioBin = convertDataURIToBinary(elem.audio);
      blob = new Blob([audioBin], {type: 'audio/wav'});
      blobURL = URL.createObjectURL(blob);*/

      elem.blobURL = (blobURL || "");

      /*data += '\
              <tr id="'+ elem.id +'">\
                <td>'+ elem.name +'</td>\
                <td>' + elem.office + '</td>\
                <td>\
                  <audio controls>\
                      <source src="'+ (blobURL || "") +'" type="audio/wav">\
                  </audio>\
                </td>\
                <td class="column-auto">\
                  <button type="button" class="btn btn-table" onclick="editField(this)">\
                    <i class="mdi mdi-pencil menu-icon table-icon"></i> Edit\
                  </button>\
                  <button type="button" class="btn btn-table onclick="removeElement(this)"">\
                    <i class="mdi mdi-delete menu-icon table-icon"></i> Delete\
                  </button>\
                </td>\
              </tr>'*/
    }

    //tableContent.innerHTML = data;
  });
}

function getGroupData(keys = undefined) {

  getHTMLRequest("groups", (keys || ""), "", function(groups) {
    dataList = JSON.parse(groups);
    data = "";

    for (let i = 0; i < dataList.length; ++i) {
      elem = dataList[i];

      //Get the url of the blob 
      //audioBin = convertDataURIToBinary(elem.audio);
      //blob = new Blob([audioBin], {type: 'audio/wav'});
      //blobURL = URL.createObjectURL(blob);

      data += '\
              <tr id="'+ elem.id +'">\
                <td>'+ elem.name +'</td>\
                <td>' + elem.office + '</td>\
                <td>' + elem.leader + '</td>\
                <td>\
                  <audio controls>\
                      <source src="'+ (blobURL || "") +'" type="audio/wav">\
                  </audio>\
                </td>\
                <td class="column-auto">\
                  <button type="button" class="btn btn-table" onclick="editField(this)">\
                    <i class="mdi mdi-pencil menu-icon table-icon"></i> Edit\
                  </button>\
                  <button type="button" class="btn btn-table onclick="removeElement(this)"">\
                    <i class="mdi mdi-delete menu-icon table-icon"></i> Delete\
                  </button>\
                </td>\
              </tr>'
    }

    tableContent.innerHTML = data;
  });
}

function getOfficeData(keys = undefined) {

  getHTMLRequest("offices", (keys || ""), "", function(offices) {
    dataList = JSON.parse(offices);
    data = "";

    for (let i = 0; i < dataList.length; ++i) {
      elem = dataList[i];

      //Get the url of the blob 
      //audioBin = convertDataURIToBinary(elem.audio);
      //blob = new Blob([audioBin], {type: 'audio/wav'});
      //blobURL = URL.createObjectURL(blob);

      data += '\
              <tr id="'+ i +'">\
                <td>'+ elem.office +'</td>\
                <td>\
                  <audio controls>\
                      <source src="'+ (blobURL || "") +'" type="audio/wav">\
                  </audio>\
                </td>\
                <td class="column-auto">\
                  <button type="button" class="btn btn-table" onclick="editField(this)">\
                    <i class="mdi mdi-pencil menu-icon table-icon"></i> Edit\
                  </button>\
                  <button type="button" class="btn btn-table onclick="removeElement(this)"">\
                    <i class="mdi mdi-delete menu-icon table-icon"></i> Delete\
                  </button>\
                </td>\
              </tr>'
    }

    tableContent.innerHTML = data;
  });
}

function getBuildingData(keys = undefined) {

  getHTMLRequest("places", (keys || ""), "", function(places) {
    dataList = JSON.parse(places);
    data = "";

    for (let i = 0; i < dataList.length; ++i) {
      elem = dataList[i];

      //Get the url of the blob 
      //audioBin = convertDataURIToBinary(elem.audio);
      //blob = new Blob([audioBin], {type: 'audio/wav'});
      //blobURL = URL.createObjectURL(blob);

      data += '\
              <tr id="'+ elem.id +'">\
                <td>'+ elem.name +'</td>\
                <td>'+ elem.id +'</td>\
                <td>\
                  <audio controls>\
                      <source src="'+ (blobURL || "") +'" type="audio/wav">\
                  </audio>\
                </td>\
                <td class="column-auto">\
                  <button type="button" class="btn btn-table" onclick="editField(this)">\
                    <i class="mdi mdi-pencil menu-icon table-icon"></i> Edit\
                  </button>\
                  <button type="button" class="btn btn-table onclick="removeElement(this)"">\
                    <i class="mdi mdi-delete menu-icon table-icon"></i> Delete\
                  </button>\
                </td>\
              </tr>'
    }

    tableContent.innerHTML = data;
  });
}

function getAudioData(keys = undefined) {

  getHTMLRequest("audios", (keys || ""), "", function(audios) {
    dataList = JSON.parse(audios);
    data = "";

    for (let i = 0; i < dataList.length; ++i) {
      elem = dataList[i];

      //Get the url of the blob 
      blob = new Blob(elem.data.data, {type: 'audio/wav'});
      console.log(blob)
      blobURL = URL.createObjectURL(elem.data);

      data += '\
              <tr id="'+ elem.id +'">\
                <td>'+ elem.name +'</td>\
                <td>\
                  <audio controls>\
                      <source src="'+ (blobURL || "") +'" type="audio/wav">\
                  </audio>\
                </td>\
                <td class="column-auto">\
                  <button type="button" class="btn btn-table" onclick="editField(this)">\
                    <i class="mdi mdi-pencil menu-icon table-icon"></i> Edit\
                  </button>\
                  <button type="button" class="btn btn-table onclick="removeElement(this)"">\
                    <i class="mdi mdi-delete menu-icon table-icon"></i> Delete\
                  </button>\
                </td>\
              </tr>'
    }

    tableContent.innerHTML = data;
  });
}

function getPhraseData(keys = undefined) {

  getHTMLRequest("phrases", (keys || ""), "", function(phrases) {
    dataList = JSON.parse(phrases);
    data = "";

    for (let i = 0; i < dataList.length; ++i) {
      elem = dataList[i];

      //Get the url of the blob 
      //audioBin = convertDataURIToBinary(elem.audio);
      //blob = new Blob([audioBin], {type: 'audio/wav'});
      //blobURL = URL.createObjectURL(blob);

      //Divide the placeholders in commas
      placeholdersList = elem.placeholders.split(",");
      placeholders = "";
      placeLength = placeholdersList.length;
      lastPlace = placeLength -1;
      
      for (let j = 0; j < placeLength; ++j) {
        placeholders += placeholdersList[j] + (j == lastPlace ? " " : ", ");
      }

      data += '\
              <tr id="'+ elem.id +'">\
                <td>'+ elem.phrase +'</td>\
                <td>'+ placeholders +'</td>\
                <td>\
                  <audio class="audioPlayer" controls>\
                      <source src="'+ (blobURL || "") +'" type="audio/wav">\
                  </audio>\
                </td>\
                <td class="column-auto">\
                  <button type="button" class="btn btn-table" onclick="editField(this)">\
                    <i class="mdi mdi-pencil menu-icon table-icon"></i> Edit\
                  </button>\
                  <button type="button" class="btn btn-table onclick="removeElement(this)"">\
                    <i class="mdi mdi-delete menu-icon table-icon"></i> Delete\
                  </button>\
                </td>\
              </tr>'
    }

    tableContent.innerHTML = data;
  });
}

//************************************************//

function changeActiveButton(button, _title, _subtitle, _columns, _hint, _addText) {
  Bactive.className = 'nav-item'
  button.className = 'nav-item active-icon'
  Bactive = button;

  //Change the title and subtitle of the page
  title.innerText = _title;
  subtitle.innerText = _subtitle;

  //Change the table Column layout
  columnNames.innerHTML = _columns;

  //Change the placeholder of the search bar
  searchBar.placeholder = _hint;

  //Change the text of the add button
  addButtonText.innerText = _addText;
};

//People menu button logic
BPeople.onclick = function() {
  //Change the active button
  changeActiveButton(this, peopleTitle, peopleSubTitle, peopleColumns, peopleHint, peopleAddText);
  //Get the data of the people
  getPeopleData();

  //Change the Add modal
  addContent.innerHTML = generatePeopleModal();
};

//Group menu button logic
BGroups.onclick = function() {
  //Change the active button
  changeActiveButton(this, groupsTitle, groupsSubTitle, groupsColumns, groupsHint, groupsAddText);
  tableContent.innerHTML = getGroupData();

  //Change the Add modal
  addContent.innerHTML = generateGroupModal();
};

//Offices menu button logic
BOffices.onclick = function() {
  //Change the active button
  changeActiveButton(this, officeTitle, officeSubTitle, officeColumns, officeHint, officeAddText);
  tableContent.innerHTML = getOfficeData();

  //Change the Add modal
  addContent.innerHTML = generateOfficeModal();
};

//Buildings menu button logic
BBuildings.onclick = function() {
  //Change the active button
  changeActiveButton(this, buildingsTitle, buildingsSubTitle, buildingsColumns, buildingsHint, buildingsAddText);
  tableContent.innerHTML = getBuildingData();

  //Change the Add modal
  addContent.innerHTML = generateBuildingModal();
};

BAudios.onclick = function() {
  //Change the active button
  changeActiveButton(this, audiosTitle, audiosSubTitle, audiosColumns, audiosHint, audiosAddText);
  tableContent.innerHTML = getAudioData();

  //Change the Add modal
  addContent.innerHTML = generateAudioModal();
}

BPhrases.onclick = function() {
  //Change the active button
  changeActiveButton(this, phrasesTitle, phrasesSubTitle, phrasesColumns, phrasesHint, phrasesAddText);
  tableContent.innerHTML = getPhraseData();

  //Change the Add modal
  addContent.innerHTML = generatePhraseModal();
}

function removeElement(elem) {
  //Show the modal of delete
  deletemodal.modal('show');

  document.getElementById('deleteBModal').onclick = function() {
    elem.parentElement.parentElement.remove(); //We get the root and delete it!!
    deletemodal.modal('hide'); //Hide the modal
  }      
}

function generatePeopleModal(name = undefined, office = undefined, audio = undefined) {

  let content = '<div class="container">\
        \
        <div class="row">\
          <div class="col-sm">\
            <div class="form-group">\
              <label for="inputUserName">Name</label>\
              <input type="text" class="form-control" id="inputUserName" placeholder="Enter the worker name" value="'+ (name || "") +'">\
            </div>\
          </div>\
          \
          <div class="col-sm">\
            <div class="form-group">\
              <label class="my-1 mr-2" for="inlineFormCustomSelectPref">Office number</label>\
              <select class="custom-select my-1 mr-sm-2" id="inlineFormCustomSelectPref">\
                <option selected>'+ (office || "Select an office") +'</option>\
                <option value="1">1234</option>\
                <option value="2">4567</option>\
                <option value="3">8912</option>\
              </select>\
            </div>\
          </div>\
        </div>\
        \
      </div>\
      \
      <div class="form-group">\
        <label for="inputAudioLink">Audio link</label>\
        <input type="url" class="form-control" id="inputAudioLink" placeholder="Enter the audio link" value="'+ (audio || "") +'">\
      </div>';

  return content;
}

function generateGroupModal(name = undefined, leader = undefined, office = undefined, audio = undefined) {

  let content = '<div class="form-group">\
        <label for="inputLeaderName">Group name</label>\
        <input type="text" class="form-control" id="inputGroupName" placeholder="Enter the name of the group" value="'+ (name || "") +'">\
      </div>\
      <div class="container">\
        \
        <div class="row">\
          <div class="col-sm">\
            <div class="form-group">\
              <label for="inputUserName">Leader</label>\
              <input type="text" class="form-control" id="inputLeaderName" placeholder="Enter the name of the leader" value="'+ (leader || "") +'">\
            </div>\
          </div>\
          \
          <div class="col-sm">\
            <div class="form-group">\
              <label class="my-1 mr-2" for="inlineFormCustomSelectPref">Office number</label>\
              <select class="custom-select my-1 mr-sm-2" id="inlineFormCustomSelectPref">\
                <option selected>'+ (office || "Select an office") +'</option>\
                <option value="1">1234</option>\
                <option value="2">4567</option>\
                <option value="3">8912</option>\
              </select>\
            </div>\
          </div>\
        </div>\
        \
      </div>\
      \
      <div class="form-group">\
        <label for="inputAudioLink">Audio link</label>\
        <input type="url" class="form-control" id="inputAudioLink" placeholder="Enter the audio link" value="'+ (audio || "") +'">\
      </div>';

      return content;
}

function generateOfficeModal(office = undefined, audio = undefined) {

  let content = '<div class="form-group">\
        <label for="inputUserName">Office number</label>\
        <input type="number" class="form-control" id="inputUserName" placeholder="Enter the office number" value="'+ (office || "") +'">\
      </div>\
      <div class="form-group">\
        <label for="inputAudioLink">Audio link</label>\
        <input type="url" class="form-control" id="inputAudioLink" placeholder="Enter the audio link" value="'+ (audio || "") +'">\
      </div>';

  return content;
}

function generateBuildingModal(name = undefined, number = undefined, audio = undefined) {

  let content = '<div class="container">\
    \
    <div class="row">\
      <div class="col-sm">\
        <div class="form-group">\
          <label for="inputUserName">Name</label>\
          <input type="text" class="form-control" id="inputUserName" placeholder="Enter the building name" value="'+ (name || "")+'">\
        </div>\
      </div>\
      \
      <div class="col-sm">\
        <div class="form-group">\
          <label for="inputUserName">Number</label>\
          <input type="number" class="form-control" id="inputUserName" placeholder="Enter the building number" value="'+ (number || "") +'">\
        </div>\
      </div>\
    \
    </div>\
    \
  </div>\
  \
  <div class="form-group">\
    <label for="inputAudioLink">Audio link</label>\
    <input type="url" class="form-control" id="inputAudioLink" placeholder="Enter the audio link" value="'+ (audio || "") +'">\
  </div>';

  return content;
}

function generateAudioModal(transcript = undefined, audio = undefined) {

  let content = '<div class="form-group">\
    <label for="inputAudioTranscript">Transcript</label>\
    <textarea class="form-control" id="inputAudioTranscript" rows="3">'+ (transcript || "") +'</textarea>\
  </div>\
      \
  <div class="form-group">\
    <label for="inputAudioLink">Audio link</label>\
    <input type="url" class="form-control" id="inputAudioLink" placeholder="Enter the audio link" value="'+ (audio || "") +'">\
  </div>';

  return content;
}

function generatePhraseModal(phrase = undefined, placeholders = undefined, audio = undefined) {

  let content = '<div class="form-group">\
    <label for="inputPhrase">Transcript</label>\
    <textarea class="form-control" id="inputPhrase">'+ (phrase || "") +'</textarea>\
  </div>\
  \
  <div class="form-group">\
    <label for="inputPlaceholders">Placeholders</label>\
    <textarea class="form-control" id="inputPlaceholders">'+ (placeholders || "") +'</textarea>\
  </div>\
      \
  <div class="form-group">\
    <label for="inputAudioLink">Audio link</label>\
    <input type="url" class="form-control" id="inputAudioLink" placeholder="Enter the audio link" value="'+ (audio || "")+'">\
  </div>';

  return content;
}

function editField(elem) {
  //Show the modal of delete
  editmodal.modal('show');

  let elems = elem.parentElement.parentElement.children;

  if (Bactive.id == 'bpeople')
  {
    let name = elems[0].innerText;
    let office = elems[1].innerText;
    let audio = elems[2].children[0].children[0].src;

    editTitle.innerText = "Editing " + name + " information";
    editContent.innerHTML = generatePeopleModal(name, office, audio);

    //The save functionality
    saveButton.onclick = function() {
      //Show the modal of delete
      editmodal.modal('hide');
    }

  }
  else if (Bactive.id == 'bgroups')
  {
    let name = elems[0].innerText;
    let office = elems[1].innerText;
    let leader = elems[2].innerText;
    let audio = elems[3].children[0].children[0].src;

    editTitle.innerText = "Editing " + name + " group information";
    editContent.innerHTML = generateGroupModal(name, leader, office, audio );

    //The save functionality
    saveButton.onclick = function() {
      //Show the modal of delete
      editmodal.modal('hide');
    }

  }
  else if (Bactive.id == 'boffices')
  {
    let office = elems[0].innerText;
    let audio = elems[1].children[0].children[0].src;

    editTitle.innerText = "Editing office " + office + " information";
    editContent.innerHTML = generateOfficeModal(office, audio); 

    //The save functionality
    saveButton.onclick = function() {
      //Show the modal of delete
      editmodal.modal('hide');
    }

  }
  else if (Bactive.id == 'bbuildings')
  {
    let name = elems[0].innerText;
    let number = elems[1].innerText;
    let audio = elems[2].children[0].children[0].src;

    editTitle.innerText = "Editing " + name + " information";
    editContent.innerHTML = generateBuildingModal(name, number, audio);

    //The save functionality
    saveButton.onclick = function() {
      //Show the modal of delete
      editmodal.modal('hide');
    }

  }
  else if (Bactive.id == 'baudios')
  {
    let transcript = elems[0].innerText;
    let audio = elems[1].children[0].children[0].src;

    editTitle.innerText = "Editing audio information";
    editContent.innerHTML = generateAudioModal(transcript, audio);

    //The save functionality
    saveButton.onclick = function() {
      //Show the modal of delete
      editmodal.modal('hide');
    }

  }
  else if (Bactive.id == 'bphrases')
  {
    let phrase = elems[0].innerText;
    let placeholders = elems[1].innerText;
    let audio = elems[2].children[0].children[0].src;

    editTitle.innerText = "Editing audio information";
    editContent.innerHTML = generatePhraseModal(phrase, placeholders, audio);

    //The save functionality
    saveButton.onclick = function() {
      //Show the modal of delete
      editmodal.modal('hide');
    }

  }
}

addButton.onclick = function() {
  //Show the modal of delete
  addModal.modal('show');
}

//Load the default view
BPeople.click();