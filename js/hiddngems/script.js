$(document).ready(function () {
  var trigger = $('.hamburger'),
  overlay = $('.overlay'),
  isClosed = false;

  //call the menu to open
  trigger.click(function () {
    hamburger_cross();
  });

  // team menu item and bio container variables
  var team = $('.team');
  var bio = $('.bio');
  var container = $('.container');

  container.css("display", "none");


  //hide container div on page load
  //call the team modal function
  team.click(function () {
    team_modal();
  });

  //Open the bio container window when the team menu item is clicked
  function team_modal(){
    container.show();
  }

  //If menu is clicked, change the class to open it
  //If X(close) is clicked, close the menu
  function hamburger_cross() {
    if (isClosed == true) {
      overlay.hide();
      trigger.removeClass('is-open');
      trigger.addClass('is-closed');
      container.hide();
      isClosed = false;
    } else {
      overlay.show();
      trigger.removeClass('is-closed');
      trigger.addClass('is-open');
      isClosed = true;
    }
  }

  //add.remove the class toggled to the wrapper container when clicked
  $('[data-toggle="offcanvas"]').click(function () {
    $('#wrapper').toggleClass('toggled');
  });
});
