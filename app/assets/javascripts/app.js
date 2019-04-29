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
  }

  // Get hash valu by given data
  // Allow multiple parameter
  // fetch data from BlockChain
  // markAdopted: function(adopters, account) {
  //   var adoptionInstance;

  //   App.contracts.Election.deployed().then(function(instance) {
  //     adoptionInstance = instance;
  //     // return adoptionInstance.candidatesCount.call();
  //   }).then(function(result) {
  //     // return BlockChain API request
  //     console.log(result);
  //   /*
  //    * Replace me...
  //    */
  //  });
  // }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
  $('#confirm').click(function(event) {
    App.createOrderRequest(true)
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
