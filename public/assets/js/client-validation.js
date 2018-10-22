$(document).ready(function () {
  login();
  register();
  InvestDropdown();
  investBtn();
  alertFocus();
  amountValid();
  updateProfile();
  $(".amountInvested, .accNo, .phonenumber").keydown(function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if (
      $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
      // Allow: Ctrl+A, Command+A
      (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: home, end, left, right, down, up
      (e.keyCode >= 35 && e.keyCode <= 40)
    ) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  });
});

// <!-- START OF LOGIN/REGISTRATION PAGE VALIDATIONS -->
function login() {
  //Validation for Login
  $(document).on("click", ".submit-btn", function (e) {
    var username = $(".usern").val();
    var password = $(".passw").val();

    $(".usern, .passw").on("focus", function () {
      $(".usern, .passw, .input-group-text").removeClass("has-error");
      closeAlert();
    });

    if ($.trim(username).length == "" && $.trim(password).length == "") {
      $(".usern, .passw, .input-group-text").addClass("has-error");
      $(".input-group-text").css("fa-times-circle-o");

      $(".ALert").html(
        '<div class="alert alert-danger-alt" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span style="color:#fff" aria-hidden="true">&times;</span></button><strong>Error!</strong> Username and Password field cannot be empty!</div>'
      );

      return false;
      //e.preventDefault();
    }

    if ($.trim(username).length == "") {
      $(".usern").addClass("has-error");
      $(".usern")
        .siblings(".input-group-append")
        .find(".input-group-text")
        .addClass("has-error");
      $(".ALert").html(
        '<div class="alert alert-danger-alt" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span style="color:#fff" aria-hidden="true">&times;</span></button><strong>Error!</strong> Username field cannot be empty!</div>'
      );
      return false;
    }

    if ($.trim(password).length == "") {
      $(".passw").addClass("has-error");
      $(".passw")
        .siblings(".input-group-append")
        .find(".input-group-text")
        .addClass("has-error");
      $(".ALert").html(
        '<div class="alert alert-danger-alt" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span style="color:#fff" aria-hidden="true">&times;</span></button><strong>Error!</strong> Password field cannot be empty!</div>'
      );
      return false;
    }
  });
}

function register() {
  //Validaion for Registration

  $(".submit-btn-reg").click(function () {
    var first = $(".first").val();
    var last = $(".last").val();
    var email = $(".email").val();
    var username = $(".usern").val();
    var password = $(".pw1").val();
    var password2 = $(".pw2").val();

    $(".first, .last, .email, .usern, .pw1, .pw2").on("focus", function () {
      $(
        ".first, .last, .email, .usern, .pw1, .pw2, .input-group-text"
      ).removeClass("has-error");
      closeAlert();
    });

    if (
      $.trim(first).length > 0 &&
      $.trim(last).length > 0 &&
      $.trim(email).length > 0 &&
      $.trim(username).length > 0 &&
      $.trim(password).length > 0 &&
      $.trim(password2).length > 0
    ) {
      var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (regex.test(email)) {
        if (password2 != password) {
          $(".pw2").addClass("has-error");
          $(".pw2")
            .siblings(".input-group-append")
            .find(".input-group-text")
            .addClass("has-error");
          $(".ALert").html(
            '<div class="alert alert-danger-alt" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span style="color:#fff" aria-hidden="true">&times;</span></button><strong>Error!</strong> Passwords do not match!</div>'
          );
          return false;
        }
      } else {
        $(".email").addClass("has-error");
        $(".email")
          .siblings(".input-group-append")
          .find(".input-group-text")
          .addClass("has-error");
        $(".ALert").html(
          '<div class="alert alert-danger-alt" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span style="color:#fff" aria-hidden="true">&times;</span></button><strong>Error!</strong> E-mail format is invalid!</div>'
        );
        return false;
      }
    } else {
      $(
        ".first, .last, .email, .usern, .pw1, .pw2, .input-group-text"
      ).addClass("has-error");
      $(".ALert").html(
        '<div class="alert alert-danger-alt" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span style="color:#fff" aria-hidden="true">&times;</span></button><strong>Error!</strong> All fields are required for registration!</div>'
      );
      return false;
    }
  });
}
// <!-- END OF LOGIN/REGISTRATION PAGE VALIDATIONS -->

// <!-- START OF INVEST PAGE VALIDATIONS -->
//investment Packages dropdown
function InvestDropdown() {
  $("#package_plan").on("change", function (e) {
    var $plan;
    var amountInvested = $(".amountInvested").val();
    $plan = $(this)
      .find("option:selected")
      .val();
    if (
      ($plan == "Investor" && amountInvested == "") ||
      ($plan == "Partner" && amountInvested == "")
    ) {
      $(".amountInvested").addClass("has-error");
      $(".ALert").html(
        '<div class="alert alert-danger-alt" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span style="color:#fff" aria-hidden="true">&times;</span></button><strong>Error!</strong> Enter an amount for investment!</div>'
      );
      return false;
    }

    if (
      ($plan == "Investor" && parseFloat(amountInvested) < 20000) ||
      ($plan == "Investor" && parseFloat(amountInvested) > 1000000)
    ) {
      $(".amountInvested").addClass("has-error");
      $(".ALert").html(
        '<div class="alert alert-danger-alt" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span style="color:#fff" aria-hidden="true">&times;</span></button><strong>Error!</strong> Investment amount cannot be less than ₦20,000 or greater than ₦1,000,000 for <strong>Investor package</strong>!</div>'
      );
      $(".invest-btn").attr("disabled", "disabled");
      $('select option:contains("- Choose Option -")').prop("selected", true);
      return false;
    } else {
      $("#payment_opt").removeAttr("disabled");
    }

    if (
      ($plan == "Partner" && parseFloat(amountInvested) < 10000) ||
      ($plan == "Partner" && parseFloat(amountInvested) > 5000000)
    ) {
      $(".amountInvested").addClass("has-error");
      $(".ALert").html(
        '<div class="alert alert-danger-alt" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span style="color:#fff" aria-hidden="true">&times;</span></button><strong>Error!</strong> Investment amount cannot be less than ₦10,000 or greater than ₦5,000,000 for this package!</div>'
      );
      $(".invest-btn").attr("disabled", "disabled");
      $('select option:contains("- Choose Option -")').prop("selected", true);
      return false;
    }
    if (
      ($plan == "Partner" && parseFloat(amountInvested) >= 10000) ||
      ($plan == "Partner" && parseFloat(amountInvested) <= 5000000)
    ) {
      $("#payment_opt").removeAttr("disabled");
    }

    //closeAlert();
  });
}

function amountValid() {
  //var amount = $(".amountInvested").val();
  $(".amountInvested").on("input", function () {
    var amount = this.value;
    if (amount >= 10000) {
      if (amount > 5000000) {
        $(".amountInvested").addClass("has-error");
        $("#package_plan").attr("disabled", "disabled");
        $('select option:contains("- Choose Option -")').prop("selected", true);
        $(".ALert").html(
          '<div class="alert alert-danger-alt" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span style="color:#fff" aria-hidden="true">&times;</span></button><strong>Error!</strong> Amount exceeds our investment packages!</div>'
        );
        return false;
      }
      if (amount < 10000) {
        $("#package_plan").attr("disabled", "disabled");
        $(".amountInvested").addClass("has-error");
        $(".ALert").html(
          '<div class="alert alert-danger-alt" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span style="color:#fff" aria-hidden="true">&times;</span></button><strong>Error!</strong> Amount too small for our investment packages!</div>'
        );
        return false;
      }
      if (amount >= 10000 && amount <= 500000) {
        $(".amountInvested").removeClass("has-error");
        $("#package_plan").removeAttr("disabled");
      }
    }
  });

  closeAlert();
}
//When invest submit button is clicked
function investBtn() {
  $(".invest-btn").click(function () {
    var amountInvested = $(".amountInvested").val();
    var plan = $("#package_plan")
      .find("option:selected")
      .val();
    var bankname = $("#select_bank")
      .find("option:selected")
      .val();

    if (amountInvested == "") {
      $(".amountInvested").addClass("has-error");
      $(".ALert").html(
        '<div class="alert alert-danger-alt" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span style="color:#fff" aria-hidden="true">&times;</span></button><strong>Error!</strong> Enter an amount for investment!</div>'
      );
      return false;
    }
    if (plan == "") {
      $("#package_plan").addClass("has-error");
      $(".ALert").html(
        '<div class="alert alert-danger-alt" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span style="color:#fff" aria-hidden="true">&times;</span></button><strong>Error!</strong> Select an investment package!</div>'
      );
      return false;
    }
    if (bankname == "") {
      $("#select_bank").addClass("has-error");
      $(".ALert").html(
        '<div class="alert alert-danger-alt" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span style="color:#fff" aria-hidden="true">&times;</span></button><strong>Error!</strong> Select a bank for deposit!</div>'
      );
      return false;
    }
  });
}

function alertFocus() {
  $(".amountInvested").on("focus", function () {
    $(".amountInvested").removeClass("has-error");
    //closeAlert();
  });

  $("#package_plan").on("focus", function () {
    $("#package_plan").removeClass("has-error");
    closeAlert();
  });
}
// <!-- END OF INVEST PAGE VALIDATIONS -->

// <!-- START OF PROFILE UPDATE PAGE VALIDATIONS -->

function updateProfile() {
  $(".mr-2").click(function () {
    var first = $(".firstname").val();
    var last = $(".lastname").val();
    var email = $(".emailp").val();
    var gender = $(".gender").val();
    var address = $(".address").val();
    var phone = $(".phonenumber").val();
    var bankname = $(".bankname").val();
    var acctname = $(".acctnanme").val();
    var acctno = $(".accNo").val();

    alert(
      first,
      last,
      email,
      gender,
      address,
      phonenumber,
      bankname,
      acctname,
      accNo
    );


    $(".firstname, .lastname, .email, .gender, .address, .phonenumber, .bankname, .acctname, .accNo").on("focus", function () {
      $(
        ".firstname, .lastname, .email, .gender, .address, .phonenumber, .bankname, .acctname, .accNo"
      ).removeClass("has-error");
      closeAlert();
    });
    if (
      $.trim(first).length > 0 &&
      $.trim(last).length > 0 &&
      $.trim(email).length > 0 &&
      $.trim(gender).length > 0 &&
      $.trim(address).length > 0 &&
      $.trim(phone).length > 0 &&
      $.trim(bankname).length > 0 &&
      $.trim(acctname).length > 0 &&
      $.trim(acctno).length > 0
    ) {

    } else {
      $(
        ".firstname, .lastname, .email, .gender, .address, .phonenumber, .bankname, .acctname, .accNo"
      ).addClass("has-error");
      $(".ALert").html(
        '<div class="alert alert-danger-alt" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span style="color:#fff" aria-hidden="true">&times;</span></button><strong>Error!</strong> All fields are required for registration!</div>'
      );
      return false;
    }
    //return false;
  });
}

// <!-- END OF INVEST PAGE VALIDATIONS -->
function closeAlert() {
  window.setTimeout(function () {
    $(".alert")
      .fadeTo(500, 0)
      .slideUp(500, function () {
        $(this).remove();
      });
  }, 4000);
}