$(document).ready(function() {
  //Validation for Login
  $(".submit-btn").click(function(e) {
    var username = $(".usern").val();
    var password = $(".passw").val();
    console.log(username, password);
    $(".usern, .passw").on("focus", function() {
      $(".usern, .passw, .input-group-text").removeClass("has-error");
    });

    if ($.trim(username).length == "" || $.trim(password).length == "") {
      $(".usern, .passw, .input-group-text").addClass("has-error");

      $(".ALert").html(
        '<div class="alert alert-danger-alt" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span style="color:#fff" aria-hidden="true">&times;</span></button><strong>Error!</strong> Username/Password field cannot be empty!</div>'
      );

      return false;
      //e.preventDefault();
    }
  });

  window.setTimeout(function() {
    $(".alert")
      .fadeTo(500, 0)
      .slideUp(500, function() {
        $(this).remove();
      });
  }, 4000);

  //Validaion for Registration
});
