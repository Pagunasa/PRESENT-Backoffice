//*************** HTML REQUEST ***************//
let baseURL = "http://dtic-recepcionist.upf.edu:3000";
let xmlHttp = new XMLHttpRequest();

function postHTMLRequest(extraURL, keys, body, callbackOk, callbackError) {
  
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == XMLHttpRequest.DONE)
      if (xmlHttp.status == 200)
        callback(xmlHttp.responseText);
      else if (xmlHttp.status == 404 || xmlHttp.status == 401)
        callbackError(xmlHttp.status);
  }

  xmlHttp.open("POST", baseURL+"/"+extraURL, true);
  xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  //Comentado por un bug
  xmlHttp.send((JSON.stringify(body) || ""));
}
//********************************************//

/*************************************/
/*           LOGIN LOGIC             */
/*************************************/
let bcrypt;

require.config({
    paths: { "bcrypt": "js/bcrypt.min" }
});

require(["bcrypt"], function(_bcrypt) {
    bcrypt = _bcrypt;
});

hashPassword = async (body) => {
  body.password = await bcrypt.hash(body.password, 8);
}

let BLogin = document.getElementById("loginButton");
let nameInput = document.getElementById("usernameInput");
let psswInput = document.getElementById("passwordInput");
let body = {};

BLogin.onclick = async () => {
  body.username = nameInput.value;
  body.password = psswInput.value;

  if(body.username == "") {
    createAlert('The username is required!','You must insert your username','If you can not remember it, then get in touch with the <a href="https://www.upf.edu/web/gti" target="_blank">GTI department</a>','danger', true, false, 'beautyAlerts');
    return;    
  } 
  if(body.password == "") {
    createAlert('The password is required!','You must insert your password','If you can not remember it, then get in touch with the <a href="https://www.upf.edu/web/gti" target="_blank">GTI department</a>','danger', true, false, 'beautyAlerts');
    return; 
  }


  //await hashPassword(body);
  let UPFinder_UserInfo;
  UPFinder_UserInfo = {
    token: 'token_demo',
    username: 'username_demo',
    role: 'User'
  }

  //Save in the sessionStorage the userinfo Object
  sessionStorage.setItem('UPFinder_UserInfo', JSON.stringify(UPFinder_UserInfo));
  window.location.replace("index.html");


/*  postHTMLRequest("users/login", undefined, body, 
    function(response) {
      //If the user is not active then show an alert
      if(response.state != "Active") {
        createAlert('This user is dedactivated!','',
          'If you think that this is an error please get in touch with the <a href="https://www.upf.edu/web/gti" target="_blank">GTI department</a>','danger', true, false, 'beautyAlerts');
        return;
      }
     
      //We save the token, the username and the role 
      //sessionStorage.setItem('token', response.token);
      //sessionStorage.setItem('username', response.username);
      //sessionStorage.setItem('role', response.role);

      UPFinder_UserInfo = {
        token: response.token,
        username: response.username,
        role: response.role
      }

      //Save in the sessionStorage the userinfo Object
      sessionStorage.setItem('UPFinder_UserInfo', JSON.stringify(UPFinder_UserInfo));

    },
    function(error) {
      createAlert('The user not exists!','Something is wrong!!',
        'Please check the inserted data','danger', true, false, 'beautyAlerts');
    });
    */s
}

/*{"id":1,
"username":"evalls",
"state":"Active",
//"created":"2021-09-12T22:00:00.000Z",
//"last_session":"2021-09-13T14:25:20.000Z",
"role":"Admin",
"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsImlhdCI6MTYzMjM5MDI4MCwiZXhwIjoxNjMyNDc2NjgwfQ.kPDpAb2khHNXb8FuGMTVGaCQr2KmT0oyqr_3cJRvu2k"}
*/