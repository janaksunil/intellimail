const submitButton = document.getElementsByClassName('submitButton');

submitButton[0].addEventListener('click', function () {
   // user should have signed up!
    chrome.storage.local.set({'hasRegistered': "true"});
});