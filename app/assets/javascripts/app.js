App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error("User denied account access")
      }
    }
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    console.log(web3);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('/abi', function(data) {
      var ElectionArtifact = data;
      App.contracts.Election = TruffleContract(ElectionArtifact);
      App.contracts.Election.setProvider(App.web3Provider);
      App.fetchRegisterStatus();
    });
  },

  // if airline confirm user's request, create a record in blockchain
  createOrderRequest: function(isExecute){
    var airlineInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      var requestID;
      var orderID;

      App.contracts.Election.deployed().then(function(instance) {
        airlineInstance = instance;
        // Execute adopt as a transaction by sending account

        // get user request info
        // orderID, request
        requestID = parseInt($('#request-id').text());
        orderID = parseInt($('#order-id').text());
        var seat = $('#n-seat').text();
        var date = $('#n-date').text();
        var departure = $('#n-departure').text();
        var arrival = $('#n-arrival').text();
        var airlineID = $('#n-ac-id').text();
        var hashValue = hash(seat, date, departure, arrival, airlineID);
        return airlineInstance.createOrderRequest(requestID, isExecute, hashValue);
      }).then(function(result) {
        $.post('/orders/' + orderID.toString() + '/confirm', {
          request_id: requestID,
          tx: result.tx,
          is_execute: isExecute,
          accountAddress: account,
        }, function(data, textStatus, xhr) {
          window.location.href = '/';
        });
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  transfer: function(){
    var airlineInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      var seat = $('#n-seat').text();
      var date = $('#n-date').text();
      var departure = $('#n-departure').text();
      var arrival = $('#n-arrival').text();
      var airlineID = $('#n-ac-id').text();
      var hashValue = hash(seat, date, departure, arrival, airlineID);

      App.contracts.Election.deployed().then(function(instance) {
        airlineInstance = instance;
        var requestID = parseInt($('#request-id').text());
        var orderID = parseInt($('#order-id').text());
        return airlineInstance.request(requestID, hashValue);
      }).then(function(result) {
        var orderID = $('#order-id').text();
        var requestID = $('#request-id').text();
        var airlineID = $('input[name=airline]:checked').val();
        $.post('/orders/' + orderID + '/transfer', {requestID: requestID, airlineID: airlineID}, function(data, textStatus, xhr) {
            window.location.href = '/';
        });
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  rejectRequest: function(){
    var airlineInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      var requestID;
      var orderID;

      App.contracts.Election.deployed().then(function(instance) {
        airlineInstance = instance;
        requestID = parseInt($('#request-id').text());
        orderID = parseInt($('#order-id').text());
        var hashValue = ''

        // hashValue is empty since there's no valid request was confirm
        return airlineInstance.createOrderRequest(requestID, false, hashValue);
      }).then(function(result) {
        $.post('/orders/' + orderID.toString() + '/reject', {
          request_id: requestID,
          tx: result.tx,
          is_execute: false,
          accountAddress: account,
        }, function(data, textStatus, xhr) {
          window.location.href = '/';
        });
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  fetchRegisterStatus: function(){
    var airlineInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.Election.deployed().then(function(instance) {
        airlineInstance = instance;
        // hashValue is empty since there's no valid request was confirm
        return airlineInstance.member(account);
      }).then(function(result) {
        if(result.toString() == '0') $('#register').show();
        else $('#already-register').show();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  register: function(){
    var airlineInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.Election.deployed().then(function(instance) {
        airlineInstance = instance;
        // hashValue is empty since there's no valid request was confirm
        return airlineInstance.register({from: account, gas: 3000000, value: 10000});
      }).then(function(result) {
        debugger
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  pay: function(receiver, payID){
    var airlineInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.Election.deployed().then(function(instance) {
        airlineInstance = instance;
        // var receiver = ()
        // return airlineInstance.register({from: account, gas: 3000000, value: 10000});
        web3.eth.sendTransaction({to: receiver, from: account, value: web3.toWei("1", "ether")}, function(err, res){

          $.post('/settle_payment', {pay_id: payID}, function(data, textStatus, xhr) {
            window.location.href = '/';
          });
        });
      });
    });
  },
};

//call function with value
// myContractInstance.depositFunds({from: web3.eth.accounts[0], gas: 3000000, value: 100}, function(err, res){});


// send money
// web3.sendTransaction({to:receiver, from:sender, value:web3.toWei("0.5", "ether")})

$(function() {
  $(window).load(function() {
    App.init();
  });
  $('#confirm').click(function(event) {
    App.createOrderRequest(true);
  });

  $('#reject').click(function(event) {
    App.rejectRequest();
  });

  $('#transfer').click(function(event) {
    App.transfer();
  });

  $('#register').click(function(event) {
    App.register();
  });

  $('#pay').click(function(event) {
    var receiver = $(this).attr('address');
    var payID = $(this).attr('payID');
    App.pay(receiver, payID);
  });
});

function hash(){
  var args = arguments;
  var rawData = "";
  for(var i = 0; i < args.length; i++){
    rawData += arguments[i] + '-';
  }
  return CryptoJS.SHA3(rawData).toString();
}
