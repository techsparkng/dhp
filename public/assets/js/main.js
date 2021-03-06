$(".m-right i.fa-bars").click(function() {
	$(".m-right nav").show(function() {
		$(this).animate({
			opacity: 1,
			right: 0
		}, 500);
	});
})

$(document).click(function (e) {
	if (!($(e.target).is('.m-right nav')) && !($(e.target).is(".m-right i.fa-bars"))) {
		$(".m-right nav").animate({
			opacity: 0,
			right: -260
		}, 500);
	}
});

$("#tab1").on("click", function() {
	$(".withdrawals").fadeOut(function() {
		$(".deposits").fadeIn();
	});
	$(this).addClass("active-tab");
	$("#tab2").removeClass("active-tab");
});

$("#tab2").on("click", function() {
	$(".deposits").fadeOut(function() {
		$(".withdrawals").fadeIn();
	});
	$(this).addClass("active-tab");
	$("#tab1").removeClass("active-tab");
});

// posts config
var counter = 0;

$(".control-left").on("click", function() {
	
	if (counter !== 1500) {
		$(".post").animate({
			left: "-=300px"
		});
		counter += 300;
		console.log(counter);
	}
	
});

$(".control-right").on("click", function() {
	if (counter !== 0) {
		$(".post").animate({
			left: "+=300px"
		});
		counter -= 300;
		console.log(counter);
	}
});

// profit calculator
var amt, profit, net_return, plan;

var percent = 1.3;
$("#calc_plan").on("change", function(e) {
	plan = $(this).find('option:selected').val();

	if (plan == 1) {
		percent = 1.4;
		$("#assign_per").val("140%");
	}

	if (plan == 2) {
		percent = 1.6;
		$("#assign_per").val("140%");
	}

	if (plan == 3) {
		percent = 1.4;
		$("#assign_per").val("160%");
	}
	calculate();
});

$("#inv_amount").on("keypress", function() {
	calculate();
})

function calculate() {
	amt = Number($("#inv_amount").val().replace(/,/g , ""));
	console.log(amt);
	profit = percent * amt;
	formatted_profit = "\u20A6" + String(profit);
	net_return = amt + profit;
	formatted_returns = "\u20A6" + String(net_return);
	$("#net_profit").val(formatted_profit);
	$("#returns").val(formatted_returns);
}