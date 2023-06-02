/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function dropdownOpponents() {
  document.getElementById("opponentDropdown").classList.toggle("show");
}

function dropdownGrids() {
  document.getElementById("gridDropdown").classList.toggle("show");
}

function dropdownVariations() {
  document.getElementById("variationDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

//from w3schools and referenced in report
